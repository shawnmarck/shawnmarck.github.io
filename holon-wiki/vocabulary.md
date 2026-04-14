# Vocabulary

> **TL;DR:** The set of named atoms and compositional rules the system thinks with. 107 atoms → 62% accuracy. The vocabulary IS the model. More thoughts = steeper conviction curve.

## The Core Insight

> Different vocabularies produce different thoughts. Different thoughts produce different discriminants. Different discriminants produce different conviction-accuracy curves. The curves compete.

The vocabulary is not a parameter to tune. It is the system's **cognitive architecture**. A trader who uses Ichimoku thinks in clouds and tenkan-sen. A Wyckoff trader thinks in accumulation phases and springs. These aren't different algorithms — they're different thought programs.

## Growth

| Atoms | Accuracy | Status |
|-------|----------|--------|
| 84 | 57–59.7% | First validation |
| 107 | 62.1% | Expanded vocabulary |
| 500+ | ? | The hyperspace has room for thousands |

84 atoms became 107 by adding: Ichimoku, Stochastic, Fibonacci, Keltner channels, CCI, volume analysis, price action patterns. Every school of technical trading, encoded as named facts.

The trajectory matters more than the headline: at 90,000 candles, 84 atoms was declining (58.4% and falling) while 107 atoms was rising (62.3% and climbing). The new thoughts provided signal in the exact regime where the old vocabulary ran dry.

## Vocabulary Structure

Three domains, each with modules selected by [[Lenses]]:

### Shared (Time)
- Circular scalars: minute, hour, day-of-week, day-of-month, month-of-year
- Encoded with `encode-circular` to preserve periodicity

### Market (Direction)
- **Momentum**: RSI, MACD, DI spread, rate of change
- **Structure**: Keltner squeeze, Bollinger position, ATR ratio, price action patterns
- **Volume**: buying pressure, OBV slope, MFI, volume acceleration
- **Regime**: Hurst exponent, choppiness, variance ratio, fractal dimension, autocorrelation
- **Narrative**: PELT changepoints, divergence (bull/bear), Ichimoku cloud position
- **Generalist**: all of the above

### Exit (Conditions)
- **Volatility**: ATR ratio, KAMA efficiency ratio
- **Structure**: price action body ratio, range ratio
- **Timing**: stochastic K/D spread, Stochastic cross delta
- **Generalist**: all exit modules

## Atom Examples

Each atom is a named vector — a quasi-orthogonal direction in 10,000-dimensional space:

```
adx, aroon-down, aroon-up, atr-ratio, bb-width, body-ratio-pa,
buying-pressure, choppiness, cci, consecutive-down, consecutive-up,
divergence-bear, divergence-bull, entropy-rate, fractal-dim, gap,
hurst, ichimoku-cloud-pos, macd-hist, macd-signal, mfi,
obv-slope, roc-1, roc-12, roc-3, roc-6, rsi, rsi-divergence-bear,
rsi-divergence-bull, stoch-cross-delta, stoch-k, squeeze, tf-agreement,
tk-cross-delta, trend-consistency-12, trend-consistency-24,
trend-consistency-6, volatility-ratio, volume-accel, ...
```

## Compositional Rules

Vocabulary modules produce **ThoughtASTs** — abstract syntax trees describing compositions, not yet evaluated. The [[ThoughtEncoder]] turns these into vectors:

```
atom("rsi") + encode_linear(rsi_value, scale) → "RSI is at 73"
bind(atom("diverging"), bind(atom("close-up"), atom("rsi-down"))) → "bearish divergence"
bundle(thought_A, thought_B, thought_C) → superposition of all three
```

## The Vocabulary IS the Model

The system doesn't have weights. Doesn't have attention heads. Doesn't have a training loop. The discriminant is learned from the stream, yes — but what it learns from is determined entirely by the vocabulary.

Change the vocabulary → change the thoughts → change the discriminant → change the curve. The vocabulary is the lever that controls everything.

The [[Conviction-Accuracy Curve]] evaluates any vocabulary on any data stream. Steeper = better thoughts. Flatter = noise. You don't need a human to evaluate whether "RSI divergence" is a good concept. The curve says so.

## Future: Risk Vocabulary

The current system thinks about the market but not about itself. Risk is not a parameter — it's a **thought** to encode:

- `(at portfolio high-drawdown)` — contextual awareness
- `(at session thin-liquidity)` — market structure awareness
- `(at streak winning-3)` — self-assessment

Risk thoughts don't just gate trades — they **modify the meaning of other thoughts** through superposition. "RSI divergence + high drawdown" is a different thought than "RSI divergence" alone.

## Related Concepts

- [[Thought Primitives]] — atom, bind, bundle: the operations that compose vocabulary
- [[Thought Space]] — the 10,000-dimensional space vocabulary items inhabit
- [[Lenses]] — which vocabulary subset an observer selects
- [[Discriminant]] — what emerges from vocabulary + experience
- [[Conviction-Accuracy Curve]] — how vocabulary quality is measured
- [[The GPU Thought Engine]] — massive parallel vocabulary search
- [[Seeds and Emergence]] — how named vocabularies produce unnamed experts
