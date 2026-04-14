# Thought Space

> **TL;DR:** Thought Space is the 10,000-dimensional bipolar vector space where all thoughts live. Cosine similarity is the distance metric — it measures alignment between directions. The [[reckoner]] learns a discriminant direction that separates [[grace-and-violence]], and conviction is simply the cosine of a thought against that direction.

## The Geometry

Every [[thought-system|Thought]] in holon-lab-trading is a point in ℝ^10000 — a 10,000-dimensional vector. These vectors live on the unit hypersphere (normalized after each operation). The space is the substrate. The algebra ([[atom]], [[bind]], [[bundle]]) operates within it. The geometry determines what works.

10,000 dimensions is not arbitrary. It's the sweet spot: large enough for quasi-orthogonality (random vectors are nearly perpendicular), small enough to be cheap. 16k and 20k dimensions showed no improvement in experiments — signal is the bottleneck, not capacity.

## Quasi-Orthogonality: The Foundation

In high-dimensional spaces, a fundamental geometric property emerges: **random unit vectors have expected cosine similarity near zero, with very low variance.**

This means:
- Each [[atom]] occupies its own direction, largely independent of every other atom.
- [[bind|Bindings]] of different atoms produce distinct directions.
- [[bundle|Bundles]] of different fact sets produce distinct directions.
- The space has *room* — you can add thousands of atoms without them interfering.

Quasi-orthogonality is what makes the algebra work. If atoms weren't near-orthogonal, binding `"rsi"` and `"macd"` would produce similar vectors, and the discriminant couldn't distinguish them. The high dimensionality guarantees distinguishability.

## Cosine Similarity: The Only Distance Metric

The system uses exactly one distance metric: cosine similarity.

```
cosine(A, B) = (A · B) / (|A| × |B|)
```

Range: [-1, 1]. +1 = identical direction. 0 = orthogonal. -1 = opposite direction.

Cosine is the natural metric for this space because:
- Vectors are normalized (unit length), so cosine = dot product. O(D) computation.
- It measures *alignment of direction*, not magnitude. A strong signal and a weak signal pointing the same way have the same cosine.
- It composes: cosine against a discriminant is all you need to evaluate a thought.

No Euclidean distance. No Manhattan distance. No angular distance. One metric. One cosine.

## The Discriminant Direction

The [[reckoner]] learns a **discriminant** — the direction in thought-space that best separates two outcomes. For a market observer, the discriminant separates Up from Down. For a broker, it separates [[grace-and-violence]] from each other.

"Which direction in 10,000 dimensions best separates correct predictions from incorrect ones?" The discriminant IS that direction. It's a single unit vector — one point on the hypersphere — learned from accumulated experience.

The discriminant is computed by accumulating evidence vectors from observations. Up outcomes accumulate one way. Down outcomes accumulate another. The discriminant is the normalized difference between the two accumulators (after exponential decay). It's recalibrated periodically.

## Conviction: Cosine Against the Discriminant

```
conviction = cosine(thought, discriminant)
```

Conviction is how aligned the thought is with the direction that predicts the positive outcome. High conviction = many facts in the thought voting in the same direction. Low conviction = ambiguous.

Conviction is not a probability. It's a geometric measurement. But it behaves like one in a useful way: high conviction means the thought strongly resembles past thoughts that predicted well. Low conviction means the thought doesn't clearly resemble either outcome class.

The discriminant decode reveals which thoughts drive predictions. If `bind(diverging, bind(close_up, rsi_down))` has cosine 0.15 against the discriminant but `rsi_down` alone has cosine 0.12, the composition adds only 0.03 of signal beyond its subcomponent. The system discovers this by encoding all compositions and letting the discriminant evaluate them.

## Signal vs Noise in the Geometry

The foundational experiment compared two encodings of the same data:

**Visual encoding:** 25×48 raster grid of colored cells, faithfully representing the price chart. Every pixel, every wick, every indicator line. Win-Win cosine: 0.4031. Win-Loss cosine: 0.4026. Gap: 0.0004. **No signal.**

**Thought encoding:** 120+ named relational facts about the same chart. RSI divergence, volume ratio, Bollinger position — all as compositional vectors. Separation (d'): 0.734. **Real signal.**

Same data. Same dimensionality. One encoding carries information about future direction. The other doesn't. The difference is the encoding:

- Pixels encode *appearance* — what the chart looks like.
- Thoughts encode *interpretation* — what the chart means.

The geometry doesn't care about appearance. It cares about structure. Named relationships create structure. Raw pixels don't.

## The Thought Manifold

The set of all possible thoughts forms a manifold in ℝ^10000 — a lower-dimensional surface embedded in the high-dimensional space. The manifold's structure reflects the market's structure:

- Nearby thoughts on the manifold represent similar market states.
- Distant thoughts represent fundamentally different conditions.
- The manifold's topology encodes which market transitions are common (smooth paths) and which are rare (large jumps).

The regime-invariance finding supports this: the thought manifold's eigenvalue structure is stable across market regimes (53% explained ratio, stable eigenvalues). The manifold shape doesn't change between bull and bear markets. Only the discriminant direction shifts — what predicts *grace* changes, but the space of possible thoughts doesn't.

## Noise Subspace

The [[market-observer|OnlineSubspace]] (CCIPCA) learns what "normal" looks like in thought-space. It accumulates a background model — the principal components of all thoughts seen so far.

The anomalous component — the part of a new thought that the subspace *cannot* explain — is what's unusual. The residual measures how strange this thought is. High residual = anomalous market state. Low residual = boring, normal market.

Market observers strip noise before predicting. They project the thought through the noise subspace, keep the residual, and feed the residual to the reckoner. The reckoner learns from what's unusual, not what's normal.

## OnlineSubspace and Anomaly Detection

The subspace learns continuously. Each new thought updates the principal components (the first k eigenvectors). Old experience decays. The subspace adapts to regime changes — what's "normal" in a trending market differs from what's normal in a choppy one.

The residual is used in two contexts:
1. **Market observers** strip noise before predicting (above).
2. **Risk management** uses a separate subspace to detect anomalous portfolio states — the "shield cognition" mechanism from the system's AWS origins.

## The Space Is Domain-Independent

The 10,000-dimensional space doesn't know it's being used for trading. It's just geometry. The same space, the same cosine, the same discriminant mechanism can be pointed at any domain:

- Trading: atoms named after technical indicators
- Network security: atoms named after packet fields
- Medical imaging: atoms named after diagnostic features

The algebra doesn't care what thoughts you think. It cares how they compose. The vocabulary is domain-specific. The geometry is universal.

## Dimensionality: Why 10,000?

10,000 was chosen empirically. The experiments tested multiple dimensionalities:

- Lower dimensions (1000, 5000): quasi-orthogonality degrades. Atoms interfere.
- 10,000: sweet spot. Full quasi-orthogonality. Cheap computation.
- Higher dimensions (16k, 20k): no improvement. Signal is the bottleneck.

The vector capacity is not the constraint. The vocabulary is. 84 atoms fit easily in 10,000 dimensions with room for thousands more. The hyperspace is not full. The bottleneck is *which thoughts to think*, not *where to put them*.

## Related Concepts

- [[thought-system]] — the algebra that operates in this space
- [[atom]] — points in this space
- [[bind]] — creates new directions in this space
- [[bundle]] — superposes directions in this space
- [[thought-encoding]] — maps data into this space
- [[reckoner]] — learns discriminant directions
- [[conviction]] — cosine against the discriminant
- [[grace-and-violence]] — the outcomes the discriminant separates
- [[market-observer|OnlineSubspace]] — learns the background manifold
