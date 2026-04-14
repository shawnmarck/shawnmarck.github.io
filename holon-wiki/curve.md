# Curve

> **TL;DR:** A Curve is a thought that judges other thoughts. It maps conviction (how strongly the system predicts) to accuracy (how often the prediction is correct). The curve is continuous, monotonic, and self-evaluating — it reports its own quality through amplitude and exponent parameters. One scalar communicates everything the curve knows.

## The Self-Evaluating Accuracy Surface

The [[reckoner]] carries its own internal curve. After many predictions resolve (correct or incorrect), the curve answers: "when you predicted with conviction X, how often were you right?"

The relationship follows an exponential form:

```
accuracy = 0.50 + a × exp(b × conviction)
```

Three parameters describe the curve's state:
- **a** (amplitude) — how much edge exists above baseline. When a increases, the system's thoughts are becoming more predictive.
- **b** (exponent) — how steeply accuracy improves with conviction. When b increases, high conviction is more meaningful.
- **bias** (0.50) — the floor. Below the conviction threshold, predictions are noise.

## The Three Zones

The conviction-accuracy curve has three empirically verified zones:

### Below ~0.13: Noise
50% accuracy. The discriminant's cosine is indistinguishable from random. The facts are not voting coherently. The system shouldn't act on these predictions.

### 0.14 to 0.22: Signal Emerges
55% accuracy. Enough facts are voting in the same direction to produce a slight edge. Worth tracking. Marginal for trading after costs.

### Above 0.23: Exponential Zone
60–70%+ accuracy. The thought vector screams "extreme." Many facts voting coherently. This is where the system makes money.

The curve is continuous and monotonic. Every step up in conviction produces proportionally better accuracy. At conviction ≥ 0.22: 60.2% over 676 trades. At ≥ 0.24: 65.9% over 317 trades. At ≥ 0.25: 70.9% over 86 trades.

## Why the Exponential Emerges

This isn't an artifact. It's geometry.

The discriminant is a direction in 10,000-dimensional space that separates two outcomes (e.g., Up from Down, [[grace-and-violence]]). Conviction is cosine similarity against that direction. Higher conviction means the thought vector is more aligned with the discriminant — more individual facts are pointing in the predicted direction.

The probability of many *independent* facts coincidentally aligning in the same direction decreases exponentially. With N quasi-orthogonal facts in the bundle, the probability that k of them randomly agree is combinatorial — it falls off exponentially as k increases. So the fraction of "true positives" among high-conviction predictions increases exponentially with conviction.

The "wisdom of crowds" in vector algebra. Many small votes, all coherent → the system is probably right.

## How the Curve Works

The curve is internal to the reckoner. Two operations:

### resolve — Feed a Resolved Prediction

```scheme
(resolve reckoner conviction correct?)
```

When a prediction resolves, the reckoner learns. `correct?` is a boolean — did the prediction match reality? The conviction at prediction time is recorded alongside the outcome. Over time, the curve accumulates (conviction, correct?) pairs and fits the exponential.

### edge-at — Query the Curve

```scheme
(edge-at reckoner conviction) → f64
```

"Given my history, if I predict with this conviction, how accurate will I be?" Returns a value in [0.0, 1.0]. 0.50 = noise. 0.70 = strong edge. The producer calls this and attaches the result to its message.

### proven? — Trust Gate

```scheme
(proven? reckoner min-samples) → bool
```

"Have I seen enough predictions to trust my curve?" Before the curve has accumulated sufficient data, `edge-at` returns 0.0. No edge. The observer doesn't participate when it knows it doesn't know.

## The Conviction-Accuracy Mapping

The curve maps one scalar to another:

```
conviction (cosine against discriminant) → accuracy (historical win rate)
```

This mapping is the system's self-knowledge. It answers: "how much should I trust myself at this conviction level?"

The treasury uses this mapping to allocate capital. Higher edge → more capital. The system doesn't need a human to set thresholds. The curve derives the threshold from one economic parameter: minimum acceptable edge.

Position sizing, trade gating, and confidence thresholds all derive from this one curve. One continuous surface drives the entire risk management system.

## The Curve Communicates via One Scalar

The curve doesn't export snapshots, meta-journals, or summary statistics. It communicates through one f64:

```
edge = edge-at(reckoner, conviction)
```

The producer calls this, attaches the result to its message, and the consumer uses it. The consumer can:
- **Gate:** skip trades where edge < threshold
- **Weight:** scale position size by edge
- **Sort:** rank proposals by edge
- **Encode:** bundle the edge as a fact for downstream reckoners

That last option — encoding edge as a [[fact]] — is how the system composes expertise. The market observer's edge becomes a fact in the broker's thought. The broker's reckoner learns whether the market observer's edge predicts [[grace-and-violence|Grace]]. Opinions carry credibility. Raw data does not.

## The Curve Is a Thought

The curve parameters (a, b) are themselves meaningful quantities. They change over time. The changes carry signal:

- **a increasing:** the vocabulary contains more signal. The thoughts are getting better.
- **a decreasing:** the thoughts are losing relevance. The regime has shifted.
- **b increasing:** high conviction is more meaningful. The discriminant is sharp.
- **b flattening:** conviction no longer discriminates. The discriminant is stale.

These parameters could be encoded as atoms: `(at curve steep)`, `(at curve flattening)`. Bundled with market thoughts, they become self-referential: the system thinks about how well it's thinking.

This is the strange loop. The system's output (predictions with conviction) generates the curve. The curve describes the system's quality. The quality could be fed back as input. The system that reasons about its own reasoning. Gödel's incompleteness as a feature, not a bug.

## Curve Across Regimes

The conviction-accuracy curve is remarkably stable across market regimes:

```
2019 (bull recovery):  59.3%
2020 (COVID crash):    58.3%
2021 (mega bull):      55.7%
2022 (bear):           60.3%  ← best year, during the worst market
2023 (choppy):         50.1%  ← worst year, directionless market
2024 (new ATH):        52.6%
```

The curve doesn't care about the market regime. It cares about the measurement basis — the vocabulary and the discriminant. When the regime shifts, the discriminant recalibrates. The curve adjusts. The geometry adapts.

## The Curve as Selection Pressure

The curve is the universal judge. It evaluates any thought vocabulary on any data stream:

- Steeper curve → better thoughts. More signal.
- Flatter curve → useless thoughts. Noise.
- Negative slope → anti-correlated. Flip the prediction.

Different [[lens|lenses]] produce different curves. The steepest curve wins. The vocabulary is the hypothesis. The curve is the experiment. Evolution happens at the speed of data.

## Related Concepts

- [[reckoner]] — the learning primitive that carries the curve
- [[conviction]] — cosine similarity against the discriminant
- [[thought-system]] — the algebra the curve evaluates
- [[grace-and-violence]] — the outcomes the curve measures
- [[fact]] — how the curve's output gets encoded for downstream consumers
- [[broker]] — uses the curve for trade proposals
- [[treasury]] — allocates capital based on edge from the curve
- [[conviction|Conviction-Accuracy Curve]] — the detailed treatment of the curve's mathematics
