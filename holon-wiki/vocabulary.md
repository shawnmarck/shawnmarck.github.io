# Vocabulary

**TL;DR:** The vocabulary is the complete set of named concepts (atoms) that the system can think about. Currently 107 atoms from five thinkers, organized into three domains (shared, market, exit). The vocabulary IS the model — there is no separate model. Adding atoms means expanding what the system can perceive. The system's accuracy is bounded by its vocabulary.

---

## What the Vocabulary Is

In most ML systems, the model is a neural network with weights. The vocabulary is a list of tokens. They're separate things — the model *uses* the vocabulary.

In holon-lab-trading, the vocabulary IS the model. There are no weights separate from the vocabulary. There is no model that "reads" the atoms. The atoms *are* the dimensions of thought-space. Each atom is a 10,000-dimensional vector allocated deterministically by the `VectorManager`. The discriminant — the learned direction that separates outcomes — is built entirely from compositions of these atom vectors.

The vocabulary is not a dictionary. It's the system's sensory apparatus. It defines what the system can perceive. If there's no atom for "Ichimoku cloud thickness," the system cannot think about Ichimoku cloud thickness. It's blind to it. Adding the atom opens a new dimension of perception.

## The Current Vocabulary: 107 Atoms

The vocabulary grew from 84 to 107 atoms through a structured expansion process. The additional 23 atoms covered Ichimoku, Stochastic, Fibonacci, Keltner channels, CCI, volume analysis, and price action patterns.

The result: 84 atoms achieved 59.7% directional accuracy. 107 atoms achieved 62.1%. More thoughts, better accuracy. Not because every new atom was useful — some added noise that the discriminant filtered out. But enough added signal that the system became more robust across market regimes.

At 90,000 candles, 84 atoms was declining (58.4% and falling). 107 atoms was rising (62.3% and climbing). The new thoughts provided signal exactly where the old vocabulary ran dry — when market structure shifted and the original atoms lost relevance.

### The Three Domains

