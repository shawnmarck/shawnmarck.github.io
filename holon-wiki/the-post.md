# The Post

> **TL;DR:** Per-asset-pair unit. Owns its observers, brokers, and indicator bank. Routes candles through [[The Four-Step Loop|the four-step loop]]. Proposes trades to the treasury. No cross-talk between posts.

## What It Is

The NYSE had specialist posts — each one handled one security, had its own specialists, its own order book. The Holon Enterprise inherits this model:

- The (USDC, WBTC) post
- The (SPY, SILVER) post
- The (SOL, GOLD) post

Any asset pair. The post doesn't care what the pair IS — it watches a stream of candles, acquires capital from the treasury, and the treasury holds it accountable. [[Grace vs Violence|Grace]] or Violence.

## What It Owns

- **IndicatorBank** — enriches raw candles with 100+ computed indicators
- **N Market Observers** — one per [[Lenses|MarketLens]] variant
- **M Exit Observers** — one per [[Lenses|ExitLens]] variant
- **N×M Brokers** — one per (market, exit) lens pair
- **WindowSampler** — random window selection for observer context
- **encode-count** — candle counter for window sizing

## The Candle Flow

```
RawCandle → IndicatorBank.tick() → Candle (enriched)
                                         ↓
              Market Observers → thoughts + predictions
              Exit Observers   → composed thoughts + distances
              Brokers          → proposals (thought, distances, edge, side)
                                         ↓
                                   The Treasury
```

Each candle flows through the post's four-step loop exactly once. The post is the execution unit — it doesn't decide, it orchestrates.

## Independence

Posts are fully independent. No shared state. No cross-talk. Each post has its own indicator bank, its own observers, its own brokers. The enterprise routes candles to the correct post by asset pair, and the post handles everything locally.

This independence has a deep consequence: adding a new asset pair means adding a new post. No reconfiguration. No shared parameters. The post template is identical for every pair.

## Map-and-Collect

The post uses map-and-collect for the N×M broker grid:
1. **Map**: each broker independently produces a proposal (parallel, no shared state)
2. **Collect**: proposals are gathered into a vec and submitted to the treasury

Values, not mutation. Each broker is a pure function from (state, candle) to (new-state, proposal). The post collects the outputs. No queues. No callbacks. No shared mutable state during the parallel phase.

## From Distances to Levels

The post converts between two representations:
- **Distances** (from exit observers) — percentages of price, scale-free
- **Levels** (on trades) — absolute price levels, computed as `distance × current_price`

Observers think in distances. Trades execute at levels. The post performs this translation, keeping the two concepts cleanly separated.

## Related Concepts

- [[The Enterprise]] — the coordination plane that owns all posts
- [[The Treasury]] — evaluates proposals from all posts
- [[Market Observers]] — N per post
- [[Exit Observers]] — M per post
- [[Brokers]] — N×M per post
- [[IndicatorBank]] — one per post, enriches candles
- [[The Four-Step Loop]] — what the post executes every candle
