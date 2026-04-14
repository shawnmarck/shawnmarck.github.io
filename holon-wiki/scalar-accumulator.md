# Scalar Accumulator

> **TL;DR:** Per-value vector learning. Grace outcomes accumulate into a Grace prototype. Violence outcomes accumulate into a Violence prototype. To extract: try candidate values, encode each, cosine against Grace. The closest to Grace wins.

## What It Is

A scalar accumulator learns what continuous values produce [[Grace vs Violence|Grace]]. Each accumulator is associated with one value (e.g., "trail-distance", "stop-distance") and encodes observed values as vectors.

## The Mechanism

1. When a trade/paper resolves with Grace at distance D: encode D as a vector, accumulate into Grace prototype
2. When a trade/paper resolves with Violence at distance D: encode D as a vector, accumulate into Violence prototype
3. To extract: sweep candidate values, encode each, cosine against Grace prototype
4. The candidate with highest cosine to Grace → the learned optimal value

"What value does Grace prefer overall?"

## Encoding Modes

Two modes for encoding scalar values:
- **Log** (`:log`) — encode-log: ratios compress naturally, good for multiplicative values like distances
- **Linear** (`:linear`) — encode-linear: direct linear encoding

The broker owns two accumulators (trail-distance, stop-distance), both using log encoding.

## Global vs Contextual

The scalar accumulator provides a **global** answer — one optimal value regardless of the current market thought. This contrasts with the [[Exit Observers|exit observer's]] continuous reckoners, which provide **contextual** answers that vary with the composed thought.

Together, they provide:
- Scalar accumulator: "overall, what trail distance works best?"
- Continuous reckoner: "for THIS specific thought, what trail distance works best?"

## Per-Broker Ownership

Each broker owns its own scalar accumulators. A momentum+volatility broker may learn different optimal distances than a regime+generalist broker. The N×M grid explores different distance preferences for different observer combinations.

## Related Concepts

- [[Exit Observers]] — the contextual distance prediction mechanism
- [[Brokers]] — own scalar accumulators
- [[Paper Trades]] — provide the training data (resolved distances)
- [[Grace vs Violence]] — what the accumulators learn from
- [[Thought Primitives]] — the encode-log and encode-linear operations
