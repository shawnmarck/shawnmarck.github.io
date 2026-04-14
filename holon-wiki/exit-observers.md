# Exit Observers

> **TL;DR:** M entities per post that predict optimal exit distances — how far to set the trailing stop and safety stop. They use continuous [[The Reckoner|reckoners]] and [[Scalar Accumulator|scalar accumulators]] to replace magic numbers with measurement.

## What They Do

An exit observer estimates the optimal distances for trade management. Given a market thought, it answers: "for a thought like THIS, what distances did the market say were optimal?"

Two continuous reckoners per exit observer:
- **Trail reckoner** — what trailing stop distance produces the most Grace?
- **Stop reckoner** — what safety stop distance provides the best protection?

Each observer has a [[Lenses|lens]] identity (volatility, structure, timing, generalist) that determines which exit-specific vocabulary subset it considers.

## From Magic Numbers to Measurement

The system starts with **crutch values** — hardcoded multipliers of ATR (e.g., trail = 1.5% of price, stop = 3.0%). These are returned when the reckoners are ignorant (zero experience).

As observations accumulate, the reckoners learn what distances the market actually rewarded. The crutch is replaced by measurement. This is one of the system's most elegant mechanisms: it starts conservative and learns to be optimal, never gambling on unproven parameters.

## The Composition Pipeline

Exit observers don't just predict from market thoughts — they **compose** market thoughts with their own exit-specific facts:

1. Receive the market observer's thought vector
2. Encode exit-specific facts via their lens (volatility facts, structure facts, timing facts)
3. Bundle market thought + exit facts → composed thought
4. Feed composed thought to continuous reckoners → optimal trail and stop distances

This composition is crucial: the optimal exit distance depends on BOTH the market context AND the exit conditions. High volatility + tight squeeze = different trail than low volatility + wide range.

## Scalar Accumulator Extraction

The [[Scalar Accumulator]] provides a complementary extraction mechanism:

1. Grace outcomes accumulate into a Grace prototype vector
2. Violence outcomes accumulate into a Violence prototype vector
3. To extract: try candidate distance values, encode each, cosine against Grace prototype
4. The candidate closest to Grace wins — "what value does Grace prefer overall?"

This is global per-pair — one answer regardless of thought. It captures the baseline distance preference, while the continuous reckoners capture the context-dependent adjustment.

## The Exit Lenses

| Lens | What It Evaluates |
|------|------------------|
| **Volatility** | ATR ratio, KAMA efficiency ratio — how much room does the market need? |
| **Structure** | Price action body ratio, range ratio — what shape is the price action? |
| **Timing** | Stochastic K/D spread, cross delta — where in the cycle are we? |
| **Generalist** | All exit modules combined |

## Breathing Stops

The most important consequence of exit observers: **the stops breathe**.

Every candle, step 3c of [[The Four-Step Loop]] re-queries the exit observer with the current composed thought. The exit reckoners, trained on every prior resolution, provide updated optimal distances. Active trade stop levels are updated continuously.

The stops are not set-and-forget. They adapt. Tighter when the market says tighten. Wider when it says breathe. This continuous stop management IS the mechanism for maximizing residue — the trade captures as much as the market will give, bounded by learned distances.

## Related Concepts

- [[Market Observers]] — the sibling observer type that predicts direction
- [[Brokers]] — compose market + exit observer outputs into proposals
- [[Scalar Accumulator]] — the complementary extraction mechanism
- [[The Reckoner]] — continuous readout mode for distance regression
- [[Lenses]] — exit lens variants
- [[Trade Lifecycle]] — how learned distances govern stop management
- [[Paper Trades]] — how exit observers learn from hypothetical trades
