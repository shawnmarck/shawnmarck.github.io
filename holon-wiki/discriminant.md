# Discriminant

> **TL;DR:** The direction in thought-space that separates two outcomes. Built by the [[The Reckoner|reckoner]] from accumulated experience. Cosine against it → [[Conviction|conviction]]. The discriminant IS the system's learned understanding of the world.

## What It Is

The discriminant is a vector — a direction in 10,000-dimensional [[Thought Space|thought space]]. It represents the axis along which two outcomes (Up/Down, Grace/Violence) are most separated.

"Which direction in 10,000 dimensions best separates Grace from Violence?" The discriminant IS that direction.

## How It's Built

1. The reckoner accumulates observations: thought-vectors paired with outcomes
2. Up/Grace observations accumulate into an Up/Grace prototype
3. Down/Violence observations accumulate into a Down/Violence prototype
4. The discriminant is the normalized difference: `normalize(grace_prototype - violence_prototype)`
5. After recalibration, the discriminant is recomputed from all accumulated state

## What It Means

Cosine against the discriminant produces [[Conviction|conviction]]:
- High positive cosine → the thought strongly resembles Grace/Up outcomes
- Near zero → ambiguous, the thought doesn't clearly favor either outcome
- High negative cosine → the thought strongly resembles Violence/Down outcomes

The [[Conviction-Accuracy Curve]] emerges from this geometry. When conviction is high, many individual facts (bound atoms in the thought) are aligned with the discriminant direction. The probability of this happening by chance decreases exponentially.

## The Decode

The discriminant can be decoded to reveal which atoms contribute most to the separation. This produces human-readable explanations: "the champion expert uses RSI divergence composed with volume exhaustion at Fibonacci 0.618 retracement levels during Bollinger Band squeezes."

The decode IS the system explaining itself. The atoms were named from the start — the vectors are human-readable because the names are the vectors.

## Regime Sensitivity

The discriminant direction shifts between market regimes — what separates Grace from Violence in a bull market may differ from a bear market. But the encoding space is stable (the thought manifold's eigenvalue structure doesn't change). Only the discriminant rotates.

This means the system can detect regime changes by monitoring discriminant stability. A rapidly shifting discriminant signals that the market's structure is changing faster than the reckoner can track.

## Engram Protection

[[Engram Gating]] protects against bad recalibrations. After a recalibration with good accuracy, the discriminant is snapshot as an "engram" — a memory of a known-good state. Future recalibrations are checked: does the new discriminant match a known good state?

## Related Concepts

- [[The Reckoner]] — builds and maintains the discriminant
- [[Conviction]] — cosine against the discriminant
- [[Conviction-Accuracy Curve]] — maps conviction to accuracy
- [[Thought Space]] — the geometry the discriminant lives in
- [[Engram Gating]] — protects discriminant quality across recalibrations
- [[Vocabulary]] — determines what the discriminant can separate
