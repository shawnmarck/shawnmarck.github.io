# Paper Trades

> **TL;DR:** Hypothetical "what-if" trades tracked every candle. Both buy and sell sides run simultaneously. When both resolve, the paper teaches: what distance would have been optimal? Papers are the fast learning stream — cheap, many, every candle.

## What They Are

A paper trade is a simulated position that tracks what WOULD have happened if a trade was opened at this candle. Every broker maintains paper trades for every candle — the system never stops learning.

Both sides (buy and sell) are tracked simultaneously. The paper doesn't pick a direction — it tests both:
- **Buy side**: tracks the best price upward, trailing stop ratchets up
- **Sell side**: tracks the best price downward, trailing stop ratchets down

When both sides resolve (their trailing stops fire), the paper teaches the system the **optimal distances** — what hindsight says would have been best.

## The Learning Signal

The paper produces a `Resolution` containing:
- `optimal-distances` — the distances that would have maximized Grace
- `direction` — which side resolved (Up if buy-side fired, Down if sell-side fired)
- `outcome` — Grace or Violence for the resolved side
- `composed-thought` — the thought that was tested

This resolution routes through the [[Brokers|broker]] to the observers:
- Market observer learns the actual direction
- Exit observer learns the optimal distances
- The broker learns Grace or Violence

## Papers and Active Trades: Equal Treatment

Papers and active trades are treated equally by the learning system:
- Both use whatever the [[The Reckoner|reckoner]] knows at the time
- Both start ignorant (crutch values)
- Both feed [[Grace vs Violence|Grace/Violence]] back to the broker

The only difference is speed: papers resolve quickly (every few candles), while active trades may take hundreds of candles. Papers provide the fast learning stream that keeps the reckoners sharp.

## The Tick Phase

During step 3a of [[The Four-Step Loop|the four-step loop]], all brokers tick their papers in parallel. No shared state during this phase — each broker's paper is independent.

When papers resolve, the resolutions are collected and applied sequentially during phase 3b (shared observers need sequential updates to prevent race conditions).

## Why Papers Matter

Without papers, the system would only learn from active trades. With a conservative treasury (funding only high-edge proposals), active trades are rare — maybe a few hundred across 100k candles. Papers provide thousands of learning events per candle.

The exit reckoners especially need papers: they learn optimal distances by comparing predicted distances (at entry) with optimal distances (at resolution). Without papers, the exit reckoners would be starved of training data.

## Paper Lifetime (Proposal 011)

The paper is a product type — a value with a lifecycle. It's created, advanced, and resolved. There's no cap on lifetime — a paper lives as long as both sides remain unresolved. If the market goes sideways for thousands of candles, the paper tracks it.

## Related Concepts

- [[Brokers]] — own and advance paper trades
- [[The Reckoner]] — learns from paper resolutions
- [[Exit Observers]] — learn optimal distances from papers
- [[The Four-Step Loop]] — step 3 ticks papers
- [[Trade Lifecycle]] — the real-trade counterpart
- [[Scalar Accumulator]] — accumulates distance values from paper resolutions
