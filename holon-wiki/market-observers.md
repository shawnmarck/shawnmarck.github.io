# Market Observers

> **TL;DR:** N entities per post, each with a [[Lenses|lens]] identity. They predict market direction (Up/Down) using discrete [[The Reckoner|reckoners]]. Each lens is a different way of thinking about the same market data.

## What They Do

A market observer perceives a candle through a specific lens and predicts: "will the price go up or down?"

Each observer has:
- A **lens** — which vocabulary subset it thinks through (momentum, structure, volume, regime, narrative, generalist)
- A **discrete reckoner** — accumulates Up/Down observations, builds a direction discriminant
- A **noise subspace** — an [[Noise Subspace]] that strips background texture from thoughts
- A **window sampler** — selects a random window of candles for context
- An **experience counter** — starts at 0, grows with each observation

## The Lenses

Six lenses, six ways of seeing the same market:

| Lens | What It Sees | Key Indicators |
|------|-------------|----------------|
| **Momentum** | Rate and direction of price change | RSI, MACD, DI spread, ROC |
| **Structure** | Shape and boundaries of price action | Bollinger, Keltner squeeze, ATR, gaps |
| **Volume** | Participation and conviction | MFI, OBV slope, buying pressure, volume accel |
| **Regime** | Character of the market itself | Hurst, choppiness, fractal dimension, variance ratio |
| **Narrative** | Story the chart is telling | Ichimoku, divergence, PELT changepoints |
| **Generalist** | Everything at once | All modules combined |

The lens IS the observer's identity. A momentum observer and a regime observer see the same candle but think different thoughts. Their reckoners build different discriminants. Their conviction-accuracy curves may differ.

## The Prediction Pipeline

1. Candle arrives at the post
2. IndicatorBank enriches it (raw OHLCV → 100+ indicators)
3. Vocabulary module produces ThoughtASTs (deferred facts)
4. ThoughtEncoder evaluates ASTs → bundle of fact-vectors → one **thought**
5. Noise subspace strips normal texture → anomalous component
6. Reckoner predicts: cosine(thought, discriminant) → (Up/Down scores, conviction)

## The Learning Pipeline

When a trade resolves (or a paper resolves), the actual direction (Up/Down) routes back to the market observer:

1. `reckoner.observe(thought, actual_direction, weight)` — feed the outcome
2. The reckoner accumulates this experience into its Up and Down prototypes
3. After recalib-interval observations, the discriminant is recomputed
4. The conviction-accuracy curve is updated with the new prediction accuracy

## Why Multiple Observers?

Different lenses capture different signal. In regime-phased markets, the regime observer may outperform. In trending markets, momentum may lead. The [[Brokers]] compose market observer predictions with exit observer predictions — the combination is what gets traded.

The system doesn't pick the "best" observer a priori. It runs all of them, lets the [[Conviction-Accuracy Curve]] evaluate each one, and lets the treasury fund the broker teams that demonstrate edge.

## The Window Sampler

Each observer samples a random window of past candles (12–2016 candles) for context. The randomness prevents overfitting to a fixed lookback period. Different windows produce slightly different thoughts — the reckoner learns from the distribution, not from a single viewpoint.

## Related Concepts

- [[Lenses]] — the vocabulary subset selection mechanism
- [[Exit Observers]] — the sibling observer type that predicts distances
- [[Brokers]] — bind one market observer + one exit observer into a team
- [[The Reckoner]] — the learning primitive inside each observer
- [[Noise Subspace]] — strips background texture before prediction
- [[Vocabulary]] — the named concepts observers think with
- [[The Four-Step Loop]] — where observers participate in compute+dispatch and propagation
