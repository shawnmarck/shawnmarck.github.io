# The Thought System

> **TL;DR:** Everything in holon-lab-trading is a Thought — a high-dimensional vector. Six algebraic primitives (Atom, Bind, Bundle, Fact, Lens, Curve) let you name concepts, compose them vertically, superpose them horizontally, bind them to data, filter by vocabulary, and self-evaluate. That's the whole machine.

## The Core Insight

The Thought System answers one question: **what if observation, decision, and learning were all the same mathematical object?**

In most systems, market data is a dataframe, predictions are probabilities, and learning is gradient descent. Three representations, three systems, three conversion layers. Holon collapses all three into one: the Thought. A Thought is a vector — a point in 10,000-dimensional space. Market data gets encoded as Thoughts. Predictions are projections of Thoughts. Even the accuracy of past predictions is itself a Thought (a [[curve]]). One type. One algebra. One geometry.

The key empirical finding: **named relational facts carry predictive signal where raw data does not.** A pixel-perfect rendering of a price chart as a raster grid achieves ~50.5% accuracy — noise. The same data encoded as named relationships ("RSI is diverging from price," "volume is contradicting the rally") achieves 57–62%. The information is not in the chart. It is in the *interpretation* of the chart. The Thought System is that interpretation, expressed as vector algebra.

## The Six Primitives

The Thought System has six primitives — the minimal algebra for compositional cognition:

| Primitive | Operation | Analogy |
|-----------|-----------|---------|
| [[atom]] | Name a concept | A word in a vocabulary |
| [[bind]] | Compose vertically | Function application |
| [[bundle]] | Superpose horizontally | `cons` / list |
| [[fact]] | Bind a name to data | A sentence |
| [[lens]] | Filter vocabulary subset | A perspective |
| [[curve]] | Self-evaluate accuracy | A type system |

Everything else is programs written in these six primitives. RSI divergence is a program. Wyckoff spring is a program. Risk awareness is a program. They all use the same atoms, the same bind, the same bundle. The [[reckoner]] learns which compositions predict. The curve judges the results.

## How They Compose

The composition forms a pipeline from market data to prediction:

```
Market data (OHLCV + 100 indicators)
    ↓
Vocabulary produces ThoughtASTs (data, not vectors)
    ↓
[[thought-encoding]] walks the AST → vectors
    ↓
[[fact]]s: individual observations as vectors
    ↓
[[bundle]]: many facts superposed into one Thought
    ↓
Cosine against learned discriminant → Conviction
    ↓
[[curve]] maps conviction to expected accuracy
```

Each step is one of the six primitives. No step requires a different representation. The candle goes in as floats. The prediction comes out as floats. Everything in between is vectors.

## Bind vs Bundle: The Two Axes of Composition

[[bind]] is **vertical** composition — it stacks thoughts sequentially. `(bind atom scalar)` says "this concept has this value." `(bind A B)` says "A in the context of B." Binding builds structure: atoms stack into facts, facts stack into complex relationships.

[[bundle]] is **horizontal** composition — it superposes thoughts in parallel. `(bundle fact_A fact_B fact_C)` holds all three simultaneously. None dominates. Each is recoverable by cosine projection. Bundling builds breadth: many facts about the current candle, held at once.

Together, bind and bundle give you the full expressive power of functional programming over cognition. Bind is `apply`. Bundle is `cons`. Cosine against a discriminant is `eval`. The curve is the type system.

## The Vocabulary Is the Model

The vocabulary — the set of named atoms and the facts they compose — is not a dictionary. It is the model. Different [[lens|lenses]] select different subsets of the vocabulary, creating different "minds" that think different thoughts about the same market data.

The generalist lens thinks everything at once. The momentum lens thinks only about oscillators and trend. The regime lens thinks only about what kind of market this is. Each produces a different thought vector, a different discriminant, a different conviction-accuracy curve. The curves compete. The best mind gets more capital.

This is why the system needs more thoughts, not better architecture. 84 atoms achieved 57%. 107 atoms achieved 62%. The hyperspace has room for thousands. The bottleneck is vocabulary, not dimensionality.

## Why This Works: The Geometry of Meaning

In high-dimensional spaces (10,000 dimensions), randomly chosen vectors are nearly orthogonal. This means each [[atom]] occupies its own direction — quasi-independent from every other atom. When you [[bind]] two atoms, you create a new direction that's related to both parents but distinct from either. When you [[bundle]] many facts, the resulting superposition points in a direction that encodes *all* of them simultaneously.

The [[reckoner]] learns a discriminant — the direction in thought-space that separates [[grace-and-violence]] (correct predictions from incorrect ones). Cosine against this discriminant produces conviction: how aligned is this thought with the direction that predicts well?

The exponential relationship between conviction and accuracy emerges naturally: the probability of many independent facts coincidentally aligning in the same direction decreases exponentially. High conviction means many facts voting coherently. That coherence carries signal.

## The Lisp Connection

The Thought System is homoiconic — the representation IS the thing. An [[atom]] named `"rsi-divergence"` isn't a label on a random vector. It *is* a deterministic geometric object in 10,000-dimensional space. The name is the vector. The vector is the computation. Code is data. Data is code.

McCarthy built Lisp in 1958 but didn't have 10,000 dimensions to think in. Kanerva, Plate, and Smolensky mapped the algebra of high-dimensional thought decades before hardware could run it. The Thought System is that algebra, applied to trading, running on a laptop.

## Related Concepts

- [[atom]] — the irreducible unit of meaning
- [[bind]] — vertical composition of thoughts
- [[bundle]] — horizontal superposition of thoughts
- [[fact]] — a named observation about the world
- [[lens]] — vocabulary subset selector
- [[curve]] — self-evaluating accuracy
- [[thought-encoding]] — how ASTs become vectors
- [[thought-space]] — the geometry where thoughts live
- [[reckoner]] — the learning primitive that builds discriminants
- [[vocabulary]] — the complete set of named concepts
- [[conviction]] — cosine similarity against the discriminant
