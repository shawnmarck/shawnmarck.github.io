# The Enterprise

> **TL;DR:** The coordination plane. Owns all posts and the treasury. Routes raw candles to the correct post by asset pair. CSP sync points between phases. Returns `(Vec<LogEntry>, Vec<misses>)` from on-candle. Values up.

## What It Is

The enterprise is the outermost layer — the floor of the exchange, in NYSE terminology. It doesn't think. It coordinates.

Three fields:
- **Posts** — one per asset pair, fully independent
- **Treasury** — capital management, evaluates proposals from all posts
- **Market-thoughts-cache** — shared composition cache (the one seam in ctx)

The binary creates the enterprise. Candles flow in. Log entries flow out. The enterprise is pure coordination.

## The Candle Flow

```
RawCandle stream
    ↓ (route by asset pair)
Post for (source, target)
    ↓ (four-step loop)
    ├── RESOLVE: settle trades, propagate outcomes
    ├── COMPUTE+DISPATCH: encode → observe → propose
    ├── TICK: advance papers, update triggers
    └── COLLECT+FUND: treasury evaluates proposals
    ↓
(Vec<LogEntry>, Vec<misses>)
```

## The Return Contract

`on-candle(ctx, candle)` returns exactly two things:
1. `Vec<LogEntry>` — everything that happened this candle (proposals, fundings, settlements, propagations)
2. `Vec<misses>` — cache misses to insert into the composition cache between candles

This is the "values up" principle made concrete. Every side-effect is a value. The binary writes the ledger. The enterprise produces the values.

## CSP Sync Points

Between phases, Communicating Sequential Processes synchronization ensures ordering within a candle. The loop is deterministic: given the same history and the same candle, it produces the same output. No race conditions. No non-determinism.

## ctx — The Immutable World

`ctx` flows through the enterprise as a parameter. Born at startup. Contains:

- **ThoughtEncoder** (which contains the VectorManager) — the encoding engine
- **dims** — vector dimensionality (10,000)
- **recalib-interval** — observations between reckoner recalibrations

Nobody owns ctx. Everybody borrows it. Immutable during each candle.

**The one seam:** the ThoughtEncoder's composition cache is mutable. During encoding (parallel), the cache is read-only — misses are returned as values. Between candles (sequential), the enterprise inserts collected misses into the cache. ctx is immutable DURING a candle. The cache updates BETWEEN candles.

## The Binary Orchestrates

The binary does three things:
1. Creates ctx
2. Creates the enterprise
3. Feeds the candle stream

It doesn't think. It writes the ledger and displays progress. All intelligence lives in the enterprise, posts, observers, and brokers.

## The Wider Vision

The enterprise is currently a trading system. But the architecture is domain-agnostic. Any domain with:
- A stream of observations
- Named concepts that can be composed
- Outcomes that can be measured (Grace/Violence)

...can be modeled as an enterprise. The original AWS application was "shield cognition" — the same architecture applied to network traffic anomaly detection. The market is the test harness. The real product is the architecture.

## Related Concepts

- [[The Post]] — per-asset-pair unit owned by the enterprise
- [[The Treasury]] — capital management owned by the enterprise
- [[The Four-Step Loop]] — what the enterprise orchestrates
- [[Values Up]] — the architectural principle
- [[Wat VM]] — the specification language the enterprise is compiled from
- [[Shield Cognition]] — the original domain (network security)
