# Programs — Pure Functions on Dedicated Threads

> **TL;DR:** A program is a pure function that runs on a dedicated thread, receives messages through a `QueueReceiver`, does work, sends results through a `QueueSender`, and returns a trained domain object when its input disconnects. No shared state. No dependency injection. Values flow up, not queues down.

---

## The Shape of a Program

Every program in the wat-vm has the same anatomy:

```rust
pub fn program_name(
    input_rx: QueueReceiver<Input>,
    output_tx: SomeSender<Output>,
    learn_rx: MailboxReceiver<Learn>,     // optional
    cache: EncodingCacheHandle,           // opaque encoder
    console: ConsoleHandle,               // diagnostic output
    db_tx: QueueSender<LogEntry>,         // telemetry
    mut domain_object: DomainType,        // owned state
    // ... config parameters
) -> DomainType
```

1. **Receives** a `QueueReceiver<Input>` — the only input. The program never asks for data; data arrives.
2. **Sends** through a sender — the output. Fire and forget on the hot path.
3. **Owns** a domain object — `MarketObserver`, `PositionObserver`, `Broker`. This is the program's entire mutable state. No shared `Arc<Mutex<_>>`. No global state. The domain object lives on the thread stack, mutated only by this thread.
4. **Returns** the trained domain object when the input queue disconnects. The experience comes home.

## The While-Let-Recv Loop

The core of every program is the same:

```rust
while let Ok(input) = input_rx.recv() {
    // 1. Drain learn signals (non-blocking)
    while let Ok(signal) = learn_rx.try_recv() {
        domain_object.resolve(&signal);
    }

    // 2. Do work (encode, predict, compose)
    let result = domain_object.process(input, &cache);

    // 3. Send result downstream
    output_tx.send(result);

    // 4. Emit telemetry
    db_tx.send(LogEntry::Snapshot { ... });
}

// Input disconnected. Drain learn one last time.
while let Ok(signal) = learn_rx.try_recv() {
    domain_object.resolve(&signal);
}

// Return the trained object.
domain_object
```

This is the entire program structure. No event loop. No state machine. No async. A `while let Ok(...)` over a blocking receive, with non-blocking learn drains between iterations.

The learn-first pattern is critical. Before encoding a new candle, the observer processes all pending learn signals from brokers. This means the [[reckoner]] is up-to-date before it makes the next prediction. The ordering matters: learn, then predict, then send.

## Stdlib Programs

Three generic, reusable programs that any domain could use:

### Console

A rate-limited console driver. Programs send strings through a shared mailbox. The console driver deduplicates by content (if the same message appears 100 times in a window, it prints once with a count). This prevents log spam when all N market observers report the same diagnostic at the same candle.

### Database

A SQLite writer. Programs send `LogEntry` values through a shared mailbox. The database driver batches inserts and flushes periodically. It also emits self-telemetry (flush count, row count, flush timing) through a gate pattern — not through itself (that would be a circular dependency), but through a direct sender to the mailbox that the database's own mailbox reads from.

Wait — re-read that. The database writes its own telemetry through a *separate* queue that goes into the same mailbox. A self-pipe. The code explicitly avoids this because it creates a circular dependency: database waits for mailbox, mailbox waits for database. Instead, the database emits telemetry directly via `conn.execute()`. The gate controls the rate — every 5 seconds.

### Encoding Cache

Described in detail in [[encoding-cache]]. Not a program in the traditional sense — a shared LRU with a specialized get/set protocol. Each program gets its own `EncodingCacheHandle`.

## App Programs

Three domain-specific programs:

### Market Observer Program

Receives candles, encodes through a [[lens]], predicts direction (Up/Down), sends a `MarketChain` to a topic (fan-out to M position observers). Learns from brokers through a mailbox.

The program owns a `MarketObserver` domain object, which contains a [[reckoner]] (the learning primitive), a noise subspace (learns what's random), a window sampler (varies the lookback), and scale trackers (adapt to market conditions).

### Position Observer Program

Receives `MarketChain` values from N market observers (one queue per market observer), composes market thoughts with position-specific facts, predicts distances (trailing stop, safety stop, take profit), sends a `MarketPositionChain` to its broker.

Each position observer runs N concurrent slots — one per market observer. Each slot is a mini-pipeline: receive from the topic output queue, compose, encode, send to the broker. The slots share the same domain object (thread-safe because there's only one thread).

### Broker Program

Receives `MarketPositionChain` values, composes market + position anomalies with portfolio biography atoms, registers paper trades, ticks them against price, resolves triggered trades, and teaches both its market observer and position observer through learn queues.

The broker IS the accountability unit. It measures [[grace-and-violence]] — not trade outcomes, but directional accuracy (for the market observer) and distance geometry (for the position observer). The broker sends learn signals, not score reports.

## Cache/DB/Console Handles

Each program receives three handles at startup:

- **`EncodingCacheHandle`** — the only way to encode a `ThoughtAST` into a `Vector`. The handle owns the leaf tools (`VectorManager` + `ScalarEncoder`). On cache miss, encoding happens on the caller's thread. The cache thread manages only the LRU.

- **`ConsoleHandle`** — rate-limited output. `.out(msg)` and `.err(msg)`. Messages are deduplicated and throttled. One handle per program, backed by a shared console driver.

- **`QueueSender<LogEntry>`** — direct path to the database mailbox. Fire and forget. Each program gets its own sender, all fan-in through the same mailbox to a single database thread.

These handles are distributed through `HandlePool` — a pre-allocated vec that panics if any handle is left unclaimed. This catches wiring bugs at startup: if you create 10 handles but only claim 9, the pool's `finish()` method panics with the pool name and the count of unclaimed handles.

## Return Values

When a program's input queue disconnects, it drains remaining learn signals one final time and returns the trained domain object. The binary joins the thread and receives the object:

```rust
match jh.join() {
    Ok(observer) => {
        main_handle.out(format!(
            "{}: experience={:.1} resolved={}",
            observer.lens,
            observer.experience(),
            observer.resolved,
        ));
    }
    Err(_) => { /* thread panicked */ }
}
```

In the current wat-vm, the trained objects are logged and discarded. The experience survives the run in the database, but the in-memory objects are not persisted to disk or fed into a subsequent run. This is by design — the system is disposable. Each run starts fresh, learns from scratch, exits clean.

---

## Related Concepts

- [[wat-vm]] — the binary that wires and runs the programs
- [[services]] — the Queue, Topic, and Mailbox primitives programs use
- [[chain-types]] — the data types programs produce and consume
- [[encoding-cache]] — the distributed LRU programs use for encoding
- [[reckoner]] — the learning primitive inside each domain object
- [[market-observer]] — the domain object inside the market observer program
- [[broker]] — the domain object inside the broker program
