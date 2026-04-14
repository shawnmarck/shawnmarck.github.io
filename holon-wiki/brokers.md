# Brokers

> **TL;DR:** The accountability unit. Each broker binds one market observer + one exit observer into a team. It owns paper trades, scalar accumulators, and a Grace/Violence reckoner. When a trade resolves, it routes outcomes to every observer. The broker IS the team.

## What It Is

A broker is the atomic unit of accountability in the enterprise. It binds a set of observers as a team — today, exactly one market observer + one exit observer. Tomorrow, potentially more (market + exit + risk).

N×M brokers per post: every combination of the N market observers and M exit observers gets its own broker. Each broker's identity is the set `{"market-lens", "exit-lens"}`.

## What It Owns

- **Paper trades** — hypothetical "what-if" positions, tracked every candle
- **Scalar accumulators** — per-distance value learning (trail, stop)
- **Discrete reckoner** — Grace/Violence prediction
- **Conviction-accuracy curve** — self-evaluation of prediction quality

## The Proposal Flow

When the [[The Four-Step Loop|four-step loop]] reaches compute+dispatch:

1. Market observer produces: thought + (Up/Down prediction, conviction) + edge
2. Exit observer produces: composed thought + distances (trail, stop)
3. Broker receives the composed thought
4. Broker's reckoner predicts: "will this thought produce Grace or Violence?"
5. Broker assembles a [[The Proposal System|Proposal]]: composed-thought, distances, edge, side, prediction

The proposal carries the broker's **edge** — the accuracy from its conviction-accuracy curve at its current conviction. Zero when unproven. This is what the [[The Treasury]] sorts by.

## The Learning Flow

When a trade or paper resolves:

1. Broker receives outcome (Grace or Violence)
2. Feeds outcome to its own reckoner: `observe(thought, outcome, weight)`
3. Produces `PropagationFacts` — what each observer needs to learn
4. Market observer learns: actual direction (Up/Down)
5. Exit observer learns: optimal distances (what hindsight says was best)
6. Scalar accumulators accumulate: distance values grouped by outcome

**Values up.** Propagation facts are returned as values, not pushed through queues. The post applies them sequentially during tick phase 3b.

## The N×M Grid

The grid is the enterprise's combinatorial exploration engine:

```
              Exit: Volatility  Structure  Timing  Generalist
Market:
Momentum      broker[0,0]    broker[0,1]  [0,2]   [0,3]
Structure     broker[1,0]    broker[1,1]  [1,2]   [1,3]
Volume        broker[2,0]    broker[2,1]  [2,2]   [2,3]
Regime        broker[3,0]    broker[3,1]  [3,2]   [3,3]
Narrative     broker[4,0]    broker[4,1]  [4,2]   [4,3]
Generalist    broker[5,0]    broker[5,1]  [5,2]   [5,3]
```

Each cell is a different hypothesis about which market thinking + which exit strategy produces Grace. The curve judges each one. The treasury funds the ones with edge.

## Broker Readiness Gate (Proposal 034)

A broker doesn't propose until it has enough experience. The readiness gate checks: has this broker seen enough resolved papers to have a meaningful edge estimate? Until proven, the broker stays silent. Start ignorant. Learn. Graduate.

## Broker Opinions (Proposal 030)

The broker thinks opinions — not just about Grace/Violence, but about all the facts its observers produced. It encodes ALL available information as a derived thought, not just the prediction labels. This gives downstream consumers richer context about why the broker is proposing.

## Related Concepts

- [[Market Observers]] — predict direction, one per broker
- [[Exit Observervers]] — predict distances, one per broker
- [[Grace vs Violence]] — what the broker's reckoner learns
- [[Paper Trades]] — what the broker owns and advances
- [[Scalar Accumulator]] — per-value distance learning
- [[The Proposal System]] — what the broker produces
- [[The Four-Step Loop]] — where brokers participate
