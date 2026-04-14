# Bind and Bundle

> *Bind composes meaning. Bundle aggregates evidence. One builds structure, the other builds consensus.*

These are the two composition primitives in holon-rs, and understanding the difference between them is understanding the difference between syntax and statistics.

## Bind — Composing Meaning

**Bind** takes two thoughts and produces a new thought that represents their *relationship*. In vector terms: `bind(a, b) = a ⊗ b` (element-wise multiplication, or the binding operation from HRR/VSA theory).

The key property: binding is **reversible**. Given `bind(a, b)` and `a`, you can recover `b` (approximately). This means you can *unbundle* a composed thought to inspect its parts.

Use bind when you want to express **"X in the context of Y"** — e.g., `bind(volume-ratio, btc-usd)` produces a vector that means "the volume ratio specifically for BTC/USD." The relationship is structural, not additive.

## Bundle — Aggregating Evidence

**Bundle** takes N thoughts and produces a new thought that represents their *consensus*. In vector terms: `bundle(a, b, c, ...) = a + b + c + ...` (vector addition, then normalize).

The key property: bundling is **not reversible**. Once you add vectors together, you can't recover the originals. Information is lost — but *directionality* is preserved. If most of the bundled vectors point in the same direction, the sum points strongly that way too.

Use bundle when you want to express **"X, Y, and Z all agree"** — e.g., `bundle(momentum-thought, structure-thought, volume-thought)` produces a vector that captures the combined evidence. If all three indicate "Up," the bundle points strongly toward Up. If they disagree, the bundle is weak — low [[Conviction]].

## When to Use Each

| Situation | Primitive | Why |
|-----------|-----------|-----|
| "This atom with that value" | Bind | Structural relationship |
| "All these facts together" | Bundle | Aggregation |
| "Market thought in this observer's context" | Bind | Scoped composition |
| "Multiple indicators voting" | Bundle | Consensus |
| "The thought about this specific candle" | Bind | Temporal context |

## The Algebra Enables Inference

Because bind and bundle have well-defined algebraic properties, you can do something remarkable: **compose thoughts at encoding time that you never explicitly wrote down.** If atom A is close to atom B in thought-space, then `bind(A, value)` will produce a vector close to `bind(B, value)`. Similar concepts behave similarly. This is *generalization without training* — it falls out of the geometry.

This is why the [[Thought Encoder]] can handle novel combinations it's never seen before. The algebra does the generalization.

## Related Concepts

- [[Thought Primitives]] — the full set of six
- [[Atom]] — the leaf nodes that bind and bundle compose
- [[Fact]] — atoms bound with scalar values
- [[Thought Space]] — the geometry that makes composition meaningful
- [[Thought Encoder]] — the engine that turns AST into vectors
- [[Conviction]] — bundle strength maps to prediction confidence
