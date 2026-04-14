# Market Observer

**TL;DR:** A market observer perceives a candle through a specific lens, encodes what it sees into a high-dimensional thought vector, and predicts whether price will go Up or Down. It's the "mind" of the system — each lens creates a different mind thinking different thoughts about the same market data. N observers per post, one per [[lens|MarketLens]] variant.

---

## What It Does

The market observer answers one question: *which way is price going?* It does this not through heuristics or threshold rules, but through learned discriminant directions in a 10,000-dimensional vector space. Over time, the observer accumulates experience about which patterns of market data preceded Up moves and which preceded Down moves. The [[reckoner]] builds a discriminant — a direction in thought-space that separates the two outcomes. When a new candle arrives, the observer encodes what it sees, computes cosine similarity against the discriminant, and that cosine IS the prediction.

Six observers per post, one per lens variant: **momentum, structure, volume, narrative, regime, generalist**. Each lens selects a different subset of the [[vocabulary]] — a different set of facts to think about. The momentum observer thinks about oscillators and trend strength. The structure observer thinks about Keltner channels, Fibonacci levels, and price action patterns. The generalist thinks about everything. Each mind is valid. Each mind is limited. The system needs all of them.

## Anatomy

Each market observer contains four internal components:

### The Reckoner (Discrete)

The learning engine. Configured with `(Discrete ("Up" "Down"))` — it classifies thoughts into two categories. Given a thought vector, it returns scores for each label and an overall conviction (cosine similarity against the learned discriminant).

The reckoner is the only thing that learns. The vocabulary encodes. The lens filters. The window sampler selects. But learning — the accumulation of experience from outcomes — belongs to the reckoner.

### Noise Subspace

An `OnlineSubspace` (8 principal components) that learns what "normal" looks like. It builds a background model from all the thoughts it's seen. When a new thought arrives, the noise subspace computes the **anomalous component** — the part of the thought it *cannot* explain.

This is the signal extraction step. Most thoughts are boring — they describe a market doing what markets usually do. The noise subspace absorbs the boring part and returns what's unusual. The reckoner learns from the residual, not the raw thought. High residual = unusual market = potentially informative. Low residual = normal market = probably noise.

The noise subspace is the observer's immune system. It filters the mundane so the reckoner can focus on what matters.

### Window Sampler

A deterministic log-uniform window selector. Each observer has its own seed, its own time scale. Every candle, it samples a window size between `min-window` (12 candles) and `max-window` (2016 candles). The observer slices that many recent candles from the post's history and encodes them.

Why? Because different market regimes require different lookback windows. A momentum play might need the last 20 candles. A structural shift might need 500. The window sampler provides variety without requiring the observer to *choose* a window — it explores different time scales naturally.

The window sampler is a crutch. The optimal window is learnable — the market tells us which windows produce [[grace-and-violence|Grace]]. When window sampling becomes learned, the feedback routes through the same resolution mechanism. The market observer adjusts its sampler based on which windows produced Grace in similar contexts. This is a coordinate for future work.

### Lens

Which vocabulary subset the observer thinks through. The lens IS the observer's identity. It determines which modules from `market/` and `shared/` fire. A `:momentum` lens calls `oscillators.wat`, `momentum.wat`, and `stochastic.wat`. A `:structure` lens calls `keltner.wat`, `fibonacci.wat`, `ichimoku.wat`, and `price-action.wat`. The `:generalist` calls all modules.

Every lens also includes `standard.wat` (universal context — recency, distance from extremes, session depth) and `shared/time.wat` (circular temporal scalars). These are the baseline facts every observer shares.

## The Prediction Flow

```
candle arrives
  → vocabulary modules produce ThoughtASTs (data, not vectors)
  → observer wraps ASTs in a Bundle
  → observer calls encode(bundle) → thought vector (+ cache misses)
  → noise subspace updates with the thought
  → observer calls strip-noise(thought) → residual vector
  → observer calls predict(residual) → Prediction { scores: [("Up", cosine), ("Down", cosine)], conviction }
  → observer stores the winning direction (last-prediction)
  → observer calls edge-at(reckoner, conviction) → accuracy f64
  → returns (thought, prediction, edge, misses)
```

The winning direction is the one with the higher score. It's stored on the observer so that when `resolve` is called later (after the trade settles and reality reveals what actually happened), the observer can compare its prediction against reality. Match → correct. Mismatch → incorrect. The reckoner's internal curve gets fed via `resolve(reckoner, conviction, correct?)`.

## The Prediction Is Data, Not Action

The market observer returns `("Up", 0.73)` or `("Down", -0.41)`. It does NOT say "buy" or "sell." The prediction is data. The consumer (the broker) decides what to do with it. The broker has its own reckoner that takes the composed thought and predicts Grace/Violence. The broker's prediction is what drives capital allocation.

This separation matters. The market observer is an expert witness. It testifies about direction. The broker is the jury. It weighs all testimony and decides whether to commit capital.

## Engram Gating

After a recalibration produces good accuracy, the system snapshots the discriminant into a "good state" subspace (4 principal components). Future recalibrations are checked against this memory — does the new discriminant match a known good state? This prevents the reckoner from drifting into a regime where it's confident but wrong.

The engram gate has four fields: `recalib-wins`, `recalib-total`, `last-recalib-count`, and the good-state subspace itself. It's shared utility — both market observers and brokers use the same mechanism, just with different reckoners.

## Starting Ignorant

Every market observer begins with zero experience. No edge. The reckoner does not participate when it knows it doesn't know. There is no special bootstrap logic — no pre-trained weights, no historical warmup. The architecture IS the bootstrap. Papers fill the reckoner with experience. The curve steepens. The treasury starts listening. Start ignorant. Learn. Graduate.

## Related Concepts

- [[lens]] — the vocabulary filter that defines the observer's identity
- [[reckoner]] — the learning primitive inside every observer
- [[vocabulary]] — the complete set of atoms observers compose into thoughts
- [[thought-system]] — the algebra of atoms, bind, bundle, and cosine
- [[market-observer|Noise Subspace]] — the background model that extracts anomalous signal
- [[broker]] — consumes market thoughts and proposes capital allocation
- [[grace-and-violence]] — the accountability labels that teach the observer
- [[conviction]] — cosine similarity as prediction confidence
