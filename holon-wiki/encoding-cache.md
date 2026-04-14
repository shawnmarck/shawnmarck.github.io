# Encoding Cache — The Distributed LRU

> **TL;DR:** The encoding cache splits work between callers and a dedicated cache thread. Callers encode on their own threads (they own the leaf tools — VectorManager and ScalarEncoder). The cache thread manages only the LRU — pure gets and sets, no computation. A critical drain-sets-before-service-gets ordering prevents cache coherence failures.

---

## The Problem It Solves

Thought encoding is expensive. Each candle produces a `ThoughtAST` — a tree of atoms, bindings, and bundles. Encoding walks this tree recursively: atoms become vectors (one lookup each), binds compose vectors (one multiplication), bundles superpose vectors (one addition each). A single candle might encode 50–200 atoms, each 10,000-dimensional. That's a lot of multiply-add.

But many subtrees repeat across candles. The momentum lens always produces "close-above-sma-20". The structure lens always produces "higher-high-higher-low". Encoding these from scratch every candle is wasteful.

The cache stores `ThoughtAST → Vector` mappings. Hit means no recursive walk — just a memcpy. Miss means full encode plus install. With a 256K entry LRU and ~100K unique AST forms, the hit rate climbs above 95% after warmup.

## The Distributed Design

Most caching systems are centralized: send a key, receive a value. The cache server does all the work. This doesn't work here because encoding is CPU-bound — you'd need the cache thread to walk ASTs and do vector math, serializing all callers through one bottleneck.

The encoding cache splits the work:

- **Callers own the computation.** Each `EncodingCacheHandle` carries a `VectorManager` (atom name → vector, deterministic) and an `Arc<ScalarEncoder>` (scalar → vector, stateless). On cache miss, the caller encodes locally on its own thread. No serialization. Full parallelism.

- **The cache thread owns the storage.** It manages a single `LruCache<ThoughtAST, Vector>`. It does NOT encode. It only does get (check LRU, respond Some or None) and set (install into LRU). Pure key-value.

```
Caller thread:                          Cache thread:
  cache.get(&ast)
    → send AST to cache thread  ──────→  check LRU
    ← receive Some(vec) or None  ←──────  respond
  if None:
    encode locally (VectorManager + ScalarEncoder)
    cache.set(ast, vec)
    → send (ast, vec)  ─────────────→  install in LRU
```

## The EncodingCacheHandle

```rust
pub struct EncodingCacheHandle {
    get_tx: QueueSender<ThoughtAST>,
    get_rx: QueueReceiver<Option<Vector>>,
    set_tx: QueueSender<(ThoughtAST, Vector)>,
    vm: VectorManager,
    scalar: Arc<ScalarEncoder>,
    dims: usize,
}
```

The `get` method is the entire encoding API. Programs call `cache.get(&ast)` and receive a `Vector`. Whether it was a cache hit or miss is invisible to the caller.

```rust
pub fn get(&self, ast: &ThoughtAST) -> Option<Vector> {
    // Check cache
    self.get_tx.send(ast.clone()).ok()?;
    if let Some(cached) = self.get_rx.recv().ok()? {
        return Some(cached);
    }
    // Miss — compute locally
    let vec = match ast {
        ThoughtAST::Atom(name) => self.vm.get_vector(name),
        ThoughtAST::Bind(left, right) => {
            let l = self.get(left)?;
            let r = self.get(right)?;
            Primitives::bind(&l, &r)
        }
        ThoughtAST::Bundle(children) => {
            let vecs: Vec<Vector> = children.iter()
                .map(|c| self.get(c))
                .collect::<Option<Vec<_>>>()?;
            Primitives::bundle(&refs)
        }
        // ... Linear, Log, Circular, Sequential
    };
    // Install — fire and forget
    let _ = self.set_tx.send((ast.clone(), vec.clone()));
    Some(vec)
}
```

The recursive `self.get(left)?` and `self.get(right)?` calls check the cache at every node of the AST. If `Bind(Atom("a"), Atom("b"))` is in the cache, we get it in one round trip. If not, we check for `Atom("a")` and `Atom("b")` individually — likely hits — then compose locally. Only the top-level miss incurs a full recursive walk.

Every form is cached. Not just atoms. Not just top-level bundles. Every intermediate `Bind`, every `Bundle`, every `Sequential`. The cache stores the entire encoding tree, not just leaves.

## Drain Sets Before Service Gets

This is the most critical ordering constraint in the entire system.

The cache driver runs a three-phase loop:

