# Paper Trade

**TL;DR:** A paper trade is a hypothetical trade — "what if we opened here?" Every candle, every broker creates a paper entry tracking both buy and sell sides simultaneously. When a side's trailing stop fires, the paper resolves and teaches the system what *would have been* the optimal distance. Papers are the fast learning stream: cheap, numerous, every candle, and treated equally by the learning system.

---

## What Papers Are

Papers answer the question the system can't answer from real trades alone: "if we had opened a position at this moment, what would have happened?"

Real trades are expensive and infrequent. The treasury only funds proposals with proven edge. Even with 24 brokers per post, only a few trades might be open at any time. The learning signal from real trades is sparse.

Papers solve this. Every candle, every one of the 24 brokers creates a paper entry. Both buy-side and sell-side are tracked simultaneously. No capital is at risk. The system can afford to "open" a hypothetical position on every candle, in both directions, and learn from all of them.

Over 100,000 candles, that's potentially 2.4 million paper resolutions per post (24 brokers × 100,000 candles × 2 sides). Compare that to maybe a few hundred real trades in the same period. The learning signal from papers dwarfs the signal from real trades.

## Anatomy of a Paper

```
PaperEntry:
  composed-thought  — the thought vector at entry (market + exit facts)
  entry-price       — price when the paper was created
  distances         — from the exit observer at entry (trail, stop)
  buy-extreme       — best price in buy direction so far (Maximum Favorable Excursion)
  buy-trail-stop    — trailing stop level for buy side
  sell-extreme      — best price in sell direction so far
  sell-trail-stop   — trailing stop level for sell side
  buy-resolved      — has the buy side's stop fired?
  sell-resolved     — has the sell side's stop fired?
```

### How Papers Tick

Every candle, each broker's `tick-papers` method:

1. Creates a new paper entry with the current composed thought, entry price, and distances from the exit observer.
2. For each existing paper, updates the extremes (if price moved favorably, the extreme ratchets up/down).
3. Ratchets the trailing stops to follow the extremes.
4. Checks if either side's stop fired (price retraced past the trail level).
5. If a side resolves, computes the outcome (Grace or Violence) and the approximate optimal distances.

Both sides are independent. A buy-side paper resolves when price rises then retraces below the buy trail stop. A sell-side paper resolves when price falls then retraces above the sell trail stop. A single paper can resolve its buy side on one candle and its sell side on a later candle.

### Approximate Optimal Distances

Papers don't carry full price history (that would be expensive). Instead, they approximate optimal distances from their tracked extremes:

```
approximate-optimal-distances(entry, buy-extreme, sell-extreme) → Distances
```

This is a simpler computation than `compute-optimal-distances` (which replays full price history for real trades in step 1). The approximation uses Maximum Favorable Excursion (MFE) and Maximum Adverse Excursion (MAE) — the extremes the paper tracked — to estimate what trailing stop distance would have maximized residue.

Same objective (maximize residue). Different data availability. The approximation is good enough for the fast learning stream.

## The Teaching: Predicted vs Optimal

When a paper resolves, it teaches the exit observer a precise lesson:

> "You predicted trail = 1.5% and stop = 3.0%. But optimal was trail = 2.3% and stop = 1.8%. Your trail was too tight (you got stopped out before the full move) and your stop was too wide (you absorbed more loss than necessary)."

This is the `(predicted, optimal)` pair that the exit observer's continuous reckoners learn from. The composed thought at entry provides the context. The optimal distances provide the target. Over thousands of paper resolutions, the reckoners build a map from thought-space to optimal-distance-space.

## Papers and Real Trades: Equal Citizens

This is a critical design choice. Papers and active trades are treated **equally** by the learning system:

- Both use whatever the reckoner knows at the time (no special logic for papers)
- Both start ignorant (crutch values for distances)
- Both feed [[grace-and-violence|Grace]]/[[grace-and-violence|Violence]] back to the broker
- Both contribute to the same reckoners, the same curves, the same accumulators

The system does not weight real trade outcomes more heavily than paper outcomes (though the weight field CAN encode this — a real trade with more capital at stake naturally gets a higher weight). The learning mechanism is identical.

Why? Because the paper's prediction was made with the same reckoner state as a real trade's prediction. The thought was encoded with the same vocabulary. The distance was predicted with the same exit observer. The only difference is whether capital was deployed. If the reckoner's prediction was wrong on a paper, it was wrong. The lesson is the same.

## Papers as the Bootstrap Mechanism

Papers are the bootstrap. When the system starts, every reckoner has zero experience. No edge. No participation. The treasury won't fund anything because the curves aren't proven.

But papers don't need the treasury. They run every candle regardless. The reckoners accumulate experience from papers. The curves steepen. The edge grows. Eventually, `proven?(reckoner, min-samples)` returns true, the broker's edge crosses the venue cost threshold, and the treasury starts funding real trades.

This is the architecture-as-bootstrap. No pre-trained weights. No historical warmup. No transfer learning. Just papers filling the reckoners with experience until they're ready for real capital.

## The Paper Lifecycle

```
Candle N:   broker registers paper(entry-price=N, distances={trail: 0.015, stop: 0.030})
Candle N+1: price rises → buy-extreme ratchets up, buy-trail-stop follows
Candle N+2: price keeps rising → buy-extreme keeps ratcheting
Candle N+3: price retraces → crosses buy-trail-stop → BUY SIDE RESOLVES
            outcome: Grace (price rose then fell, trail captured the move)
            optimal: {trail: 0.022, stop: 0.028} (wider trail would have captured more)
            → Resolution produced → PropagationFacts → observers learn
Candle N+7: price drops → crosses sell-trail-stop → SELL SIDE RESOLVES
            outcome: Violence (sell side was wrong — price initially dropped but not enough)
            → Resolution produced → observers learn
Paper discarded after both sides resolve
```

Each resolution produces a `Resolution` struct containing `broker-slot-idx`, `composed-thought`, `direction`, `outcome`, `amount`, and `optimal-distances`. These are facts, not mutations. Collected during parallel tick, applied sequentially during propagation.

## Capacity Management

Papers live in a `VecDeque<PaperEntry>` on each broker, capped to prevent unbounded memory growth. Old papers that haven't resolved get evicted. The cap is large enough that most papers resolve naturally before eviction — the trailing stop mechanism ensures papers don't live forever (markets move, stops fire).

## Related Concepts

- [[broker]] — owns and ticks papers, produces Resolutions from them
- [[four-step-loop]] — papers are created in step 2, ticked in step 3a, propagated in step 3b
- [[signal-propagation]] — how paper resolutions teach observers (path 2)
- [[exit-observer]] — provides the distances that papers track, learns from optimal distances
- [[grace-and-violence]] — the labels assigned to paper outcomes
- [[reckoner]] — the learning primitive that accumulates paper experience
- [[treasury]] — the capital allocator that does NOT track papers (papers are broker-owned)
- [[exit-observer|Distances]] — the named tuple of trail/stop values that drive paper mechanics
