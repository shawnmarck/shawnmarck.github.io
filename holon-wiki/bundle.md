# Bundle

> **TL;DR:** Bundle is horizontal superposition — it holds many thoughts simultaneously in one vector. `(bundle A B C)` contains all three thoughts, each recoverable by cosine projection. It's how an observer's complete cognitive state about a candle gets packed into a single vector that the [[reckoner]] can evaluate.

## The Operation

```scheme
(bundle &vecs) → Vector
```

Bundle takes any number of thought-vectors and superposes them into one. The result is a single vector in [[thought-space]] that encodes *all* of its inputs simultaneously. None dominates. Each is recoverable by projection.

This is the parallel composition operator. Where [[bind]] stacks vertically (A in the context of B), Bundle spreads horizontally (A and B and C, all at once).

## The Thought Vector

A "thought" in holon-lab-trading is a bundle of [[fact|facts]]. Many fact-vectors superposed into one vector. The thought is what an observer *perceived* about this candle:

```scheme
(bundle
  ;; Oscillator facts (momentum lens)
  (bind (atom "rsi") (encode-linear 0.73 1.0))
  (bind (atom "macd-hist") (encode-linear -0.0005 0.01))
  (bind (atom "stoch-k") (encode-linear 0.82 1.0))

  ;; Momentum facts
  (bind (atom "close-sma20") (encode-linear 0.023 0.1))
  (bind (atom "di-spread") (encode-linear 0.15 1.0))
  (bind (atom "atr-ratio") (encode-log 1.8))

  ;; Standard context (always included)
  (bind (atom "hour") (encode-circular 14.0 24.0))
  (bind (atom "dist-from-high") (encode-linear -0.02 0.1)))
```

Eight facts. One vector. The observer's complete reading of this candle, packed into a single geometric object. The [[reckoner]] evaluates it with one cosine.

## How Superposition Works

In high-dimensional space, bundling is not averaging. When you bundle quasi-orthogonal vectors (which is what [[atom|atoms]] and their compositions are), the resulting vector preserves components from each input. The geometry makes this work:

- Each input vector occupies roughly its own direction (quasi-orthogonality in 10,000 dimensions).
- The bundle sums them. Because they point in different directions, they don't cancel.
- Cosine projection against any individual input recovers the contribution of that input.

This is the same principle behind Holographic Reduced Representations (Plate, 1994) and Vector Symbolic Architectures (Kanerva, 2009). Information is distributed across the entire vector, but individual components remain recoverable.

## Always Fresh

Bundles are always fresh — they're never cached. A bundle represents the current state of the world, and the world changes every candle. The [[thought-encoding|ThoughtEncoder]] caches atoms and compositions, but a Bundle node in the [[thought-encoding|ThoughtAST]] always triggers a fresh computation.

This makes sense: the bundle depends on the *values* of its children, and those values change every candle (RSI was 0.73 yesterday, 0.68 today). The structure of the bundle is fixed (same atoms, same composition tree), but the scalars flow through it fresh each time.

## IncrementalBundle

For contexts where you need to build a bundle incrementally — adding one thought at a time without recomputing the full superposition — the system supports an incremental variant:

```
IncrementalBundle: start with zeros, add thoughts one by one
```

This is useful when facts arrive asynchronously or when you want to build a partial thought and extend it later. The geometric result is identical to a full bundle — superposition is commutative and associative. Order doesn't matter.

The incremental variant matters for the [[encoding-cache]] and for contexts where different vocabulary modules contribute facts at different stages of the pipeline.

## Relationship to Bind

[[bind]] and Bundle are the two composition axes:

| | Bind | Bundle |
|---|---|---|
| Direction | Vertical (sequential) | Horizontal (parallel) |
| Analogy | `apply`, function composition | `cons`, list construction |
| Meaning | A in the context of B | A and B and C simultaneously |
| Structure | Depth (nested layers) | Breadth (many facts at once) |
| Lisp | `(f x)` | `(list x y z)` |

Neither is sufficient alone. Bind without bundle gives you isolated facts with no context. Bundle without bind gives you raw observations with no structure. Together, they give you the full expressive power of compositional thought.

A thought is a bundle of binds. Each bind is a named fact. The bundle is the observer's complete state.

## The Wisdom of Crowds in Vector Algebra

When many facts vote coherently — all pointing in similar directions — the bundle's cosine against the discriminant is high. This is [[conviction]]: many facts agreeing.

When facts disagree — some pointing toward Grace, others toward Violence — the bundle's cosine is low. Ambiguity. The discriminant can't find a clear signal.

This is the "wisdom of crowds" effect, but in geometry. Each fact is a voter. The bundle is the ballot box. The discriminant is the tally. High conviction doesn't mean the facts are large — it means they're *aligned*. Many small facts pointing in the same direction produce high conviction. One large fact pointing against many small ones produces low conviction.

The exponential relationship between conviction and accuracy emerges because the probability of many independent facts coincidentally aligning decreases exponentially. Coherence carries signal.

## Bundle and Expert Selection

Different [[lens|lenses]] produce different bundles from the same candle. The momentum lens bundles oscillator and trend facts. The regime lens bundles Hurst, choppiness, and entropy facts. The generalist bundles everything.

Each bundle is a different "mind" thinking different thoughts. Each produces a different conviction against its own discriminant. Each has its own conviction-accuracy curve. The curves compete. The steepest curve wins — its mind is the most accurate for the current market.

The generalist isn't privileged. It's just another lens. If the momentum expert's curve is steeper than the generalist's in the current regime, the momentum expert gets more capital. The vocabulary is the hypothesis. The curve is the experiment. The market is the judge.

## Related Concepts

- [[bind]] — vertical composition (the other axis)
- [[atom]] — the inputs that get bundled
- [[fact]] — the individual observations in a bundle
- [[thought-system]] — the full algebra
- [[thought-encoding]] — how bundles are evaluated
- [[lens]] — determines which facts go into the bundle
- [[conviction]] — how aligned the bundle is with the discriminant
- [[reckoner]] — learns the discriminant that evaluates bundles
