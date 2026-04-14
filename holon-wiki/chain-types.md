# Chain Types — The Type IS the Proof

> **TL;DR:** Chain types are plain data structs that flow through the pipeline. `MarketChain` is what the market observer produces. `MarketPositionChain` is what the position observer produces. Each type is a superset of the previous one — the type tells you exactly which pipeline stage produced it. No methods. No behavior. Just values on the wire.

---

## The Pipeline as a Type Ladder

The trading pipeline is a sequence of transformations. Each stage takes input, does work, produces output. The output type of one stage is the input type of the next. In the wat-vm, this is enforced by the type system — not by convention, not by tests, but by the compiler.

```
Candle → MarketObserver → MarketChain → PositionObserver → MarketPositionChain → Broker
```

Two chain types. Each one is a struct with public fields. No methods. No traits. No serde. Just data.

## MarketChain

What the market observer produces. What the position observer receives.

```rust
pub struct MarketChain {
    pub candle: Candle,              // the raw input
    pub window: Arc<Vec<Candle>>,    // shared window snapshot
    pub encode_count: usize,         // global sequence number
    pub market_raw: Vector,          // the raw thought vector
    pub market_anomaly: Vector,      // noise-subtracted anomaly
    pub market_ast: ThoughtAST,      // the abstract syntax tree (cacheable)
    pub prediction: Prediction,      // Up or Down, with conviction
    pub edge: f64,                   // conviction minus noise floor
}
```

Everything the position observer needs to compose its own thoughts. The `market_raw` is the full encoded thought. The `market_anomaly` is the raw vector minus the learned noise subspace — what's actually informative. The `market_ast` is the abstract syntax tree that produced the vector, carried along so the position observer can cache sub-expressions it shares.

The `prediction` carries direction (Up/Down) and conviction (cosine similarity against the learned discriminant). The `edge` is conviction minus noise floor — only positive edge gets traded. Zero or negative edge means "this observer has no opinion worth acting on."

The type is `Clone`. This is necessary because the topic clones it to fan out to M position observers. The `Arc<Vec<Candle>>` makes the clone cheap — only the `Arc` reference count changes, not the window data.

## MarketPositionChain

What the position observer produces. What the broker receives.

```rust
pub struct MarketPositionChain {
    pub candle: Candle,
    pub window: Arc<Vec<Candle>>,
    pub encode_count: usize,
    pub market_raw: Vector,
    pub market_anomaly: Vector,
    pub market_ast: ThoughtAST,
    pub market_prediction: Prediction,
    pub market_edge: f64,
    pub position_raw: Vector,            // position observer's composed thought
    pub position_anomaly: Vector,        // position noise-subtracted
    pub position_ast: ThoughtAST,        // position observer's AST
    pub position_distances: Distances,   // predicted stop distances
}
```

Notice: every field from `MarketChain` is carried forward, plus six new fields. The chain type is a **superset** — it contains all upstream data plus its own contribution. The broker never needs to ask "what did the market observer think?" because the answer is right there in the chain.

This is the "type IS the proof" principle. When a function takes `MarketPositionChain` as input, the compiler guarantees that:
1. A candle was processed (field exists)
2. A market observer encoded and predicted (fields exist)
3. A position observer encoded and composed (fields exist)
4. Distances were predicted (field exists)

You cannot construct a `MarketPositionChain` without all of these. You cannot pass a `MarketChain` where a `MarketPositionChain` is expected. The pipeline is correct by construction.

## Why Plain Structs

No methods. No traits. No impl blocks. Just fields.

This is deliberate. Chain types are **messages on a wire**, not objects with behavior. They exist to carry data from one program to the next. Adding methods would create coupling — the market observer would need to know about position observer concerns, or the broker would need to know about market observer internals.

By keeping them as dumb data carriers:
- Programs can add fields to their output without changing downstream programs (as long as struct literal syntax is used)
- The compiler catches missing fields at construction time
- Serialization is trivial if ever needed (just derive Serialize)
- No inheritance hierarchies, no trait objects, no dynamic dispatch

## The Type Ladder in Practice

The broker program demonstrates why this matters:

```rust
while let Ok(chain) = chain_rx.recv() {
    // chain.market_anomaly — from the market observer
    // chain.position_anomaly — from the position observer
    // chain.market_prediction — from the market observer
    // chain.position_distances — from the position observer
    // chain.candle — the original input
    let composed = Primitives::bundle(&[
        &chain.market_anomaly,
        &chain.position_anomaly,
        &portfolio_vec,
    ]);
    let direction = direction_from_prediction(&chain.market_prediction);
    let distances = broker.cascade_distances(Some(chain.position_distances), ...);
}
```

The broker has everything it needs in one struct. No secondary lookups. No "give me the market observer's prediction for this candle" callback. The data arrived with the message.

## Not Currently Used: MarketBrokerChain

The broker does not produce a `MarketBrokerChain`. In the current wat-vm, the broker is the terminal stage — it registers paper trades, resolves them, and sends learn signals back upstream. There's no downstream consumer.

If a treasury stage were added (the full enterprise design has one), the broker would produce a `MarketBrokerChain` — a superset of `MarketPositionChain` with trade proposals, expected values, and capital requests. The type ladder would extend naturally.

This extensibility is why chain types exist as plain structs. Adding a new stage means adding a new struct with all upstream fields plus your own. The compiler enforces the chain.

## Clone vs Move

`MarketChain` is `Clone` because the topic needs to duplicate it across M subscribers. `MarketPositionChain` is not `Clone` because there's only one consumer (the broker) — no fan-out needed.

When `Clone` is required, `Arc` wraps shared data to keep cloning cheap. The `window: Arc<Vec<Candle>>` is shared across all clones of a `MarketChain`. The vectors (`market_raw`, `market_anomaly`) are cloned — they're fixed-size (`[f64; DIMS]`), so cloning is a memcpy, not a heap allocation.

---

## Related Concepts

- [[wat-vm]] — the binary that wires the pipeline stages together
- [[programs]] — the functions that produce and consume chain types
- [[services]] — the queues that carry chain types between programs
- [[thought-encoding]] — how ASTs become vectors (the `*_raw` fields)
- [[reckoner]] — how predictions are made (the `prediction` field)
- [[thought-system]] — the algebra that produces the ASTs and vectors
