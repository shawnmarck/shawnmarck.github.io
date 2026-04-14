# Fact

> *A named observation frozen in time — the atom is what you saw, the scalar is how much, and the timestamp is when.*

A Fact is the bridge between raw market data and the compositional algebra of [[Thought Primitives]]. It takes the continuous stream of OHLCV candles and turns it into discrete, named, vectorizable observations.

## Structure

Every fact has three components:

```
Fact = atom + scalar_value + timestamp
```

- **Atom** — what you observed (e.g., `rsi-divergence-bull`, `atr-ratio`, `volume-confirms`)
- **Scalar** — the magnitude (e.g., 0.73, 1.42, -0.3)
- **Timestamp** — when (used for ordering, not encoding)

The atom provides the *meaning* (via its vector). The scalar provides the *intensity*. Together, they produce a single thought vector that captures "RSI divergence is happening, and it's moderately strong."

## Encoding Pipeline

1. The [[Thought Encoder]] receives a candle and a set of form definitions
2. Each form computes a scalar from the candle data (e.g., `body_ratio`, `di_spread`, `atr_ratio`)
3. The scalar gets encoded via the [[Scalar Accumulator]] into a vector
4. That vector gets [[Bind and Bundle|bound]] to the atom's vector
5. The result: one fact per form, one thought per fact

Multiple facts from the same candle get bundled together into a single market thought. That thought is what the [[Market Observers]] actually predict on.

## Why Facts Beat Raw Data

The system could encode raw candle data — open, high, low, close, volume — directly. It doesn't, because raw data has no *interpretation*. The number 42.5 means nothing without context. But `atr-ratio = 1.8` means "volatility is elevated." The atom provides the semantic frame. The scalar provides the magnitude within that frame.

This is the core finding: **named relationships carry predictive signal; raw pixel grids do not.** A 48-candle visual raster achieves ~50.5% accuracy. Named facts achieve 57-62%. The same data. The difference is the naming.

## Related Concepts

- [[Atom]] — the name component of a fact
- [[Bind and Bundle]] — how facts compose
- [[Thought Encoder]] — produces facts from raw data
- [[Market Observers]] — consume facts to predict direction
- [[Exit Observers]] — consume facts to predict distances
- [[Conviction]] — bundle strength of all facts in a thought
