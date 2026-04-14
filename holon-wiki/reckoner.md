# Reckoner

**TL;DR:** The reckoner is the only learning primitive in the system. "Reckon" means both "to count" and "to judge." It accumulates experience, builds a discriminant direction in cosine space, and delivers a verdict by measuring new inputs against that discriminant. One mechanism, two readout modes: discrete (classification) and continuous (regression).

---

## The Core Idea

Most machine learning systems have many moving parts — loss functions, optimizers, learning rates, backpropagation. The reckoner has one: accumulate experience, extract the direction that separates outcomes, and measure new inputs against it.

The reckoner answers: "given what I've seen, what do I think about this?" It doesn't predict the future. It classifies the present against accumulated past. The cosine similarity between a new thought and the learned discriminant IS the prediction.

## Two Modes, One Mechanism

### Discrete Mode (Classification)

Used by market observers (Up/Down) and brokers (Grace/Violence).

```
reckoner config: (Discrete ("Up" "Down"))
observe: (reckoner, thought, "Up", weight)     — store with label
predict: (reckoner, thought) → Prediction::Discrete { scores: [("Up", cos), ("Down", cos)], conviction }
```

The discriminant is the direction in thought-space that best separates "Up" outcomes from "Down" outcomes (or "Grace" from "Violence"). Cosine against this direction gives conviction — how strongly the current thought resembles past winners vs past losers.

The consumer picks. The reckoner returns scores for all labels. It doesn't say "the answer is Up." It says "Up scored 0.73, Down scored -0.41." The broker picks the winner. The reckoner is an honest witness.

### Continuous Mode (Regression)

Used by exit observers (distance prediction).

```
reckoner config: (Continuous 0.015)     — 0.015 is the crutch default value
observe: (reckoner, thought, 0.023, weight)   — store with scalar distance
predict: (reckoner, thought) → Prediction::Continuous { value: 0.021, experience: 1.5 }
```

Instead of separating into labels, the continuous reckoner accumulates (thought, scalar) pairs and returns a cosine-weighted average of the stored values. Thoughts similar to past observations that had high distances get high distance predictions. Thoughts similar to past observations that had low distances get low distance predictions.

The returned `experience` value tells the consumer how much the reckoner knows. 0.0 = ignorant. The consumer can gate on this — don't trust a prediction from an ignorant reckoner.

## The BucketedReckoner

Internally, the reckoner stores discriminant directions in cosine-space buckets. Rather than keeping every observation (which would be unbounded), it buckets observations by their angular position relative to the current discriminant. This provides:

- **Bounded memory.** The number of buckets is fixed. Old observations merge with newer ones in the same bucket.
- **Resolution where it matters.** More buckets in regions of thought-space where many observations cluster. Fewer where the space is sparse.
- **Fast query.** To predict for a new thought, find the nearest bucket and return the accumulated discriminant from that region.

The bucketing is the mechanism that makes the reckoner practical. Without it, you'd need to store and compare against every observation ever made. With it, you store a fixed-size summary that captures the essential structure.

## Discriminant Directions

The discriminant is the heart of the reckoner. It's a vector — a direction in the same 10,000-dimensional space as the thoughts. "Which direction best separates Grace from Violence?" The discriminant IS that direction.

Building the discriminant is recalibration. Every N observations (the `recalib-interval`, default 500), the reckoner recomputes its discriminant from accumulated data. The old discriminant is replaced. If the new one is worse (measured by accuracy on a held-out window), the engram gate prevents the replacement.

The discriminant is accessible via `discriminant(reckoner, label) → Vector | None`. It returns the direction that best separates one label from all others. `None` when there isn't enough experience to form a meaningful direction.

## The Curve: Self-Evaluation

The reckoner carries its own internal curve — a surface mapping conviction levels to historical accuracy rates. Every time a prediction resolves (correct or incorrect), `resolve(reckoner, conviction, correct?)` feeds the curve. Later, `edge-at(reckoner, conviction) → f64` reads it: "when I predicted at this conviction level, how often was I right?"

The curve answers "how much edge?" — a continuous measure. 52.1% is barely there. 70% is screaming. 50% is noise. The treasury funds proportionally. The entity earns a degree of trust, not a binary gate.

`proven?(reckoner, min-samples) → bool` tells you whether the curve has enough data to be meaningful. Before that threshold, `edge-at` returns 0.0 — no credibility.

## Experience and Ignorance

`experience(reckoner) → f64` reports how much the reckoner has learned. 0.0 = empty. Grows with each observation. The reckoner's self-knowledge of its own depth.

Ignorance is the starting state. Every reckoner begins with zero experience. No edge. No participation. There is no bootstrap — no pre-trained weights, no historical warmup. The architecture IS the bootstrap. Papers fill the reckoner. Experience grows. The curve steepens. The treasury starts listening.

The continuous reckoner returns a default value (the crutch) when ignorant. For exit distances, the crutch might be 1.5% for trail and 3.0% for stop — reasonable defaults that the market will replace with learned values.

## Decay

`decay(reckoner, factor)` fades old experience. The market changes. What was true six months ago may not be true today. Decay ensures the discriminant stays current. The decay factor controls how aggressively old observations fade — high decay forgets quickly, low decay remembers longer.

This is not a hyperparameter to tune — it's a coordinate for the system to learn. The market tells us what decay rate produces Grace. The reckoner can observe whether predictions made with old experience were correct or not, and adjust accordingly.

## Why One Primitive?

The reckoner does classification AND regression AND carries its own accuracy curve AND supports engram gating AND decays AND recalibrates. One primitive. Many behaviors.

This is intentional. The holon-rs substrate provides exactly five primitives: atom, bind, bundle, cosine, reckoner. The entire system — market prediction, exit distance estimation, accountability measurement, proof tracking — is built from these five operations. The reckoner's generality is what makes the architecture possible.

The reckoner is the neuron. Five primitives are the synapse. The enterprise is the brain. The curve is consciousness (it judges itself). One primitive, many minds.

## Related Concepts

- [[conviction]] — cosine similarity against the discriminant
- [[conviction|Conviction-Accuracy Curve]] — the reckoner's self-evaluation surface
- [[market-observer]] — uses discrete mode for Up/Down prediction
- [[exit-observer]] — uses continuous mode for distance prediction
- [[broker]] — uses discrete mode for Grace/Violence prediction
- [[thought-encoding|Engram Gate]] — prevents discriminant drift after recalibration
- [[grace-and-violence]] — the labels the reckoner learns to separate
- [[thought-system]] — the algebra the reckoner operates within
