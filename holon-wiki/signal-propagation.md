# Signal Propagation

**TL;DR:** Signal propagation is how learning flows backward through the system when a trade or paper resolves. The broker returns PropagationFacts — structured values containing what each observer needs to learn. The post applies these facts to its observers. No shared mutation. No queues. Values flow up, effects flow down through return types.

---

## The Core Principle

When a trade settles, the system learns. But *what* learns, and *how*? The market observer needs to know the actual direction (Up or Down). The exit observer needs to know the optimal distances. The broker needs to know Grace or Violence. These are different facts, routed to different entities, through a clean mechanism.

The mechanism is signal propagation. It has one iron rule: **values up, not effects down.** The broker does NOT reach into the observers and mutate their state. It returns a data structure. The post receives the data. The post calls each observer's learning method. The observer learns. Every mutation is owned by the entity being mutated.

This is not an optimization. It's the architecture. No shared mutable state during any phase. The type checker enforces it. The borrow checker proves it.

## The Two Propagation Paths

Signal propagation has two entry points, both calling the same `broker.propagate` method:

### Path 1: Real Trade Settlement (Step 1)

```
Treasury settles triggered trade → TreasurySettlement
  → Enterprise computes direction (exit-price vs entry-price)
  → Enterprise computes optimal distances (compute-optimal-distances from price-history)
  → Enterprise routes to post → post-propagate
  → Broker.propagate(thought, outcome, weight, direction, optimal)
  → Broker returns PropagationFacts
  → Post applies facts to observers
```

Real trades are the slow path. Capital was at stake. The settlement comes from the treasury's accounting. The direction is derived from actual price movement. The optimal distances are computed by replaying the full price history against candidate values — the most accurate possible hindsight.

### Path 2: Paper Resolution (Step 3b)

```
Broker.tick-papers → Resolutions (facts from completed papers)
  → Enterprise collects all resolutions (parallel)
  → Enterprise folds over resolutions → step-propagate
  → Broker.propagate(thought, outcome, weight, direction, optimal)
  → Broker returns PropagationFacts
  → Post applies facts to observers
```

Papers are the fast path. No capital at risk. Every candle, every broker. Papers resolve when their trailing stops fire (price moved then retraced). The optimal distances are approximated from tracked extremes (MFE/MAE), not from full price history replay — a simpler computation appropriate for the higher volume.

Both paths call `broker.propagate`. Both teach. Different sources, same mechanism. The learning system doesn't distinguish between hypothetical and real outcomes. Both feed the same reckoners. A Grace from a paper teaches the same lesson as a Grace from a real trade (with one caveat: the weight may differ — real trades with larger capital at stake teach harder).

## PropagationFacts: The Data Structure

```
PropagationFacts:
  market-idx: usize      — which market observer should learn
  exit-idx: usize        — which exit observer should learn
  direction: Direction   — :up or :down, for the market observer
  composed-thought: Vector — for both observers (contextual learning)
  optimal: Distances     — for the exit observer (hindsight optimal)
  weight: f64            — for both observers (observation importance)
```

This struct IS the learning contract. It says exactly what each observer needs, nothing more. The broker computes it from the resolution data. The post routes each field to the right observer.

## How Each Observer Learns

### Market Observer (direction + thought + weight)

The post calls `market-observer.resolve(thought, direction, weight)`.

The observer compares its stored `last-prediction` (the direction it predicted when it first saw this thought) against the actual `direction`. Match → correct. Mismatch → incorrect. The reckoner learns from the comparison. The internal curve feeds: `resolve(reckoner, conviction, correct?)`. The engram gate updates.

The weight scales how much this observation contributes. A large outcome (the trade risked a lot of capital) teaches harder than a small one.

### Exit Observer (optimal + composed + weight)

The post calls `exit-observer.observe-distances(composed, optimal, weight)`.

The exit observer's continuous reckoners learn: "for a composed thought like THIS, the optimal trailing stop was X% and the optimal safety stop was Y%." Both reckoners receive the same composed thought and their respective optimal distances.

The learning is contextual — the reckoners don't learn a global "use 2% trailing stops." They learn that thoughts in this region of space were associated with these optimal distances. Different contexts get different distances.

### Broker (outcome + conviction + correct?)

Inside `broker.propagate`, before returning PropagationFacts, the broker learns its own lesson:

- Feeds its Grace/Violence reckoner's curve: `resolve(reckoner, conviction, correct?)`
- Updates track record: `cumulative-grace` or `cumulative-violence`
- Feeds scalar accumulators with optimal distances and outcome
- Updates engram gate

The broker learns FIRST, then returns what the observers need. This ordering matters — the broker's internal state is updated before any external entity is touched.

### Scalar Accumulators (optimal + outcome + weight)

The broker's scalar accumulators receive `observe-scalar(accum, distance, outcome, weight)`. Grace outcomes accumulate into the Grace prototype. Violence outcomes accumulate into the Violence prototype. These prototypes support the global cascade level — "what distance does Grace prefer overall?"

## Why Sequential Application

After parallel tick (step 3a) produces many Resolutions, step 3b applies them sequentially. Why? Because **observers are shared**.

A market observer is shared across multiple brokers. Broker (momentum, volatility) and broker (momentum, timing) both use the same momentum market observer. If two resolutions tried to update the same market observer simultaneously, you'd need a lock.

Instead, the system collects all resolutions (parallel), then folds over them (sequential). Each resolution updates the observers one at a time. No locks. No contention. The sequential phase is fast — it's just calling `resolve` and `observe-distances` in a loop. The parallel phase did the heavy lifting (ticking thousands of papers).

## The Learning Feedback Loop

Signal propagation closes the loop:

```
Candle → Encode → Predict → Propose → Fund → Trade Opens
  → Market moves → Trade Settles → Outcome (Grace/Violence)
  → Propagation → Observers Learn → Better Predictions Next Time
```

Every trade (real or paper) teaches the system. The discriminants sharpen. The curves steepen. The edge grows. The treasury allocates more capital to proven brokers. The system gets better by doing. There is no separate training phase. The four-step loop IS the training loop.

## The Audit Trail

The `composed-thought` field on PropagationFacts carries the thought vector from when the trade was proposed. This is the same vector that was stashed on the `TradeOrigin` at funding time. The learning pair — prediction (what the system believed) + outcome (what happened) — forms a complete audit trail. The system can always answer: "why did we take this trade, and what did we learn from it?"

## Related Concepts

- [[broker]] — produces PropagationFacts from resolved trades and papers
- [[market-observer]] — learns direction from propagation
- [[exit-observer]] — learns distances from propagation
- [[grace-and-violence]] — the accountability outcomes that drive propagation
- [[paper-trade]] — the fast learning stream that generates frequent propagation events
- [[four-step-loop]] — the pipeline containing both propagation paths (steps 1 and 3b)
- [[reckoner]] — the learning primitive that receives propagated observations
- [[broker|ScalarAccumulator]] — the global distance learners fed by propagation
