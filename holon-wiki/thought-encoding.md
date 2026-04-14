# Thought Encoding

> **TL;DR:** The ThoughtEncoder is the compiler for thoughts. It takes [[thought-encoding|ThoughtAST]] nodes (data structures describing what to think) and evaluates them into vectors (geometric objects that ARE the thought). It uses a deterministic [[thought-encoding|VectorManager]] for atoms and an LRU cache for compositions. Cache misses are returned as values, never written during parallel encoding.

## The Two-Layer Architecture

The encoding process has two layers:

**Layer 1: The Vocabulary produces ASTs.** Vocabulary modules are pure functions — candle in, `Vec<ThoughtAST>` out. The vocabulary says *what* to think, not *how* to compute it. Each AST node is a data structure describing a composition of [[atom|atoms]] and scalars. No vectors yet. No computation.

**Layer 2: The ThoughtEncoder evaluates ASTs.** It walks the tree bottom-up, resolving each node into a vector. Atoms come from a dictionary. Compositions come from a cache (or are computed fresh). The encoder says *how* to think efficiently.

This separation is the deferred computation pattern. The vocabulary is declarative — it describes thoughts as data. The encoder is imperative — it evaluates that data into geometry. The vocabulary doesn't know about caching. The encoder doesn't know about RSI. The AST is the interface between them.

## The ThoughtAST

The vocabulary speaks in AST nodes — an enum with six variants:

```scheme
(enum thought-ast
  (Atom name)                    ; dictionary lookup — "rsi"
  (Linear name value scale)      ; bind(atom, encode-linear)
  (Log name value)               ; bind(atom, encode-log)
  (Circular name value period)   ; bind(atom, encode-circular)
  (Bind left right)              ; compose two sub-trees
  (Bundle children))             ; superpose sub-trees
```

Examples of ASTs the vocabulary produces:

```scheme
;; Simple: RSI value
(Linear "rsi" 0.73 1.0)

;; Log-encoded: ATR ratio
(Log "atr-ratio" 1.8)

;; Circular: time of day
(Circular "hour" 14.0 24.0)

;; Composed: divergence observation
(Bind (Atom "divergence")
      (Bind (Linear "close-delta" 0.03 0.1)
            (Linear "rsi-delta" -0.05 1.0)))

;; Bundle: a full thought
(Bundle
  (Linear "rsi" 0.73 1.0)
  (Linear "macd-hist" -0.0005 0.01)
  (Linear "close-sma20" 0.023 0.1)
  (Log "atr-ratio" 1.8)
  (Circular "hour" 14.0 24.0))
```

Each variant is a deferred computation. The encoder evaluates them all the same way: walk the tree, resolve leaves first, compose parents from children.

## The Encoding Walk

The encoder evaluates the AST recursively, caching at every node:

```
encode(node):
  → Atom?         → dictionary lookup (always succeeds)
  → any other?    → cache check
      → hit:      → return cached vector
      → miss:     → compute, return vector + record miss
  → Bundle?       → always fresh (per-observer, per-candle)
```

### Atoms: The Dictionary

The [[thought-encoding|VectorManager]] provides a deterministic mapping from atom names to vectors. This dictionary is finite, closed, and pre-computed at startup. Every atom that exists is allocated before the first candle. The dictionary never grows. Nothing is evicted.

Lookup is O(1) by name. Always succeeds. No cache misses for atoms.

### Compositions: The Cache

Everything that isn't a bare Atom goes through the LRU cache. The cache key IS the AST node — its structure is its identity. Same structure, same vector.

Cache behavior depends on the node type:
- **Scalar nodes** (Linear, Log, Circular): may evict quickly because values change each candle. But within a single candle, the same scalar is reused across observers.
- **Bind nodes**: cached compositions. A bind of two known sub-trees is deterministic — same inputs, same output.
- **Bundle nodes**: always fresh. A bundle represents the current state, which changes every candle.

