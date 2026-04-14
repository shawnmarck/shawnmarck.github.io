# Noise Subspace

> **TL;DR:** An OnlineSubspace that learns what ALL thoughts look like — the average texture of thought-space. The anomalous component IS what's unusual. High residual = interesting. Low residual = boring.

## What It Is

Each observer has a noise subspace — an online learning mechanism that builds a model of "normal" thought patterns. It uses principal component analysis to learn the dominant directions in thought-space.

```
update(subspace, thought)           — add thought to the normal model
anomalous-component(subspace, thought) → Vector  — the unusual part
residual(subspace, thought) → f64   — how unusual? (scalar)
sample-count(subspace) → usize       — how many observations?
```

## The Signal Extraction Pipeline

When a candle arrives:

1. Vocabulary produces ThoughtASTs
2. ThoughtEncoder evaluates them → thought bundle
3. **Noise subspace strips normal texture** → anomalous component
4. The [[The Reckoner|reckoner]] learns from the anomalous component, not the raw thought

Why? Because most of what a thought contains is "the market is doing normal market things." The signal is in what's unusual — what doesn't fit the background model. By stripping the noise, the reckoner sees the signal more clearly.

## Residual as Novelty Detector

The residual (scalar output) measures how much of the current thought the subspace cannot explain:
- Low residual → the thought is typical, consistent with normal patterns
- High residual → the thought is anomalous, something unusual is happening

This is not used as a gate (the system doesn't skip unusual candles). It's used to **focus learning** — the anomalous component is what the reckoner learns from.

## Relationship to Regime Detection

The noise subspace is related to but distinct from regime detection:
- The subspace learns the local structure of thought-space
- Regime is a global property of the market
- The subspace can detect unusual thoughts within any regime

The system found that explicit regime prediction doesn't work — conviction level, variance, and subspace residual none predict bad epochs. The thought manifold is regime-invariant. The noise subspace helps within regimes, not across them.

## Shared Between Observers?

Each observer has its own noise subspace, trained on its own lens-filtered thoughts. A momentum observer's "normal" is different from a regime observer's "normal." The subspaces are independent.

## Related Concepts

- [[The Reckoner]] — learns from the anomalous component
- [[Market Observers]] — each has its own noise subspace
- [[Thought Space]] — the geometry the subspace models
- [[Engram Gating]] — a related mechanism for protecting learned states
