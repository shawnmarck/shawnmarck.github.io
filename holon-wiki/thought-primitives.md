# Thought Primitives

*Six compositional operations that build every thought in the system — the algebra of meaning.*

Everything in holon-lab-trading is a Thought — a high-dimensional vector. But you don't build these vectors by hand. You compose them from six primitives, the way you build sentences from nouns and verbs. These primitives are the vocabulary of the system, and the key insight is that **the vocabulary IS the model**. There's no separate neural network learning weights in the background. The meaning lives entirely in how you name things, compose them, and learn from what happens.

Let me walk through each one and then show you how they snap together.

=== The Six Primitives ===

| Primitive | What it does | Analogy |
|-----------|-------------|---------|
| **Atom** | Names a concept, maps it to a random unit vector | A word in a dictionary |
| **Bind** | Composes two thoughts into one (multiplication) | Putting words into a sentence |
| **Bundle** | Superposes N thoughts into one (addition) | A sentence meaning multiple things at once |
| **Fact** | A named observation: atom + scalar + timestamp | A data point with provenance |
| **Lens** | Filters the vocabulary to an observer's concern | A camera lens — what you choose to see |
| **Curve** | Self-evaluates accuracy against conviction | A governor on confidence |

The first four ([[Atom]], [[Bind and Bundle]], [[Fact]]) are the *building blocks*. The last two ([[Lens]], [[Curve]]) are the *meta-operations* — they shape what you pay attention to and how you judge yourself.

=== The Algebra ===

The algebra is a Vector Symbolic Architecture (VSA), specifically derived from HRR (Holographic Reduced Representation). The key properties:

- **Atoms** are random unit vectors in ~1000-dimensional space. They're approximately orthogonal — `cosine(atom_a, atom_b) ≈ 0` for different atoms.
- **Bind** (`a ⊗ b`) is element-wise multiplication. It produces a vector dissimilar to both inputs. This is how you encode *relationships*. Crucially, bind is approximately reversible: `a ⊗ b ⊗ a ≈ b` (unbinding).
- **Bundle** (`a ⊕ b ⊕ c`) is element-wise addition followed by normalization. It produces a vector *similar* to all inputs. This is how you encode *collections*.
- **Facts** bind an atom (the name) with an encoded scalar value and a temporal position: `fact = atom ⊗ encode(value) ⊗ encode(time)`.

The power comes from composition. A thought like "high momentum in tech stocks during a bull regime" isn't a single vector — it's a tree of binds and bundles that the [[Thought Encoder]] collapses into one high-dimensional vector.

=== Why This Matters ===

The core finding of holon-lab-trading is stark: **named relational facts carry predictive signal; raw pixel grids do not**. You could try to feed OHLCV candlestick images into a CNN. It won't learn to trade. But if you name what you see — "momentum rising", "volume climax on breakout", "regime shift to risk-on" — and encode those *names* as thoughts, the system can learn.

The vocabulary is the model. Choose your atoms well and the geometry does the work.

=== Composition in Practice ===

Here's how a market observer builds a thought:

1. Define atoms for the concepts it cares about (via its [[Lens]])
2. Observe market data and encode observations as [[Fact]]s
3. Bundle related facts together into a composite thought
4. Bind with contextual atoms (regime, sector, timeframe)
5. The resulting vector gets compared against a [[Discriminant]] by the [[Reckoner]]
6. [[Conviction]] gates the trading decision

This is the [[Four-Step Loop]]: observe → compose → predict → account.

## Related Concepts

[[Atom]] · [[Bind and Bundle]] · [[Fact]] · [[Lens]] · [[Curve]] · [[Thought Encoder]] · [[Thought-Space]] · [[Reckoner]] · [[Discriminant]] · [[Conviction]] · [[Vocabulary]] · [[Market Observer]] · [[Four-Step Loop]]
