# Atom

> **TL;DR:** An Atom names a concept. It's the irreducible unit of meaning in the Thought System — a deterministic mapping from a string name to a unique 10,000-dimensional vector. The name IS the vector. Same name, same vector, always.

## The Atomic Unit

`(atom "rsi-divergence")` → a specific point in 10,000-dimensional space.

That's it. That's the whole primitive. You give it a name, it gives you back the geometric object that *is* that concept. Not a pointer to it. Not an embedding learned from context. Not a random initialization. A deterministic, reproducible, quasi-orthogonal vector that represents that concept.

The Atom is provided by the [[thought-encoding|VectorManager]], which lives inside the [[thought-encoding|ThoughtEncoder]]. At startup, the VectorManager allocates vectors for every atom in the [[vocabulary]]. Finite. Known. Pre-computed. Never evicted. The atom dictionary is closed — every atom that exists is known before the first candle arrives.

## Why Quasi-Orthogonal?

In 10,000 dimensions, randomly generated unit vectors have an expected cosine similarity near zero. This isn't an approximation — it's a geometric fact. Two random directions in high-dimensional space are nearly perpendicular.

This means every atom occupies its own direction, largely independent from every other atom. `"rsi"` and `"macd"` point in different directions. `"close-sma20"` and `"close-sma50"` point in different directions. When you [[bind]] atoms together, the resulting composition points in a direction related to both parents but distinct from either. The algebraic structure emerges from the geometry.

## The Identity Function

The identifier of the thing IS the thing itself. `VectorManager::get_vector("rsi-divergence")` returns the unique vector that *is* RSI divergence in this thought space. There's no indirection, no lookup table, no embedding layer. The name maps to the vector. The vector maps back to the name (through the dictionary). The identity function is the encoding itself.

This is homoiconicity — the same principle McCarthy built into Lisp. In Lisp, the symbol `+` is both a name and a function. In the Thought System, the atom `"rsi-divergence"` is both a name and a 10,000-dimensional direction. The representation and the thing represented are the same object.

## Atoms from Different Thinkers

The vocabulary draws from multiple schools of technical analysis, each contributing atoms that express their particular way of thinking about markets:

**Wyckoff** — structural atoms: accumulation, distribution, spring, upthrust, markdown, markup. These name *phases* of market activity. A Wyckoff practitioner sees the market as a story with chapters.

**Dow Theory** — trend atoms: higher-highs, lower-lows, trend-confirmation, divergence-of-averages. These name *relationships* between consecutive data points. A Dow practitioner sees the market as a series of assertions.

**Seykota** — risk atoms: drawdown, position-sizing, cutting-losses, letting-profits-run. These name the *trader's relationship* to the market. Seykota's insight: the most important thoughts are about yourself.

**Van Tharp** — psychology atoms: expectancy, win-rate, reward-risk, position-sizing-models. These name the *system designer's* concerns. Van Tharp taught that the system matters more than the entry.

**Pring** — momentum atoms: momentum, rate-of-change, overbought, oversold, divergence. These name the *physics* of price movement — speed, acceleration, deceleration.

Each thinker contributes atoms that express their expertise. The atoms don't argue. They compose. A single Thought can simultaneously express a Wyckoff spring pattern, a Pring momentum divergence, and a Seykota drawdown awareness — all superposed in one vector. The discriminant learns which compositions predict.

## Naming Convention

Atoms are short, hyphenated strings. No spaces. No special characters. Examples from the current vocabulary:

```
rsi, macd, adx, atr-ratio, obv-slope, vwap-distance
close-sma20, close-sma50, close-sma200
bb-pos, bb-width, kelt-pos, squeeze
cloud-position, tk-cross-delta, tenkan-dist
stoch-k, stoch-kd-spread, stoch-cross-delta
hurst, choppiness, dfa-alpha, entropy-rate
rsi-divergence-bull, rsi-divergence-bear
range-pos-12, fib-dist-618, fib-dist-382
tf-1h-trend, tf-4h-ret, tf-agreement
session-depth, dist-from-high, dist-from-sma200
```

Each atom maps to exactly one vector. The name is unique. The vector is unique. The mapping is deterministic.

## The Vocabulary Is the Model

The set of atoms — the vocabulary — is not a feature list. It IS the model. Different [[lens|lenses]] select subsets. The momentum lens uses oscillator and momentum atoms. The regime lens uses persistence and regime atoms. Each subset creates a different "mind."

84 atoms achieved 57% accuracy over six years of BTC data. 107 atoms crossed 62%. The system's intelligence lives in the vocabulary, not in the architecture. Add better thoughts — atoms that name more predictive concepts — and the accuracy improves. The discriminant and the curve do the rest.

## Atoms Are Not Parameters

Atoms are not learned parameters. They are not embeddings. They are not weights in a neural network. They are *names* — fixed points in the geometry that human experts chose to represent their domain knowledge. The learning happens in the [[reckoner]], which discovers which atoms (and which compositions of atoms) predict outcomes. The atoms are the questions. The reckoner finds the answers.

This is why adding atoms is cheap and powerful. You don't need to retrain anything. You just name a new concept, allocate its vector, and let the reckoner discover whether it carries signal. If it does, the discriminant absorbs it. If it doesn't, the discriminant filters it out (proven: the discriminant is robust to noisy atoms).

## Related Concepts

- [[thought-system]] — the six-primitive algebra
- [[bind]] — how atoms compose into complex thoughts
- [[fact]] — an atom bound to real data
- [[vocabulary]] — the complete set of atoms
- [[thought-space]] — the geometry atoms live in
- [[thought-encoding|VectorManager]] — deterministic atom allocation
- [[thought-encoding]] — the cache and renderer
