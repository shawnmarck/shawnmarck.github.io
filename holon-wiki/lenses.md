# Lenses

> **TL;DR:** Which vocabulary subset an observer thinks through. A lens IS the observer's identity — it determines what thoughts the observer thinks. Six market lenses, four exit lenses.

## The Concept

A trader who uses Ichimoku thinks in clouds and tenkan-sen. A momentum trader thinks in rate-of-change. A volume trader thinks in participation. These aren't different algorithms — they're different **ways of seeing** the same data.

Lenses encode this: each observer has a lens that selects a subset of the [[Vocabulary]]. The lens determines which vocabulary modules fire for that observer.

## Market Lenses (N = 6)

```scheme
(enum MarketLens :momentum :structure :volume :narrative :regime :generalist)
```

| Lens | Modules | What It Sees |
|------|---------|-------------|
| `:momentum` | momentum.wat | RSI, MACD, DI spread, ROC — rate and direction of change |
| `:structure` | structure.wat | Bollinger, Keltner squeeze, ATR, price action — shape and boundaries |
| `:volume` | flow.wat | MFI, OBV slope, buying pressure, volume accel — participation |
| `:narrative` | ichimoku.wat, divergence.wat | Ichimoku cloud, PELT changepoints — the story the chart tells |
| `:regime` | regime.wat | Hurst, choppiness, fractal dimension, variance ratio — character of the market |
| `:generalist` | ALL market modules | Everything at once — the null hypothesis |

## Exit Lenses (M = 4)

```scheme
(enum ExitLens :volatility :structure :timing :generalist)
```

| Lens | Modules | What It Evaluates |
|------|---------|------------------|
| `:volatility` | volatility.wat | ATR ratio, KAMA ER — how much room? |
| `:structure` | exit-structure.wat | Body ratio, range ratio — what shape? |
| `:timing` | timing.wat | Stochastic K/D, cross delta — where in the cycle? |
| `:generalist` | ALL exit modules | Everything — the baseline |

## The Identity Principle

The lens IS the observer's identity. Change the lens, change the observer. The same candle produces different thoughts through different lenses. Different thoughts build different discriminants. Different discriminants produce different conviction-accuracy curves.

This is why the system runs N×M [[Brokers]]: every combination of market lens and exit lens is a different hypothesis about what produces [[Grace vs Violence|Grace]].

## Lens Fact Extraction

Each lens module produces ThoughtASTs (deferred facts) that are evaluated by the [[ThoughtEncoder]]. The lens determines which modules are called:

```
market_lens_facts(lens, candle) → Vec<ThoughtAST>
position_lens_facts(lens, candle) → Vec<ThoughtAST>
```

For the `:generalist` lens, ALL modules in the domain are called and their outputs bundled together. For specific lenses, only the relevant modules fire.

## Schools of Trading as Lenses

The lens concept directly maps to schools of technical analysis:
- A Wyckoff trader ≈ a structure + narrative lens observer
- An Ichimoku trader ≈ a narrative lens observer
- A momentum trader ≈ a momentum lens observer
- A quant ≈ a regime lens observer

The system doesn't pick a school. It runs all of them simultaneously and lets the [[Conviction-Accuracy Curve]] determine which way of seeing produces the most Grace.

## Future Lenses

The lens enum is extensible. Adding a new variant adds a new observer. The enterprise automatically creates N×M brokers with the new combination. No architectural changes needed — the lens IS the extension point.

## Related Concepts

- [[Market Observers]] — use market lenses
- [[Exit Observers]] — use exit lenses
- [[Brokers]] — identity is {market-lens, exit-lens}
- [[Vocabulary]] — the modules lenses select from
- [[Seeds and Emergence]] — named lenses as seeds for emergent expertise
