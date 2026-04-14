# Broker

**TL;DR:** The broker is the accountability unit. It binds one market observer to one exit observer (today), forming a team of N×M per post. It owns paper trades, scalar accumulators, and a Grace/Violence reckoner. When trades resolve, the broker returns PropagationFacts — values that flow back to teach the observers. The broker IS where predictions meet reality.

---

## What It Does

Observers predict. The broker is **judged**. The market observer predicts Up/Down. The exit observer predicts distances. The broker takes the composed thought (market + exit) and predicts Grace or Violence — will this trade produce value or destroy it? When the trade settles, reality answers. The broker's reckoner learns. The observers learn. Accountability flows through the broker.

The broker is the only entity in the system that owns a Grace/Violence reckoner. It is the accountability primitive. Observers are expert witnesses. The broker is the entity on trial.

## The N×M Grid

Today, each broker binds exactly one market observer to one exit observer. With 6 market lens variants and 4 exit lens variants, that's 24 brokers per post. The grid is flat — brokers live in a `Vec<Broker>` indexed by `slot-idx = market-idx × M + exit-idx`.

This is not permanent. The broker generalizes to any number of observer kinds. Tomorrow a broker might bind a market observer, an exit observer, and a risk observer. Three minds. One accountability unit. The slot-idx mapping adapts. The architecture doesn't change.

The broker's identity is the set of observer names it closes over: `{"momentum", "volatility"}` is one broker. `{"regime", "timing"}` is another. The names are carried for diagnostics — the ledger reads them for human-readable log entries.

**Lock-free parallel access.** The enterprise enumerates all broker sets at construction, allocates a flat vec, and builds a frozen map from `Set<String>` → `slot-idx`. Never written to again. At runtime, all access is by index. Disjoint slots. No mutex. The borrow checker proves the writes are disjoint.

## What the Broker Owns

### Grace/Violence Reckoner

A discrete reckoner configured with `("Grace", "Violence")`. Given a composed thought (after noise stripping), it predicts which outcome is more likely. The conviction (cosine against the discriminant) feeds the internal curve, which reports accuracy via `edge-at`.

This reckoner is the broker's self-assessment. "When I predict strongly, how often am I right?" The treasury reads this edge value to decide how much capital to allocate. More edge, more capital. No edge, no capital. The system earns a degree of trust, not a binary gate.

### ScalarAccumulators

Per-distance global learners. One for trail-distance, one for stop-distance (and more as new distances are added). These accumulate encoded distance values from resolved trades and papers, separated into Grace and Violence prototypes.

The `extract` operation sweeps candidate values against the Grace prototype and returns the one with highest cosine: "what distance value does Grace prefer for this pair overall?" This is the global cascade level — used when the exit observer's reckoners are still ignorant.

The accumulator answers a different question than the exit observer's reckoners. The reckoners say "for THIS thought, what distance?" The accumulator says "for this pair, period, what distance?" Contextual vs global. Both useful. Both learn from the same resolution events.

### Paper Trades

The broker owns a `VecDeque<PaperEntry>` — hypothetical trades tracked every candle. Both buy-side and sell-side are tracked simultaneously. Papers resolve when their trailing stops fire. Each resolution produces facts that teach the system.

Papers are the **fast learning stream**. Real trades are expensive (they consume capital, they're infrequent). Papers are cheap (no capital at risk, every candle). The system runs thousands of papers per broker across its lifetime, each one teaching the reckoners what worked and what didn't.

Papers and active trades are treated equally by the learning system. Both use whatever the reckoner knows at the time. Both start ignorant (crutch values). Both feed Grace/Violence back to the broker. The only difference is whether real capital was at stake.

### Track Record

The broker accumulates `cumulative-grace`, `cumulative-violence`, and `trade-count`. These are diagnostics — the binary reads them for progress display. The Grace/Violence ratio IS the answer to "do we trust this team?"

### Noise Subspace and Engram Gate

Same mechanism as the market observer. An `OnlineSubspace` (8 principal components) for noise stripping, and an `OnlineSubspace` (4 components) for engram gating — learning what good discriminants look like and preventing drift.

## Propagation: Values Up

When a trade or paper resolves, the broker's `propagate` method does two things:

1. **Learns its own lesson** — feeds its Grace/Violence reckoner's internal curve via `resolve(reckoner, conviction, correct?)`. Updates its track record. Feeds its scalar accumulators with the optimal distances and outcome. Updates the engram gate.

2. **Returns what others need** — produces `PropagationFacts` containing `market-idx`, `exit-idx`, `direction`, `composed-thought`, `optimal` distances, and `weight`. The post receives these values and applies them: direction + thought + weight → market observer via `resolve`, optimal + composed + weight → exit observer via `observe-distances`.

**Values up, not effects down.** The broker does NOT reach into the observers and mutate them. It returns data. The post applies the data. The observers learn from the data. This is the core architectural principle — no shared mutation during any phase.

## The Proposal

When the broker receives a composed thought, it strips noise, predicts Grace/Violence, and computes its edge (accuracy at this conviction level). The post assembles a `Proposal` from the broker's output: composed thought, distances, edge, side (derived from the market observer's Up/Down prediction), assets, prediction, and identifiers.

The proposal goes to the treasury. The treasury sorts all proposals by edge and funds the top N that fit. The broker's edge IS its credibility. No edge = no credibility = no capital.

## The Binary and the Broker

The binary reads three things from each broker for progress display:
- `(:observer-names broker)` — human-readable identity
- `(:cumulative-grace broker)` and `(:cumulative-violence broker)` — the track record
- `(edge broker)` — current credibility level

These are diagnostics. The broker doesn't know it's being watched. It just learns and predicts.

## Related Concepts

- [[grace-and-violence]] — the accountability labels the broker is judged by
- [[reckoner]] — the learning primitive (Grace/Violence mode) inside the broker
- [[market-observer]] — one of the observer kinds a broker binds
- [[exit-observer]] — the other observer kind a broker binds
- [[paper-trade]] — the hypotheticals the broker owns and learns from
- [[signal-propagation]] — how the broker's PropagationFacts flow to observers
- [[conviction|Conviction-Accuracy Curve]] — how the broker's edge is computed
- [[broker|ScalarAccumulator]] — the global distance learners on the broker
- [[treasury]] — the capital allocator that reads the broker's proposals
