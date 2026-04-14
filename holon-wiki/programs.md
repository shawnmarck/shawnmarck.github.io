# Programs

> *Pure functions on dedicated threads. Input: queue receivers. Output: queue senders + trained state. Shutdown: disconnection.*

Programs are the computational units of the [[Wat-VM]]. Each one is a standalone function that runs on its own thread, communicates exclusively through [[Services|queues]], and returns a trained domain object when it shuts down.

## The Pattern

Every program follows the same skeleton:

```rust
fn program(mut rx: QueueReceiver<Input>, tx: QueueSender<Output>,
           cache: CacheHandle, console: ConsoleHandle, db: DbSender) -> TrainedState {
    let mut state = State::new();
    while let Ok(input) = rx.recv() {
        let output = state.process(input);  // pure transformation
        tx.send(output);
    }
    // Disconnected — drain remaining learn signals
    state.drain();
    state  // return trained object
}
```

No callbacks. No shared mutable state. No global variables. The function receives queues, processes messages in a loop, and returns when the input sender drops.

## The Three Layers

| Layer | Programs | Role |
|-------|----------|------|
| **stdlib** | cache, database, console | Infrastructure — LRU cache, batched SQLite, serialized output |
| **app** | market_observer, position_observer, broker | Domain — trading logic, prediction, accountability |
| **chain** | MarketChain, MarketPositionChain | Types — pipeline stage proofs |

**stdlib programs** are domain-independent. The cache program manages an LRU store. The database program batches SQLite writes. The console program serializes stdout/stderr. They don't know anything about trading.

**app programs** are the trading logic. They receive market data, encode thoughts, compute predictions, track paper trades, and produce proposals.

**Chain types** are the pipeline's type system. `MarketChain` carries what the market observer produced. `MarketPositionChain` carries what both observers produced. The type **is the proof** of which stage produced the value. You can't pass a half-completed chain to a later stage — the compiler enforces it.

## Data Flow

```
Binary → [queue] → market_observer_program → [topic] → position_observer_program
                                                                    ↓
                                                              [queue]
                                                                    ↓
                                                          broker_program
                                                                    ↓
                                                              [learn queues]
```

N market observers fan-out to M position observers via a [[Services|topic]]. Each of the N×M brokers consumes from one position observer slot and sends learn signals back.

## Return Value

When a program shuts down (input disconnected), it returns its trained state. The market observer returns its [[The Reckoner|reckoner]] (with its accumulated discriminant). The broker returns its scalar accumulators. The binary collects these at shutdown for persistence or analysis.

## Related Concepts

- [[Wat-VM]] — the runtime that hosts programs
- [[Services]] — the messaging substrate programs use
- [[Market Observers]] — the market prediction program
- [[Exit Observers]] — the exit distance prediction program
- [[Brokers]] — the accountability program
- [[The Four-Step Loop]] — how programs coordinate per candle
- [[Values Up]] — why programs return values instead of mutating shared state
