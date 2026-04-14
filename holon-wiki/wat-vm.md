# wat-vm — The Disposable Machine

> **TL;DR:** The wat-vm is a message-passing concurrent runtime — not a bytecode interpreter. It wires programs together through typed queues, feeds them data, then tears everything down in explicit order. It's called "disposable" because the binary orchestrates lifecycle: wiring → execution → shutdown, then exits.

---

## Not a VM

The name is misleading on purpose. A traditional VM executes bytecode — instructions, opcodes, a program counter. The wat-vm does none of that. There is no instruction set. There is no bytecode format. There is no interpreter loop.

What the wat-vm actually is: **a binary that wires programs together and feeds them messages.** Think of it as an FPGA, not a CPU. The topology is fixed at startup — every queue, topic, and mailbox is created in the wiring phase before any candle data flows. Once wired, data flows through the fixed graph. The binary's job is simple: connect the pipes, open the valve, close the valve, disconnect the pipes.

## Three Phases

### 1. Wiring

Before any computation happens, the binary creates every communication channel. This is the most complex part of `wat-vm.rs` because it's building an N×M grid.

The wiring creates, in order:
- **Console and database** — shared infrastructure threads that every program needs
- **Encoding cache** — the distributed LRU that all observers share
- **Handle pools** — pre-allocated handles for cache, console, and DB, distributed to programs during wiring
- **Learn queues** — N×M queues for each (market observer, position observer) pair, plus mailboxes to fan-in broker signals
- **Trade queues** — broker → position observer trade state updates, via mailboxes
- **Market observers** — each gets a candle input queue, a topic output (fan-out to M position observers), a learn mailbox (fan-in from M brokers)
- **Position observers** — each gets N input queues (one per market observer), N output queues (one per broker slot), learn mailbox, trade mailbox
- **Brokers** — each gets one input queue (the output from its position observer slot), learn senders back to both its market and position observer, a trade sender

Every `wire_*` function follows the same pattern: take domain objects and handle pools, create queues, spawn threads, return `Wired*` structs containing join handles and any remaining senders. The `HandlePool::finish()` call at the end of each wire function is a panic — if any handle is left unclaimed, it means a program was silently dropped, which causes deadlocks at shutdown.

### 2. Execution

The execution loop is trivial. For each candle stream:

```rust
while pipeline.count < max && !STOP.load(Ordering::SeqCst) {
    match pipeline.stream.next() {
        Some(ohlcv) => {
            let candle = pipeline.bank.tick(&ohlcv);
            for tx in &wired.candle_txs {
                tx.send(ObsInput { candle, window, encode_count });
            }
        }
        None => break,
    }
}
```

One loop. No orchestration. No coordination. The binary sends the candle to N market observers and forgets about it. The [[chain-types]] carry the data downstream through the pipeline. Each program is an independent thread doing its own work.

Signal handling is a single `AtomicBool`. SIGINT or SIGTERM sets it. The loop checks it every candle. No async. No cancellation tokens. One flag.

### 3. Shutdown

Shutdown is where most concurrent systems get weird. The wat-vm handles it through **cascading disconnection** — no Drop impls, no Arc, no explicit teardown messages. The sequence is:

1. **Drop candle senders** → market observers see `Disconnected` on their input queue → their `while let Ok(...)` loop exits → they drain remaining learn signals and return the trained `MarketObserver`

2. **Join market observer threads** → get trained observers back

3. **Drop topic handles** → the fan-out threads exit → position observer input queues disconnect

4. **Join position observer threads** → get trained position observers back

5. **Broker output queues disconnect** (because position observers dropped their senders) → brokers see `Disconnected` → return the trained `Broker`

6. **Join broker threads** → get trained brokers back

7. **Join cache driver** → must happen before DB driver because the cache's emit closure holds a DB sender

8. **Join DB driver** → must happen after cache driver

9. **Join console driver** → last thing, after all handles are dropped

The ordering matters. Cache before DB. DB before console. If you get it wrong, you deadlock — a driver waiting for a sender that will never be dropped because its owner is blocked joining something else.

## Why No Drop Impls

You'll notice `CacheDriverHandle` and `TopicHandle` have no `Drop` implementations. This is deliberate. Rust's drop order within a struct is unspecified (fields drop in declaration order, but struct drops themselves are not ordered relative to other drops in the same scope). If a Drop impl called `join()`, it could deadlock if the thread being joined was waiting on a channel whose sender was in the same scope.

Instead, shutdown is **explicit**. You call `join()` in the right order. The cascade guarantees that by the time you call `join()` on a thread, all its inputs have been disconnected, so it exits immediately.

## The "Disposable" Concept

The whole system is designed to be thrown away and rebuilt. The `wat/GUIDE.md` is the source of truth — the DNA. The wat s-expression files specify every struct and interface. The Rust code implements what the spec declares. Delete the Rust, run the [[wards]], the wat regenerates it.

This has been proven three times (inscriptions), each leaner than the last. The wat-vm binary itself is a product of this process — compiled from wat specifications, verified by defensive spells.

---

## Related Concepts

- [[services]] — the Queue, Topic, and Mailbox primitives that the wat-vm wires together
- [[programs]] — the independent functions that run on the wat-vm's threads
- [[chain-types]] — the typed pipeline that data flows through
- [[encoding-cache]] — the distributed LRU shared by all programs
- [[disposable-machine]] — the broader philosophy of regenerable architecture
- [[four-step-loop]] — the per-candle computation cycle within the enterprise
