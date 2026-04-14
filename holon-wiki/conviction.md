# Conviction

> **TL;DR:** How strongly the reckoner predicts. The cosine between the thought and the [[Discriminant]]. High conviction = many facts voting in the same direction. Low conviction = ambiguous. The [[Conviction-Accuracy Curve]] maps conviction to expected accuracy.

## What It Is

Conviction is a scalar in [-1, 1] (typically [0, 1] after processing). It measures how aligned a thought-vector is with the learned discriminant direction:

```
conviction = cosine(thought, discriminant)
```

High conviction means the thought falls deep into one region of the discriminant's partition of thought-space. Low conviction means the thought is near the decision boundary.

## The Semantic Meaning

Conviction is not confidence in the statistical sense. It is a **geometric measurement** — the projection of a thought onto a learned direction in 10,000 dimensions.

When conviction is high, many individual facts (bound atoms in the thought bundle) are voting coherently in the same direction. "RSI says overbought AND MACD says divergence AND volume says declining AND Ichimoku says below cloud" — four independent facts agreeing produces higher conviction than any one alone.

## The Conviction Flip

The system's most powerful mechanism. At the 36-candle horizon, established trends are exhausted. The system is confidently wrong about continuation — which means it's confidently right about **reversal**, if you flip the prediction.

When conviction exceeds a threshold, reverse the direction. The system doesn't predict reversals directly. It identifies trend extremes with high confidence, and the flip converts that into a reversal trade.

Evidence: 60.3% accuracy in 2022 — the year BTC fell 77%. The system that bets on reversals thrives when everyone else is capitulating.

## Conviction as the Universal Selector

Conviction is the one economic parameter. Given the conviction-accuracy curve, conviction determines:
- Whether to trade at all (gate)
- How much capital to deploy (sizing)
- Which broker to fund (selection)
- When to flip the prediction (reversal)

Everything flows from conviction. The system's complexity is in the cognition (vocabulary + encoding), not in the decision logic.

## Edge vs Conviction

Edge = accuracy at this conviction level (from the curve). Conviction = how strongly the reckoner leans. They're related but distinct:

- High conviction + high edge = strong, accurate prediction → large position
- High conviction + low edge = strong but unreliable prediction → skip
- Low conviction + any edge = weak prediction → skip

The [[The Treasury|treasury]] funds by edge, not by conviction. A quietly accurate broker beats a loudly inaccurate one.

## Related Concepts

- [[Discriminant]] — what conviction is measured against
- [[Conviction-Accuracy Curve]] — maps conviction to expected accuracy
- [[The Reckoner]] — produces conviction via cosine
- [[The Treasury]] — uses edge (derived from conviction) for funding
- [[Trade Lifecycle]] — conviction gates determine whether trades are proposed
