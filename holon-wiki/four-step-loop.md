# The Four-Step Loop

> **TL;DR:** The heartbeat of the enterprise. Every candle, every post runs four phases: resolve (settle trades), compute+dispatch (encode and predict), tick (advance papers), collect+fund (deploy capital). Values up, not queues down.

## The Loop

```
1. RESOLVE          — settle triggered trades, propagate outcomes
2. COMPUTE+DISPATCH — encode candle → observers predict → brokers propose
3. TICK             — 3a: parallel tick brokers (paper trades)
                     3b: sequential propagate (shared observers)
                     3c: update triggers (breathing stops)
4. COLLECT+FUND     — treasury evaluates proposals, funds proven ones
```

This runs every candle, for every post, in order. It is the enterprise's pulse.

## Step 1: RESOLVE

Settle any trades whose stops fired during the previous candle. The resolution flows through the system as values:

1. [[The Treasury]] detects triggered stops, produces `TreasurySettlement`
2. Settlement carries: outcome ([[Grace vs Violence]]), composed thought, prediction
3. The post routes outcomes to the responsible [[Brokers]]
4. Brokers produce `PropagationFacts` — what each observer needs to learn
5. Market observers learn the actual direction (Up/Down)
6. Exit observers learn the optimal distances (what hindsight says was best)
7. The broker's own reckoner learns Grace or Violence

**Values up.** The resolution is returned as a value, not pushed through a queue. Cache misses, log entries, propagation facts — all flow up through return types.

## Step 2: COMPUTE+DISPATCH

The perception phase. Turn a raw candle into thought:

1. `IndicatorBank.tick(raw_candle)` → enriched `Candle` (100+ indicators)
2. For each [[Market Observer]]: encode thought → predict direction (Up/Down)
3. For each [[Exit Observer]]: compose market thought with exit-specific facts → predict distances
4. Each [[Broker]] receives the composed thought → propose (predict Grace/Violence)
5. Post assembles `Proposal` with: composed-thought, distances, edge, side, prediction

Each observer's prediction carries the **message protocol triple**: `(thought: Vector, prediction: Prediction, edge: f64)`.

## Step 3: TICK

The life phase. Two sub-steps:

### 3a: Parallel Tick
Every broker advances its [[Paper Trades]] simultaneously. No shared state during this phase — each broker's paper tracks what WOULD have happened independently. This is the fast learning stream: cheap, many, every candle.

### 3b: Sequential Propagate
Resolved papers produce `Resolution` values. These are applied sequentially because observers are shared between brokers. The market observer is learning from multiple brokers' papers. Sequential propagation prevents race conditions on shared reckoners.

### 3c: Update Triggers
Active trades get their stop levels updated. The stops **breathe** — every candle, the exit observer is re-queried: "for THIS thought in THIS market context, what are the optimal distances NOW?" The learned distances replace set-and-forget levels. Tighter when the market says tighten. Wider when it says breathe.

## Step 4: COLLECT+FUND

The deployment phase. The [[The Treasury]] evaluates all proposals:

1. Sort proposals by `edge` — the broker's accuracy at its current conviction
2. Fund proportionally to edge — more edge, more capital
3. Bounded loss: capital reserved at funding, principal returns at finality
4. Produce `LogEntry` values for funded and rejected proposals

The treasury doesn't decide based on predictions. It decides based on **track record**. A broker that predicts correctly with high conviction gets more capital than one that predicts loudly but inaccurately.

## CSP Sync Points

Between phases, CSP (Communicating Sequential Processes) synchronization ensures ordering. The loop is deterministic within a candle — given the same history, the same candle produces the same proposals, the same trades, the same resolutions.

## The Philosophical Principle

> Values up, not queues down.

Every phase returns its side-effects as values. Cache misses are returned, not queued. Propagation facts are collected, not dispatched. Log entries are assembled, not written. The loop folds over the stream — `reduce` over candles, each step producing a value that flows into the next.

This is functional programming applied to system architecture. The loop is a pure function from (state, candle) to (new-state, log-entries). Referentially transparent. Deterministic. Testable.

## Related Concepts

- [[The Enterprise]] — the coordination plane that runs this loop
- [[The Post]] — the per-asset-pair unit that executes this loop
- [[Brokers]] — produce proposals during compute+dispatch, tick papers in step 3
- [[The Treasury]] — evaluates and funds proposals in step 4
- [[Paper Trades]] — advanced during tick, producing the fast learning stream
- [[Values Up]] — the architectural principle that makes this work
