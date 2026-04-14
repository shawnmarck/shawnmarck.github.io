# Lens

> **TL;DR:** A Lens selects which subset of the [[vocabulary]] an observer uses. Each lens creates a different "mind" — a different perspective on the same market data. The six market lenses (momentum, structure, volume, narrative, regime, generalist) are competing experts that think different thoughts and are judged by their own conviction-accuracy curves.

## The Lens Is the Observer's Identity

An observer doesn't choose which facts to think about. Its lens chooses for it. The lens is fixed at construction — a momentum observer always thinks about momentum. A regime observer always thinks about regime. The lens IS the observer's identity.

This isn't a limitation. It's the point. By restricting each observer to a vocabulary subset, you create specialized experts. Each expert develops its own discriminant, its own conviction-accuracy curve. The curves compete. The best expert for the current market gets more capital.

## The Six Market Lenses

```scheme
(enum MarketLens
  :momentum     ; oscillators, trend strength, stochastic
  :structure    ; channels, Fibonacci, Ichimoku, price action
  :volume       ; flow, pressure, on-balance volume
  :narrative    ; multi-timeframe structure, divergence
  :regime       ; persistence, chop, entropy, Hurst
  :generalist)  ; ALL of the above
```

### Momentum

Thinks about speed and acceleration. Which way is price moving, and how fast?

Modules: `oscillators.wat` (RSI, CCI, MFI, Williams %R, ROC), `momentum.wat` (SMA distances, MACD, DI spread, ATR ratio), `stochastic.wat` (%K, %D, spreads, crosses).

Plus `shared/time.wat` and `standard.wat` (always included).

A momentum observer sees: "RSI is at 0.73, MACD histogram is shrinking, stochastic just crossed, ADX is declining." It thinks about *exhaustion* — when speed decelerates, reversals become more likely.

### Structure

Thinks about levels and boundaries. Where is price relative to support, resistance, and channel walls?

Modules: `keltner.wat` (channel position, squeeze), `fibonacci.wat` (retracement levels), `ichimoku.wat` (cloud position, TK cross), `price-action.wat` (range ratio, gaps, consecutive closes).

A structure observer sees: "Price is 2.3% above the Keltner lower channel, near the 0.618 Fibonacci retracement, below the Ichimoku cloud." It thinks about *boundaries* — when price approaches walls, bounces become more likely.

### Volume

Thinks about participation and pressure. Who is trading, and how hard?

Modules: `flow.wat` (OBV slope, VWAP distance, buying/selling pressure, volume ratio, body ratio).

A volume observer sees: "OBV slope is rising, buying pressure exceeds selling pressure, volume is 1.8x its average." It thinks about *conviction* — volume confirms or denies the price move.

### Narrative

Thinks about the story across timeframes. What's the bigger picture?

Modules: `timeframe.wat` (1h/4h trend, return, inter-timeframe agreement), `divergence.wat` (RSI divergence — bull and bear).

A narrative observer sees: "The 1h trend is up but the 4h structure is weakening, timeframe agreement is only 0.3, and there's bearish RSI divergence." It thinks about *inconsistency* — when the story across timeframes contradicts itself, reversals become more likely.

### Regime

Thinks about what KIND of market this is. Trending? Mean-reverting? Choppy? Random?

Modules: `regime.wat` (KAMA efficiency ratio, choppiness, DFA alpha, variance ratio, entropy rate, Aroon, fractal dimension), `persistence.wat` (Hurst exponent, autocorrelation, ADX).

A regime observer sees: "Hurst is 0.35 (mean-reverting), choppiness is 72 (choppy), entropy is high, fractal dimension is 1.8 (noisy)." It thinks about *context* — the same RSI reading means different things in trending vs. choppy markets.

### Generalist

Thinks everything. All modules fire. The full vocabulary.

The generalist is not privileged. It's just another lens. If a specialized expert's curve is steeper, the specialist wins. The generalist is the null hypothesis: "maybe thinking about everything is better than thinking about something specific." Sometimes it is. Often it isn't.

## Exit Lenses

Exit observers have their own lenses for judging *conditions* (not direction):

```scheme
(enum ExitLens
  :volatility   ; ATR regime, squeeze state
  :structure    ; trend consistency, ADX strength
  :timing       ; momentum, reversal signals
  :generalist)  ; all three
```

Exit observers don't predict direction. They predict *distances* — how far to set the trailing stop, how far to set the safety stop. Their lenses select which conditions matter for stop placement.

## How Lens Selection Works

Every lens variant automatically includes `shared/time.wat` and `standard.wat`. Beyond that, the observer calls the vocabulary modules mapped to its lens, collects all resulting [[thought-encoding|ThoughtAST]] nodes, and bundles them into one [[thought-encoding|ThoughtAST]] for encoding.

```
Momentum observer on candle N:
  1. oscillators.wat(candle) → [Linear "rsi" 0.73, Linear "cci" -0.2, ...]
  2. momentum.wat(candle)    → [Linear "close-sma20" 0.023, ...]
  3. stochastic.wat(candle)  → [Linear "stoch-k" 0.82, ...]
  4. time.wat(candle)        → [Circular "hour" 14.0, ...]
  5. standard.wat(window)    → [Linear "session-depth" 0.5, ...]
  6. Bundle(all above)       → one ThoughtAST
  7. ThoughtEncoder.encode() → one Vector (the thought)
```

The vocabulary modules are pure functions — candle in, ASTs out. The lens determines *which* modules get called. The observer does the calling. The encoder does the evaluating.

## Emergent Unnamed Experts

The real experts don't have names. They emerge from observation. When the momentum expert and the regime expert produce similar conviction spikes on the same candles, that's not two experts agreeing. That's one unnamed expert discovered through overlap.

The system runs all lenses simultaneously. The named lenses are hypotheses. The geometry reveals the real structure. You don't name the expert groups — they name themselves through their conviction-accuracy curves.

## Adding a New Lens

Adding a lens is adding a vocabulary module and an enum variant. The system scales: N market lenses × M exit lenses = N×M brokers. Each combination is a team. Each team has its own accountability ([[broker]]). The architecture is agnostic to the number of lenses.

The current six lenses are a starting point. The vocabulary can grow. New modules, new lenses, new experts. The curve judges all of them equally. A new lens with a steeper curve than the incumbents earns more capital automatically.

## Related Concepts

- [[vocabulary]] — the complete set of facts lenses select from
- [[market-observer]] — the entity that uses a market lens
- [[exit-observer]] — the entity that uses an exit lens
- [[broker]] — binds one market observer to one exit observer (N×M grid)
- [[thought-system]] — the algebra lenses operate within
- [[bundle]] — collects the lens's facts into one thought
- [[fact]] — the individual observations lenses include
- [[conviction|Conviction-Accuracy Curve]] — how each lens's accuracy is measured
- [[reckoner]] — builds the discriminant per lens
