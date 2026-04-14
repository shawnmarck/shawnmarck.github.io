# Fact

> **TL;DR:** A Fact is a named observation about the world — a [[thought-system|Thought]] bound to real market data. "RSI is at 0.73." That sentence, encoded as a vector, IS the fact. The vocabulary produces facts as [[thought-encoding|ThoughtAST]] nodes. The [[thought-encoding|ThoughtEncoder]] evaluates them into vectors. Many facts get bundled into one thought.

## What a Fact Is

A Fact is the most common output of [[bind]]. It's a single observation about the current market state, expressed as a compositional vector:

```scheme
;; "RSI is at 0.73"
(bind (atom "rsi") (encode-linear 0.73 1.0))

;; "Close is 2.3% above the 20-period SMA"
(bind (atom "close-sma20") (encode-linear 0.023 0.1))

;; "ATR is 1.8x its average" (log-compressed)
(bind (atom "atr-ratio") (encode-log 1.8))

;; "It's 14:00 on the clock" (circular — wraps at 24)
(bind (atom "hour") (encode-circular 14.0 24.0))
```

Each of these is one vector. Each carries categorical identity (this is about RSI, not MACD) and continuous magnitude (0.73, not 0.45). Each is a fact.

## The Composition IS the Vector

A fact doesn't need a separate name beyond its vector composition. The composition IS the vector. The vector IS the fact. There's no metadata layer, no tag, no type annotation. The meaning lives in the geometry.

"RSI is at 0.73" isn't stored as `{indicator: "rsi", value: 0.73}`. It's stored as a 10,000-dimensional vector that *is* that observation. Any system that wants to know "what does this fact mean?" projects the vector against relevant atoms and recovers the information. The vector IS the sentence. The geometry IS the grammar.

## How Facts Flow Through the Pipeline

Facts are produced by the vocabulary, evaluated by the encoder, bundled by the observer, and consumed by the reckoner:

```
1. Candle arrives (OHLCV + 100+ indicators)

2. Vocabulary modules produce ThoughtASTs
   → Each module emits facts about its domain
   → oscillators.wat emits RSI, CCI, MFI facts
   → momentum.wat emits SMA distance, MACD facts
   → regime.wat emits Hurst, choppiness facts

3. Lens filters which modules fire
   → Momentum lens: oscillators + momentum + stochastic + time + standard
   → Regime lens: regime + persistence + time + standard
   → Generalist: all modules

4. Observer bundles the selected facts into one ThoughtAST
   → (Bundle fact_A fact_B ... fact_N)

5. ThoughtEncoder evaluates the AST → one vector
   → This is the observer's Thought for this candle

6. Reckoner evaluates the thought → prediction
   → Cosine against discriminant → conviction
```

Every fact passes through this pipeline. The pipeline is the same for all facts — the vocabulary decides which ones to produce, the lens decides which ones to include, the encoder decides how to compute them, the reckoner decides which ones predict.

## Three Encoding Schemes

Facts use scalar encodings that match the nature of the observation:

### encode-linear — Bounded scalars
Values that live in a natural range. The bounds are in the math.
- RSI: [0, 1] — Wilder's formula defines the range
- Bollinger position: [-1, 1] — where on the band
- Stochastic %K: [0, 1] — where in the recent range
- SMA distance: signed percentage, scale 0.1

### encode-log — Unbounded positive scalars
Values that can grow without limit. Log compresses naturally — the difference between 1x and 2x matters more than 4x and 5x.
- ATR ratio: volatility relative to price
- Volume ratio: volume relative to its moving average
- Band breakout distance: how far past the boundary

### encode-circular — Periodic scalars
Values that wrap around. Hour 23 and hour 0 are adjacent.
- Minute: mod 60
- Hour: mod 24
- Day-of-week: mod 7
- Month-of-year: mod 12

The vocabulary chooses the right scheme for each fact. Not magic — logic. Bounded things get linear. Unbounded positive things get log. Wrapping things get circular.

## No Zones. Only Scalars.

"Overbought" is a human label on a continuous value — a magic number wearing a name. Who decided 70 was the boundary? The vocabulary doesn't emit "RSI is overbought." It emits "RSI is at 0.73." The discriminant learns where the boundaries are.

Maybe RSI 65 predicts reversals for BTC. Maybe RSI 80 for SPY. Maybe the boundary shifts with regime. The system doesn't hardcode the answer. It emits the scalar and lets the discriminant discover the truth from data.

Every zone is a premature measurement. Every boolean (overbought/oversold, above/below, trending/ranging) destroys the continuous signal and replaces it with a threshold that some human guessed. The scalar preserves the signal. The discriminant learns the threshold.

## Facts Are Conditional

The vocabulary emits what IS true. If close is within the Bollinger bands, it emits the band position as a linear scalar. If close is beyond the bands, it emits the breakout distance as a log scalar. Not both. Each fact describes the actual state, not a hypothetical one.

This conditional emission means the thought adapts to the market regime naturally. When the market is in a squeeze, the bundle contains squeeze-related facts. When it's breaking out, it contains breakout-related facts. The vocabulary speaks only truth.

## Composed Facts

Facts can be composed — nested binds create complex observations:

```scheme
;; A simple fact: one atom, one value
(Linear "rsi" 0.73 1.0)

;; A structural fact: RSI diverging from price
(Bind (Atom "divergence")
  (Bind (Linear "close-delta" 0.03 0.1)
        (Linear "rsi-delta" -0.05 1.0)))

;; A confluence fact: multi-timeframe agreement
(Bind (Atom "alignment")
  (Bundle
    (Linear "tf-1h-trend" 0.7 1.0)
    (Linear "tf-4h-trend" 0.6 1.0)
    (Linear "tf-agreement" 0.9 1.0)))
```

Composed facts encode relationships between observations. The discriminant can learn that a simple fact ("RSI is 0.73") has different predictive value than a composed fact ("price is rising but RSI is falling"). Both are vectors. Both go into the bundle. The discriminant weighs them.

## Named Relational Facts Carry Signal

The foundational empirical result: raw pixel encodings of price charts achieve ~50.5% accuracy. Named relational facts about those same charts achieve 57–62%. The difference is the naming.

A pixel says "this cell is green." A fact says "RSI is diverging from price while volume declines." The pixel has no relational structure — it's a local measurement. The fact has compositional structure — it connects multiple observations into a meaningful statement. The discriminant exploits that structure.

You cannot build prediction from perception. You build it from cognition. Facts are cognition. Pixels are perception. The Thought System operates entirely in the cognitive domain.

## Related Concepts

- [[atom]] — the names that facts use
- [[bind]] — the operation that creates facts
- [[bundle]] — collects facts into thoughts
- [[thought-encoding]] — evaluates facts into vectors
- [[vocabulary]] — defines which facts to emit
- [[lens]] — filters which facts to include
- [[thought-space]] — the geometry facts live in
- [[reckoner]] — learns from facts
- [[grace-and-violence]] — the outcomes facts predict
