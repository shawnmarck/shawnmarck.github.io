# Thought Encoder

> *Turns the tree of atoms, binds, and bundles into a single high-dimensional vector — the ThoughtAST IS the program, the encoder IS the runtime.*

The Thought Encoder is the engine that converts symbolic thought descriptions into numerical vectors. It takes a ThoughtAST (a tree of [[Atom]], [[Bind and Bundle|bind]], [[Bind and Bundle|bundle]], and [[Fact]] operations) and produces a single vector in [[Thought Space]].

## The Pipeline

```
ThoughtAST → walk_tree() → VectorManager.get(atom) → ScalarEncoder.encode(value)
→ bind(atom_vec, scalar_vec) → bundle(children) → final vector
```

1. **VectorManager** — maps each atom name to a stable random unit vector. Deterministic via seed — same name always gets the same vector.
2. **ScalarEncoder** — maps continuous values (e.g., RSI = 73.2) into vectors. Values near previously-seen Grace outcomes get closer to the Grace centroid.
3. **Bind** — combines atom vector with scalar vector: `bind(atom_v, scalar_v)`
4. **Bundle** — aggregates child vectors: `normalize(sum(children))`
5. **Incremental encoding** — if only one subtree changed, only recompute that subtree. The rest comes from cache.

## The LRU Cache

Encoding is expensive — walking a deep AST with 20+ facts and binding each one is O(facts × dimensions). The cache stores `AST_hash → vector` mappings in an LRU.

The cache lives in its own thread (a [[Programs|program]]). Clients send requests via [[Services|queues]]. On cache miss, the client encodes locally on its own thread, then fire-and-forget installs the result into the shared LRU. The cache thread only manages eviction — it never encodes.

Critical detail: **drain sets before service gets.** When the cache handles a `get`, it checks the drain set first (recently-computed results not yet in the LRU). This ordering is critical for hit rate.

## Stability

The encoder is deterministic. Same input always produces the same output. This is essential for learning — the [[Discriminant]] is a fixed target in thought-space. If encoding were non-deterministic, the discriminant would be useless.

The `.vm()` method name reflects this: the encoder IS a virtual machine for thoughts. It takes a program (the ThoughtAST) and executes it (produces a vector).

## Related Concepts

- [[Thought Primitives]] — the operations the encoder executes
- [[Atom]] — the leaf nodes of the AST
- [[Bind and Bundle]] — composition operations
- [[Fact]] — the typical leaf structure
- [[Thought Space]] — where the output vector lives
- [[Conviction]] — cosine between encoded thought and discriminant
- [[Programs]] — the runtime that hosts the encoder cache program
- [[Services]] — the queue-based messaging the cache uses
