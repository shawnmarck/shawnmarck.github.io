# Thought-Space

*Thought-Space is the ~1000-dimensional vector space where all thoughts live — geometry IS semantics, and similarity IS meaning.*

Every [[Atom]], [[Fact]], and composite thought is a vector in Thought-Space. This isn't a metaphor. There is a real vector space, with real dimensions, and the angles between vectors have real semantic meaning. Two thoughts with high cosine similarity are "about the same thing." Two thoughts with low similarity are unrelated. This is the foundation that everything else is built on.

=== The Holographic Principle ===

In Thought-Space, information is distributed holographically across all dimensions. No single dimension encodes a single concept. Instead, every dimension contributes a little bit to the representation of every thought. This has three important consequences:

1. **Robustness to noise.** Randomly perturbing a few dimensions doesn't destroy the thought — the information is spread across all ~1000 of them. The system degrades gracefully.
2. **Capacity.** You can pack an enormous number of distinct vectors into 1000 dimensions because each vector only needs a "direction" (the unit hypersphere in 1000D has astronomically many distinguishable directions). [[Atom]]s are approximately orthogonal by simple statistical guarantees.
3. **Composition preserves structure.** When you [[Bind]] or [[Bundle]] thoughts, the resulting vector lives in the same space with the same properties. You can compose indefinitely — the algebra doesn't break.

This is the Vector Symbolic Architecture (VSA) approach, specifically based on Holographic Reduced Representations (HRR). It's fundamentally different from the embedding spaces used by transformers. In a transformer, embeddings are learned from data. In Thought-Space, the geometry is defined by the algebra: random atoms, multiplicative binding, additive bundling.

=== Similarity as Semantics ===

The core operating principle: `cosine(thought_a, thought_b)` measures how semantically related two thoughts are. This isn't learned — it's a consequence of the algebraic structure.

- `cosine(atom("momentum"), atom("momentum")) = 1.0` — identical
- `cosine(atom("momentum"), atom("volume")) ≈ 0.0` — orthogonal (unrelated)
- `cosine(fact("momentum-rising", 72, t), fact("momentum-rising", 71, t)) ≈ 0.95` — very similar (same concept, slightly different magnitude)
- `cosine(discriminant, grace_thought) > 0` — the discriminant points toward successful predictions

The [[Reckoner]] exploits this directly. It computes a direction (the [[Discriminant]]) that points toward Grace and away from Violence. New thoughts are projected onto this direction via cosine similarity, producing [[Conviction]]. The entire learning mechanism is just geometry: find the direction of success, measure how close you are to it.

=== Why This Beats Visual Encoding ===

The core finding of holon-lab-trading: **named relational facts carry predictive signal; raw pixel grids (visual encoding) do not.**

You could represent market data as a grid of numbers (OHLCV across time windows) and flatten it into a vector. This is the "visual encoding" approach — treat candles like pixels, like a CNN treats images. It doesn't work for this system.

Why? Because the grid representation has no *compositional structure*. You can't ask "what regime was this candle in?" by unbinding a component. You can't isolate "momentum contribution" from a composite. The grid is a flat array of numbers — the relationships between cells are implicit, not algebraic.

Thought-Space is different. The relationships are *explicit and manipulable*. You bind atoms to create relations. You bundle facts to create collections. You unbind to decompose. The algebra gives you operations that the grid doesn't. And the Reckoner needs those operations to separate Grace from Violence in a structured, interpretable way.

=== The Space is the Stage ===

Everything happens in Thought-Space:

- [[Atom]]s are points (random directions)
- [[Fact]]s are bound compositions of points
- [[Discriminant]]s are learned directions
- [[Conviction]] is the projection of a thought onto a discriminant
- [[Grace and Violence]] accumulate as cloud centroids
- The [[Reckoner]] draws a line between them

The space doesn't change. The vectors in it change. The vocabulary defines the starting points. The learning moves the discriminant. The curve measures how well the geometry maps to reality.

## Related Concepts

[[Thought Primitives]] · [[Atom]] · [[Bind and Bundle]] · [[Fact]] · [[Thought Encoder]] · [[Reckoner]] · [[Discriminant]] · [[Conviction]] · [[Grace and Violence]]
