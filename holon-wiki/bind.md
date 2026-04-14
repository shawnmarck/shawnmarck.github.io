# Bind

> **TL;DR:** Bind is vertical composition — it stacks two thoughts into one. `(bind A B)` creates a new vector that means "A in the context of B." It's function application in vector space. The most common use: binding a named [[atom]] to a scalar value to create a [[fact]].

## The Operation

```scheme
(bind left right) → Vector
```

Bind takes two thought-vectors and produces one thought-vector. The result is a new direction in [[thought-space]] that encodes the *relationship* between the two inputs. Not a concatenation. Not an average. A genuine compositional operation that creates a new geometric object.

The most common pattern:

```scheme
(bind (atom "rsi") (encode-linear 0.73 1.0))
;; → "RSI is at 0.73" — one vector, one fact
```

The atom provides categorical identity (this is about RSI, not MACD). The scalar provides magnitude (0.73, not 0.45). The bind fuses them into a single direction that the discriminant can evaluate.

## Vertical Composition

Think of bind as stacking. Each bind adds a layer:

```scheme
;; Layer 1: a value
(encode-linear 0.73 1.0)
;; → a vector representing "0.73 on a linear scale"

;; Layer 2: name the value
(bind (atom "rsi") (encode-linear 0.73 1.0))
;; → "RSI is at 0.73"

;; Layer 3: name the relationship
(bind (atom "diverging")
      (bind (atom "close-up")
            (bind (atom "rsi-down") (encode-linear -0.05 1.0))))
;; → "Price is rising but RSI is falling — divergence"
```

Each layer wraps the previous one. The deepest layer is the raw data. The outermost layer is the highest-level concept. The whole stack is one vector. The structure is encoded in the geometry.

## The Signed Scalar

Bind doesn't use booleans. It doesn't say "RSI is overbought" (a category). It says "RSI is at 0.73" (a scalar). The sign carries direction. The magnitude carries conviction.

```scheme
;; 2.3% above SMA20
(bind (atom "close-sma20") (encode-linear 0.023 0.1))

;; 4.1% below SMA20
(bind (atom "close-sma20") (encode-linear -0.041 0.1))
```

Same atom. Same encoding. Different scalar. The discriminant learns that 0.1% above is noise and 5% above is signal. The word "above" doesn't exist in the vector space. The number 0.023 does. The number -0.041 does. Every boolean is a premature measurement — a lie one level up. Emit the scalar. Let the discriminant learn.

## Bind Creates Linear Relations

When you bind an atom to a scalar, nearby scalars produce nearby vectors. `encode_linear(0.72)` is geometrically similar to `encode_linear(0.73)`. This isn't a post-hoc similarity — it's embedded in the encoding itself. The linear trait is in the vector.

This is what makes the discriminant work. The discriminant finds the direction that separates Grace from Violence. That direction has a gradient along scalar dimensions — the discriminant can exploit the continuous structure that bind + encode creates. "RSI at 0.73 predicts differently from RSI at 0.72" — the discriminant discovers this, not because someone coded it, but because the geometry makes it discoverable.

## Relationship to Bundle

[[bind]] and [[bundle]] are the two axes of composition:

- **Bind** is sequential/vertical — A then B. It builds depth. A bound thought has internal structure: layers of meaning stacked on top of each other.
- **Bundle** is parallel/horizontal — A and B and C. It builds breadth. A bundled thought has breadth: many independent facts held simultaneously.

The Lisp analog: bind is `apply` (or function composition). Bundle is `cons` (or list construction). Both are necessary. Neither is sufficient alone.

A single fact is a bind. A thought (what an observer thinks about a candle) is a bundle of facts. The bundle contains many binds. Each bind is a named observation. Together, they form the complete cognitive state of the observer for that candle.

## Compositional Depth

Bind supports arbitrary depth:

```scheme
;; Shallow: one concept, one value
(bind (atom "rsi") (encode-linear 0.73 1.0))

;; Medium: a relationship between two measurements
(bind (atom "macd-hist-change")
      (bind (Linear "now" -0.001 0.01)
            (Linear "3-ago" 0.002 0.01)))

;; Deep: a confluence of multiple observations
(bind (atom "exhaustion")
      (bundle
        (bind (atom "rsi") (encode-linear 0.82 1.0))
        (bind (atom "stoch-k") (encode-linear 0.91 1.0))
        (bind (atom "volume-ratio") (encode-log 0.4))))
```

Deep compositions encode complex market readings as single vectors. The discriminant doesn't care about the depth — it projects the final vector onto its learned direction and produces a conviction. Whether the thought was shallow or deep, the evaluation is one cosine.

## Bind Is Not IF-THEN

There are no control flow branches in bind. No IF-THEN rules. No decision trees. Bind is pure algebra — it composes vectors. The vocabulary may *choose* which facts to emit based on conditions (e.g., emit bb-breakout only when price exceeds the band), but the composition itself has no branching. The tree is always evaluated. The geometry always produces a vector.

This is a feature, not a limitation. The discriminant learns what predicts. If a condition matters, the vocabulary emits it as a fact, and the discriminant weights it. If it doesn't matter, the discriminant ignores it. No human needs to specify the rule. The geometry discovers it.

## Related Concepts

- [[atom]] — the irreducible inputs to bind
- [[bundle]] — horizontal composition (the other axis)
- [[fact]] — the most common output of bind
- [[thought-system]] — the full algebra
- [[thought-encoding]] — how bind is evaluated in the AST
- [[thought-space]] — where bound vectors live
- [[vocabulary]] — defines which atoms exist to bind