The cache is optimistic: use it if we have it, compute if we don't, evict when memory says so.

## Cache Misses Are Values, Not Effects

This is the critical design decision. The encode function **never writes to the cache**. It returns cache misses as values alongside the computed vector:

```scheme
(encode encoder ast) → (Vector, Vec<(ThoughtAST, Vector)>)
```

On hit: return the vector and an empty misses list.
On miss: compute the vector, return it AND the (ast, vector) pair.

The caller collects all misses. The enterprise collects misses from every step's return values and inserts them into the cache after all parallel steps complete.

**Why?** Because `ctx` is immutable during a candle. The cache mutates on miss, but ctx is borrowed by every parallel observer. Writing to the cache during parallel encoding would require locks, queues, or shared mutation — all forbidden by the "values up, not queues down" principle.

The solution: miss on candle N, insert between candles, hit on candle N+1. The cache is eventually consistent. One candle of latency. Zero locks during encoding.

## The ScalarEncoder

Three encoding schemes for continuous values:

### encode-linear(value, scale)
For naturally bounded scalars. Returns a vector whose position on a linear manifold represents the value. Nearby values → nearby vectors.

Used for: RSI, Bollinger position, Stochastic %K, SMA distances, any value with natural bounds.

### encode-log(value)
For unbounded positive scalars. Log compression: the difference between 1x and 2x matters more than 4x and 5x.

Used for: ATR ratio, volume ratio, band breakout distance, any ratio that can grow without limit.

### encode-circular(value, period)
For periodic scalars. The value wraps — hour 23 and hour 0 are adjacent in the encoding.

Used for: minute (mod 60), hour (mod 24), day-of-week (mod 7), month-of-year (mod 12).

## The VectorManager

Deterministic atom → vector allocation. Created at startup with the dimensionality (10,000). Provides:

```scheme
(get-vector vm name) → Vector
```

Same name, same vector, always. The mapping is seeded and reproducible. The identity function over opaque IDs.

The VectorManager doesn't learn. It doesn't adapt. It allocates. Every atom the vocabulary needs is allocated before the first candle. The set is closed. The mapping is frozen.

## The Observer's Encoding Path

The full path from candle to thought:

```scheme
;; 1. Observer gets candle data
;; 2. Observer calls vocabulary modules for its lens
(let ((facts (append
               (encode-oscillator-facts candle)
               (encode-momentum-facts candle)
               (encode-stochastic-facts candle)
               (encode-time-facts candle)
               (encode-standard-facts window))))
  ;; 3. Wrap in a Bundle
  (let ((thought-ast (Bundle facts)))
    ;; 4. Encode → vector + cache misses
    (encode ctx.thought-encoder thought-ast)))
  ;; Returns: (Vector, Vec<(ThoughtAST, Vector)>)
```

The observer owns step 2 and 3. The encoder owns step 4. The enterprise owns the cache insertion between candles.

## Performance

The encoder runs on a single CPU. 170 candles per second. One cosine per prediction. No GPU required. The algebra is cheap. Every operation is O(D) where D is the dimensionality — one pass through 10,000 floats.

The cache makes repeated compositions nearly free. A scalar fact that appears in multiple bundles is computed once and reused. A bind of two cached sub-trees resolves from cache. The minimum work happens.

## Related Concepts

- [[thought-system]] — the algebra the encoder evaluates
- [[thought-encoding|ThoughtAST]] — the data structure the encoder walks
- [[atom]] — the dictionary entries
- [[thought-encoding|VectorManager]] — deterministic atom allocation
- [[encoding-cache]] — the LRU cache for compositions
- [[bind]] — vertical composition in the AST
- [[bundle]] — horizontal composition in the AST
- [[fact]] — the observations the encoder produces
- [[thought-space]] — where encoded vectors live
- [[vocabulary]] — produces the ASTs the encoder consumes
