# Exit Observer

**TL;DR:** An exit observer estimates how far to set your stops — trailing stop distance, safety stop distance, take-profit level, and runner trailing stop. It doesn't predict direction; it predicts *magnitude*. Each exit observer has four continuous reckoners that learn context-dependent distance values from resolved trades. M observers per post, one per [[lens|ExitLens]] variant.

---

## What It Does

The market observer answers "which way?" The exit observer answers "how far?" These are fundamentally different questions. Direction is binary (Up/Down). Distance is continuous — a scalar percentage of price. The exit observer's job is to predict, for a given market context, what trailing stop distance and safety stop distance would have produced [[grace-and-violence|Grace]].

This matters enormously. A 1.5% trailing stop in a trending market captures enormous residue. The same 1.5% in a choppy market gets stopped out constantly. The exit observer learns that different market contexts demand different distances, and it provides those distances as inputs to the trading decision.

## The Exit Lens

Four variants, each with a different judgment vocabulary:

- **`:volatility`** — ATR regime, ATR ratio, ATR rate of change, squeeze state, Bollinger width. Thinks about how much the market is moving.
- **`:structure`** — Trend consistency at multiple windows, ADX strength, KAMA efficiency ratio. Thinks about whether a trend exists.
- **`:timing`** — RSI, stochastic K, stochastic K-D spread, MACD histogram, CCI. Thinks about momentum state and reversal signals.
- **`:generalist`** — All three above. No special treatment, just another lens.

Every lens also has access to the `shared/time.wat` temporal facts (minute, hour, day-of-week, etc.).

Each lens maps to a `exit/*.wat` module that produces judgment fact ASTs. The observer doesn't encode them itself — it produces data (ThoughtASTs), and the composition site evaluates them using `ctx`'s ThoughtEncoder.

## Composition: Market Thought + Exit Facts

The exit observer's unique design feature is **thought composition**. It doesn't think in isolation. It takes the market observer's thought vector and superposes its own exit-specific facts on top.

Why? Because optimal exit distances depend on BOTH the market context AND the exit conditions. A strong uptrend with low volatility says "wide trail, tight stop." A weak trend with high volatility says "tight trail, wide stop." The market observer captures the trend signal. The exit observer captures the volatility/structure/timing signal. The composed vector carries both.

The composition flow:
```
market observer → market thought vector
exit observer   → encodes exit fact ASTs via ThoughtEncoder
               → bundles exit fact vectors with market thought
               → composed vector carries both signals
```

The composed vector is what the reckoners learn from and predict against. This is what makes the distance predictions **contextual** — they respond to the full picture, not just the exit conditions.

## Four Continuous Reckoners

Each exit observer has four reckoners, one per distance type:

1. **Trail reckoner** — predicts optimal trailing stop distance (percentage of price)
2. **Stop reckoner** — predicts optimal safety stop distance
3. **Take-profit reckoner** — predicts optimal take-profit distance
4. **Runner trail reckoner** — predicts optimal trailing stop distance during the runner phase

Each is a `Reckoner` with `Continuous` readout mode. Instead of classifying into labels, it accumulates `(thought, distance, weight)` observations and returns a cosine-weighted distance for a given query thought.

Observation: "When the thought looked like THIS, the optimal trailing stop was 2.3% of price, weighted by the magnitude of the outcome."

Query: "For a thought like THIS one, what trailing stop distance does experience suggest?"

The answer is different for every thought. The discriminant direction separates "thoughts that needed wide stops" from "thoughts that needed tight stops." Cosine against that direction maps the query thought to a position on that spectrum.

## The Distance Cascade

When asked for recommended distances, the exit observer doesn't blindly trust its reckoners. It cascades through three levels of confidence:

```
1. Reckoner experienced?
   → YES: use predict(reckoner, composed) → contextual distance
   → NO:  fall through

2. Broker's ScalarAccumulator has data?
   → YES: use extract-scalar(accum) → global per-pair distance
   → NO:  fall through

3. Default (crutch)
   → return configured default value (e.g., 1.5% trail, 3.0% stop)
```

Each distance cascades independently. The trail reckoner might be experienced while the stop reckoner is still falling through to the accumulator. This is honest — the system uses the best available information for each parameter without pretending it knows what it doesn't.

### Contextual vs Global

The reckoners answer: "for THIS thought, what distance?" Different thoughts get different answers. A trending, low-volatility thought gets wide trails. A choppy, high-volatility thought gets tight trails.

The ScalarAccumulators answer: "what distance does Grace prefer for this pair overall?" One answer regardless of thought. It's a global statistical tendency — useful when the reckoners are still ignorant, but crude once contextual learning kicks in.

Both learn from the same resolution events. Different questions, different answers. The cascade naturally transitions from global statistics to contextual intelligence as experience accumulates.

## Simpler Than Market Observer

The exit observer intentionally omits several features that the market observer has:

- **No noise subspace.** The composed thought already carries market signal. Adding another noise filter would strip context the reckoners need.
- **No internal curve.** The exit observer's quality is measured through the **broker's** Grace/Violence curve, not its own. The broker's ratio reflects the combined quality of its market + exit observers. The exit observer is proven through the team it belongs to.
- **No engram gating.** Same reasoning — the broker gates the team.

This simplicity is a design choice, not a limitation. The exit observer is a specialist. Its reckoners do one thing well: map thoughts to distances. The accountability for whether those distances produce profitable trades belongs to the broker.

## Learning From Resolution

When a trade or paper resolves, the broker calls `observe-distances(exit-obs, composed, optimal, weight)`. The `optimal` distances come from hindsight — computed by replaying the price history against candidate values and finding the distance that maximized residue.

Both reckoners learn from the same resolution. The composed thought (market + exit facts) is the key — the reckoners learn that *this specific pattern of market conditions and exit conditions* was associated with *this specific optimal distance*. Over time, they build a map from thought-space to distance-space.

## Related Concepts

- [[market-observer]] — produces the market thoughts that exit observers compose with
- [[broker]] — owns the ScalarAccumulators that provide the global cascade level
- [[reckoner]] — the continuous learning primitive inside each exit observer
- [[exit-observer|Distances]] — the named tuple (trail, stop) that exit observers produce
- [[broker|ScalarAccumulator]] — the global per-pair distance learner on the broker
- [[paper-trade]] — the hypotheticals that feed fast distance learning
- [[grace-and-violence]] — the labels that weight distance observations
- [[vocabulary]] — the exit-specific atoms each lens draws from