1. **Drain ALL pending sets.** Non-blocking `try_recv` on the set mailbox until empty.
2. **Service ALL pending gets.** Non-blocking `try_recv` on each client's get queue.
3. **Block** until any channel has data (via `crossbeam::Select`).

Phase 1 before Phase 2. Always. No exceptions.

Why? Consider the timing:

- Candle 100 arrives. Market observer (lens "momentum") encodes a bundle of facts. Cache miss. Computes locally. Installs via `set_tx` (fire and forget).
- Same candle. Position observer queries the cache for the same bundle. Cache miss... unless the set from the market observer has been drained.

If the cache driver serviced gets before draining sets, the position observer would always miss — it's querying for what the market observer just installed, but the install hasn't been processed yet. The position observer would encode from scratch every time. 0% hit rate on shared sub-expressions. Full AST walk every candle. OOM from allocating millions of vectors.

By draining sets first, the cache guarantees that anything installed before this iteration's get is visible. The ordering is:

```
T0: Market observer sets (bundle X → vec42)
T1: Cache driver drains sets → LRU now has X → vec42
T2: Position observer gets (bundle X) → cache HIT → returns vec42
```

Without the ordering:

```
T0: Market observer sets (bundle X → vec42)
T1: Cache driver services gets first → position observer's get for X → MISS
T2: Cache driver drains sets → LRU gets X → vec42 (too late)
```

The comment in the source code says it plainly: *"If gets are serviced before sets are drained, we miss what was just installed. 0% hit rate."*

## The Set Mailbox

Sets go through a `MailboxReceiver` — fan-in from N clients. Each client has its own `QueueSender<(ThoughtAST, Vector)>`. The mailbox thread selects across all N receivers, forwarding to a single output queue that the cache driver reads.

This means sets from different programs interleave in the mailbox. A set from broker 0 and a set from market observer 3 might arrive in any order. This is fine — the LRU is a map. Last-write-wins on duplicate keys, and `ThoughtAST` implements `Hash + Eq`, so duplicate installs are idempotent.

## Gets Are Request-Response

Unlike sets (fire and forget), gets are synchronous. Each client has a dedicated request queue and response queue — not shared, not multiplexed. The cache driver iterates over all client get queues in Phase 2, servicing each one individually.

This means gets are **fair but not ordered across clients.** Client 0 and client 1 might both have pending gets; the cache services them in index order within each phase. But there's no starvation — every client gets checked every phase.

The request-response pattern means a program blocks on `get_rx.recv()` until the cache driver responds. This is acceptable because:
- The cache driver is never blocked (sets are fire-and-forget, gets are non-blocking `try_recv`)
- The only thing the cache driver does is LRU lookups — O(1) hash map access
- Response latency is dominated by the select-and-drain loop, not the LRU operation

## Telemetry and the Gate Pattern

The cache driver emits telemetry (hits, misses, cache size, hit rate) through a gate pattern. A gate is a closure `can_emit() -> bool` that returns true at most once per time window (5 seconds). After each Phase 2 (service gets), the driver checks the gate. If it opens, it calls `emit(period_hits, period_misses, cache_size)` and resets the accumulators.

At shutdown, remaining telemetry is emitted unconditionally — no gate check. This ensures the final tally is always recorded, even if the gate hasn't opened recently.

The emit closure sends metrics through a `QueueSender<LogEntry>` to the database mailbox. The cache driver holds this sender — it's captured in the closure at construction time. This is why the cache driver must be joined before the database driver at shutdown. If the database driver exits first, its mailbox drops, and the cache driver's emit closure would fail silently.

## Capacity: 256K Entries

The cache is configured with 262,144 entries (256K). With typical encoding patterns (~100K unique AST forms across all lenses), this means virtually everything fits in cache after warmup. The LRU eviction only kicks in if encoding diversity exceeds 256K — unlikely with a fixed vocabulary and fixed set of lenses.

Each entry is a `ThoughtAST` key (tree structure, maybe 200 bytes) and a `Vector` value (10,000 f64s = 80KB). At 256K entries, that's roughly 20GB of vector data. In practice, the AST keys are shared (cloned cheaply via `Arc` internally), and the vectors are stack-allocated `[f64; DIMS]` — no heap allocation per vector. The actual memory footprint is dominated by the LRU's entry overhead, not the data itself.

---

## Related Concepts

- [[thought-encoding]] — how ASTs become vectors (what the cache stores)
- [[programs]] — how programs use the EncodingCacheHandle
- [[services]] — Queue and Mailbox primitives used by the cache
- [[wat-vm]] — how the cache is wired into the runtime
- [[vocabulary]] — the set of atoms that determines encoding diversity
- [[lens]] — different vocabulary subsets that create different cache patterns
