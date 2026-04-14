# Conviction-Accuracy Curve

> **TL;DR:** `accuracy = 0.50 + a × exp(b × conviction)`. The universal judge. Continuous, monotonic, and real. It emerges from the geometry of 10,000-dimensional space — not from fitting, but from the statistics of high-dimensional voting.

## The Shape

```
accuracy
  ↑
  │           ╱  exponential zone
  │         ╱    (63%+ accuracy)
  │       ╱
  │     ╱  signal emerges
  │   ╱    (55% accuracy)
  │ ╱
  │─╱──── noise zone (50% accuracy)
  └──────────────────→ conviction
  0.13  0.22
```

Three regions:
- **Below 0.13 conviction**: noise. 50%. The discriminant's cosine is indistinguishable from random.
- **0.14–0.22**: signal emerges. 55%. Enough facts are voting coherently.
- **Above 0.23**: exponential zone. 63%+. The thought vector screams "extreme."

The curve is not an artifact. It is the geometry of the encoding space. Higher conviction means more facts aligned in the same direction — the probability of many independent facts coincidentally aligning decreases exponentially.

## The Empirical Evidence

| Conviction Threshold | Accuracy | Trades |
|---------------------|----------|--------|
| ≥ 0.22 | 60.2% | 676 |
| ≥ 0.24 | 65.9% | 317 |
| ≥ 0.25 | 70.9% | 86 |
| q99 (top 1%) | 59.7% | 870 (100k candles) |

At 59.7% across 100k candles, the system approaches territory that published ML research calls unreliable. The first 40,000 candles: 75.6% accuracy.

## Why It Works

The discriminant direction separates two class centroids (e.g., "Up" and "Down") in 10,000 dimensions. Conviction measures how aligned a thought is with that direction.

High alignment = many individual facts (atoms bound to values) voting in the same direction. The probability of this happening by chance decreases exponentially with the number of agreeing facts. This is the "wisdom of crowds" in vector algebra.

## The Curve as Type System

The conviction-accuracy curve functions as the system's **type system**:

| Lisp | Thought Machine |
|------|----------------|
| `eval` | Cosine against discriminant |
| Type system | Conviction-accuracy curve |

Does this expression carry truth? The curve says. It doesn't reject types — it measures how much truth they carry. Every thought gets a conviction. The curve maps that conviction to expected accuracy. The treasury uses this mapping to size positions.

## The Curve is a Thought (Meta-Cognition)

The curve parameters (a, b) change over time. That change is a signal:
- `a` increasing → thoughts becoming more predictive
- `b` increasing → exponential steeper, high conviction more meaningful
- `a` decreasing → thoughts losing relevance, regime shift
- `b` flattening → conviction no longer discriminates, discriminant stale

These parameters are **meta-thoughts** — thoughts about the quality of other thoughts. They could be encoded as atoms: `(at curve steep)`, `(at curve flattening)`. Bundled with market thoughts, they make the system self-referential: thinking about how well it's thinking.

## The Conviction Flip

At the 36-candle horizon, established trends are exhausted. The system is confidently wrong about continuation — which means it's confidently right about reversal, if you flip the prediction.

When conviction exceeds a threshold, reverse the direction. The system doesn't predict reversals directly. It identifies trend extremes with high confidence, and the flip converts that into a reversal trade.

## One Economic Parameter

The entire system can be reduced to one economic parameter: **minimum acceptable edge**. Given that:
- The exponential curve derives the trading threshold
- Position sizing follows from the edge
- The trade gate follows from the edge

Everything flows from one number. The system's complexity is in the cognition, not in the parameter tuning.

## Related Concepts

- [[Conviction]] — what the curve maps from
- [[Discriminant]] — what produces conviction
- [[The Reckoner]] — what carries the curve internally
- [[Vocabulary]] — what determines the curve's steepness
- [[The Treasury]] — what uses the curve for funding decisions
- [[The GPU Thought Engine]] — what evaluates curves at massive scale