**Shared/** — Universal context. Any observer can use these.

| Module | Atoms |
|--------|-------|
| `time.wat` | `minute`, `hour`, `day-of-week`, `day-of-month`, `month-of-year` |

Five atoms. Circular scalars — `encode-circular` with appropriate periods. Time affects every market. Every observer has access.

**Market/** — What the market IS DOING. Direction signal. Market observers use these.

| Module | Atoms |
|--------|-------|
| `oscillators.wat` | `rsi`, `cci`, `mfi`, `williams-r`, `roc-1`, `roc-3`, `roc-6`, `roc-12` |
| `flow.wat` | `obv-slope`, `vwap-distance`, `buying-pressure`, `selling-pressure`, `volume-ratio`, `body-ratio` |
| `persistence.wat` | `hurst`, `autocorrelation`, `adx` |
| `regime.wat` | `kama-er`, `choppiness`, `dfa-alpha`, `variance-ratio`, `entropy-rate`, `aroon-up`, `aroon-down`, `fractal-dim` |
| `divergence.wat` | `rsi-divergence-bull`, `rsi-divergence-bear`, `divergence-spread` |
| `ichimoku.wat` | `cloud-position`, `cloud-thickness`, `tk-cross-delta`, `tk-spread`, `tenkan-dist`, `kijun-dist` |
| `stochastic.wat` | `stoch-k`, `stoch-d`, `stoch-kd-spread`, `stoch-cross-delta` |
| `fibonacci.wat` | `range-pos-12`, `range-pos-24`, `range-pos-48`, `fib-dist-236`, `fib-dist-382`, `fib-dist-500`, `fib-dist-618`, `fib-dist-786` |
| `keltner.wat` | `bb-pos`, `bb-width`, `kelt-pos`, `squeeze`, `kelt-upper-dist`, `kelt-lower-dist` |
| `momentum.wat` | `close-sma20`, `close-sma50`, `close-sma200`, `macd-hist`, `di-spread`, `atr-ratio` |
| `price-action.wat` | `range-ratio`, `gap`, `consecutive-up`, `consecutive-down`, `body-ratio-pa`, `upper-wick`, `lower-wick` |
| `timeframe.wat` | `tf-1h-trend`, `tf-1h-ret`, `tf-4h-trend`, `tf-4h-ret`, `tf-agreement`, `tf-5m-1h-align` |
| `standard.wat` | `since-rsi-extreme`, `since-vol-spike`, `since-large-move`, `dist-from-high`, `dist-from-low`, `dist-from-midpoint`, `dist-from-sma200`, `session-depth` |

**Exit/** — Whether CONDITIONS favor trading. Distance signal. Exit observers use these.

| Module | Atoms |
|--------|-------|
| `volatility.wat` | `atr-ratio`, `atr-r`, `atr-roc-6`, `atr-roc-12`, `squeeze`, `bb-width` |
| `structure.wat` | `trend-consistency-6`, `trend-consistency-12`, `trend-consistency-24`, `adx`, `exit-kama-er` |
| `timing.wat` | `rsi`, `stoch-k`, `stoch-kd-spread`, `macd-hist`, `cci` |

## How Atoms Become Facts

An atom alone is just a name — a vector in 10,000 dimensions. It becomes meaningful when bound to a value:

```
(atom "rsi")                              → the concept "RSI"
(bind (atom "rsi") (encode-linear 0.73 1.0))  → "RSI is at 0.73"
```

The encoding scheme carries the semantics:
- **encode-linear** — bounded scalars (RSI ∈ [0,1], BB position ∈ [-1,1])
- **encode-log** — unbounded positive scalars (ATR ratio, volume ratio)
- **encode-circular** — periodic scalars (hour mod 24, day-of-week mod 7)

The sign IS the direction. `(Linear "close-sma20" 0.023 0.1)` means 2.3% above. `(Linear "close-sma20" -0.041 0.1)` means 4.1% below. Same atom. Same encoding. The number carries the meaning. No "above" atom. No "below" atom. No boolean. The discriminant learns what the numbers mean.

**No zones. No categories. Only scalars.** "Overbought" is a human label on a continuous value. The vocabulary emits "RSI is at 0.73." The discriminant learns where the boundaries are. Maybe 65 for BTC. Maybe 80 for SPY. The data decides. Every zone is a premature measurement.

## How Lens Selects Atoms

Each [[lens]] maps to a set of vocabulary modules. A `:momentum` lens fires `oscillators.wat`, `momentum.wat`, `stochastic.wat`, plus `standard.wat` and `shared/time.wat`. A `:generalist` lens fires everything.

The lens IS the observer's identity. It determines which facts the observer thinks about. A momentum observer thinks about oscillators and trend strength. A structure observer thinks about channels, Fibonacci, and cloud geometry. Same market data. Different minds. Different thoughts. Different predictions.

## The Five Thinkers

The 107 atoms come from five schools of technical analysis — five "thinkers" that proposed atoms:

1. **Oscillator thinkers** — RSI, CCI, MFI, Stochastic, Williams %R (momentum measurement)
2. **Structure thinkers** — Keltner, Fibonacci, Ichimoku, price action (geometric patterns)
3. **Flow thinkers** — volume, OBV, VWAP (pressure and participation)
4. **Regime thinkers** — Hurst, choppiness, fractal dimension (market state classification)
5. **Narrative thinkers** — multi-timeframe, divergence (story across scales)

Each thinker contributed atoms through the [[proposal-system]]. Atoms are proposed, reviewed by the Panel of Experts (Hickey, Beckman, Wyckoff, Seykota, Van Tharp), and approved or rejected. Exit vocabulary atoms were added in Proposal 040.

## Vocabulary Evolution

The vocabulary is not fixed. It evolves through structured proposals:

1. A thinker identifies a gap — "the system can't perceive X"
2. A proposal is written — what atoms, what modules, what encoding
3. The Panel of Experts reviews — is this a real signal or noise?
4. If approved, the atoms are added, the modules are written, the lens mappings are updated
5. The system runs, the curve judges — do the new atoms improve accuracy?

Proposal 040 added exit vocabulary. Three designers proposed atoms independently. They converged on five core exit atoms. The builder said "all of them." The vocabulary grew. The system got better.

The curve is the ultimate judge. Add atoms → run → check the curve. If accuracy improves, the atoms carry signal. If it doesn't, they're noise (and the discriminant filters noise gracefully, so there's little downside to trying).

## The Vocabulary IS the Model

This is the deepest insight. There is no model beyond the vocabulary. The atoms define the dimensions of thought-space. The discriminant is a direction in that space. The conviction is a cosine in that space. The curve measures accuracy in that space.

Adding atoms expands the space. Removing atoms contracts it. The system's capacity is bounded by its vocabulary. 107 atoms in 10,000 dimensions. The hyperspace has room for thousands. The question isn't whether to fill it. It's what thoughts to fill it with.

## Related Concepts

- [[atom]] — the named vector that is the atomic unit of meaning
- [[lens]] — the vocabulary filter that selects which atoms an observer uses
- [[thought-system]] — the algebra of atom composition (bind, bundle, cosine)
- [[thought-encoding]] — how atoms become high-dimensional vectors
- [[market-observer]] — uses market-domain atoms through its lens
- [[exit-observer]] — uses exit-domain atoms through its lens
- [[proposal-system]] — how new atoms are proposed and reviewed
- [[vocabulary-evolution]] — the structured process for expanding the vocabulary
- [[thought-space|Discriminant]] — the learned direction in vocabulary-space that separates outcomes
