# Services — Queue, Topic, Mailbox

> **TL;DR:** Three primitives, built on crossbeam channels. Queue is point-to-point (1→1), Topic is fan-out (1→N), Mailbox is fan-in (N→1). Programs only ever see Queues — Topics and Mailboxes are plumbing created by the binary. Shutdown cascades through disconnection propagation.

---

## The Queue — The Only Atom

The Queue is the fundamental unit. Everything else is built from it.

```rust
pub struct QueueSender<T>(Sender<T>);
pub struct QueueReceiver<T>(Receiver<T>);
```

A thin wrapper around `crossbeam::channel`. The wrapper exists for one reason: **to own the type names.** Crossbeam gives you `Sender` and `Receiver`. The wat-vm gives you `QueueSender` and `QueueReceiver`. This isn't pedantry — when you read a type signature like `fn market_observer_program(candle_rx: QueueReceiver<ObsInput>, ...)`, you know exactly what you're looking at. No ambiguity. No generics leaking.

Two flavors:

- **`queue_bounded(capacity)`** — backpressure. Sender blocks when the queue is full. Used for the hot path: candle input, topic output, chain forwarding. Capacity is almost always 1 — the tightest possible coupling between producer and consumer.

- **`queue_unbounded()`** — no backpressure. Used for learn signals, DB writes, cache sets — fire-and-forget paths where you never want the producer to stall.

Error types are minimal: `SendError<T)` when the receiver is dropped, `RecvError::Disconnected` when the sender is dropped and the queue is empty. No timeout variants. No try variants on the public API (try_recv exists but is `pub(crate)` for internal use by the cache driver and mailbox).

The `inner()` method exposes the raw crossbeam receiver — used by `crossbeam::Select` in the mailbox and cache driver. It's `pub(crate)`, so programs can't touch it. They see only `recv()` and `try_recv()`.

## The Topic — Fan-Out (1→N)

One producer, N consumers. The topic is a proxy — it writes to N queues that already exist.

```
Producer → [input queue] → Fan-out thread → [queue 0, queue 1, ..., queue N-1]
```

The key insight: **programs never see a Topic.** The binary creates the output queues, gives the receivers to the downstream programs, and gives the senders to the topic. From the producer's perspective, it's sending to a `TopicSender` — same interface as a `QueueSender`. From the consumer's perspective, it's receiving from a `QueueReceiver`. The topic is invisible plumbing.

```rust
pub fn topic<T: Send + Clone + 'static>(
    capacity: usize,
    outputs: Vec<QueueSender<T>>,
) -> (TopicSender<T>, TopicHandle)
```

The fan-out thread is simple:

```rust
while let Ok(msg) = in_rx.recv() {
    for tx in &outputs {
        let _ = tx.send(msg.clone());
    }
}
```

One important detail: the bounded send means **one slow subscriber stalls all others.** This is intentional. If a position observer is slow, the market observer blocks on its topic send, which means it doesn't consume the next candle, which means the indicator bank doesn't advance. The backpressure propagates upstream naturally. No explicit flow control needed.

The `TopicHandle` holds a `JoinHandle`. The thread exits when the producer drops its `TopicSender` (the input queue disconnects). When the fan-out thread exits, its output senders drop, which causes all downstream queues to eventually see `Disconnected`. Cascade.

## The Mailbox — Fan-In (N→1)

N producers, one consumer. The mailbox is the inverse of the topic — it reads from N queues that already exist.

```
[queue 0, queue 1, ..., queue N-1] → Fan-in thread → [output queue] → Consumer
```

Again, programs never see a Mailbox directly. The binary creates the input queues, gives the senders to the upstream programs, and gives the receivers to the mailbox. The consumer sees a `MailboxReceiver` — same interface as a `QueueReceiver`.

The fan-in thread uses `crossbeam::Select`:

```rust
loop {
    if alive.is_empty() { break; }
    let mut sel = crossbeam::channel::Select::new();
    for rx in &alive {
        sel.recv(rx.inner());
    }
    let oper = sel.select();
    let idx = oper.index();
    match oper.recv(alive[idx].inner()) {
        Ok(msg) => { out_tx.send(msg); }
        Err(_) => { alive.remove(idx); }
    }
}
```

This is fair — `crossbeam::Select` wakes in arrival order, not priority order. No starvation.

The `alive` vector shrinks as producers disconnect. Partial disconnection works fine — if 3 of 5 brokers drop, the mailbox keeps reading from the remaining 2. Only when the last sender drops does the mailbox thread exit, dropping the output sender, and the consumer sees `Disconnected`.

## How They Compose

The N×M grid is built by composing these three primitives:

```
Market Observer (×N)
    ├── input: Queue<ObsInput>         [from binary]
    ├── output: Topic<MarketChain>     [fan-out to M position observers]
    └── learn: Mailbox<ObsLearn>       [fan-in from M brokers]

Position Observer (×M)
    ├── input: Queue<MarketChain>      [from topic, per-market-observer]
    ├── output: Queue<MarketPositionChain> [to broker]
    ├── learn: Mailbox<PositionLearn>  [fan-in from N brokers]
    └── trade: Mailbox<TradeUpdate>    [fan-in from N brokers]

Broker (×N×M)
    ├── input: Queue<MarketPositionChain>  [from position observer]
    ├── market_learn: Queue<ObsLearn>      [to specific market observer]
    ├── position_learn: Queue<PositionLearn> [to specific position observer]
    └── trade: Queue<TradeUpdate>         [to specific position observer]
```

Each broker has a direct `QueueSender` to its specific market observer and position observer. The observer side uses a mailbox to fan-in from all M (or N) brokers. The binary creates the individual queues, wires them into mailboxes, and distributes the senders.

## Backpressure Strategy

The system uses bounded queues (capacity 1) on the hot path and unbounded queues on the fire-and-forget paths:

- **Hot path** (candle → observer → position observer → broker): bounded(1). Tight coupling. The producer blocks until the consumer is ready. This prevents unbounded memory growth and creates natural flow control.

- **Learn path** (broker → observer): unbounded. Fire and forget. The broker should never stall because an observer is slow to learn. The learn signal is advisory, not critical-path.

- **Infrastructure path** (program → DB, program → cache, program → console): unbounded. A program should never block on logging or telemetry.

This mixed strategy means the pipeline throughput is determined by the slowest program on the hot path, while learn signals and telemetry accumulate without slowing computation.

## Disconnection as Signal

There are no explicit shutdown messages. No `PoisonPill` enum variants. No "please stop" channels. Shutdown is structural: when you drop a sender, the receiver eventually sees `Disconnected`. Every `while let Ok(msg) = rx.recv()` loop exits naturally. The type system guarantees it — `RecvError` has no "timeout" variant, only `Disconnected`.

This makes shutdown compositional. Drop the candle senders → observers exit → topics drain → position observers exit → brokers exit. Each stage triggers the next. No coordination needed.

---

## Related Concepts

- [[wat-vm]] — the binary that wires all services together
- [[programs]] — the functions that consume QueueReceivers and produce values
- [[encoding-cache]] — uses Queue + Mailbox internally for its get/set protocol
- [[chain-types]] — the data types that flow through the queues
