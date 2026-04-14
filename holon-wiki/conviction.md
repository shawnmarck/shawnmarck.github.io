# Conviction

**TL;DR:** Conviction is cosine similarity between a thought and the learned discriminant direction. High conviction means the current thought strongly resembles patterns that preceded one outcome over another. It maps to prediction confidence. The system's self-awareness comes from the Conviction-Accuracy Curve — a meta-thought that answers "when I'm this convinced, how often am I right?"

---

## The Definition

In the system, every prediction starts with a thought — a high-dimensional vector encoding what an observer perceived about the market. The [[reckoner]] has accumulated experience from many past thoughts and their outcomes. From that experience, it has built a **discriminant** — a direction in the 10,000-dimensional space that best separates one outcome from another.

Conviction is simply the cosine similarity between the current thought and that discriminant:

```
conviction = cosine(thought, discriminant)
```

Range: [-1.0, +1.0]. High positive conviction = the thought strongly resembles past winners. High negative conviction = it strongly resembles past losers (the flip). Near zero = ambiguous — the thought doesn't clearly belong to either category.

Conviction is not a probability, but it **maps** to one through the Conviction-Accuracy Curve. A conviction of 0.8 doesn't mean "80% chance of being right." It means "this thought is very similar to patterns that have historically preceded success." The curve translates that similarity into a calibrated accuracy estimate.

## Why Cosine?

Cosine similarity measures the angle between two vectors, ignoring their magnitude. This is the right measure because:

1. **Magnitude is noisy.** The length of a thought vector depends on how many facts were bundled, not on how informative those facts are. A bundle of 20 facts will have a different magnitude than a bundle of 8 facts, even if both carry the same directional signal.

2. **Direction is signal.** What matters is *which way* the thought points in the space, not *how far*. Two thoughts pointing in the same direction are making the same judgment, regardless of their magnitude.

3. **Bounded and well-behaved.** Cosine is always [-1, 1]. No normalization needed. No explosion. No vanishing gradients. Just an angle.

The holon-rs primitives `bind`, `bundle`, and `amplify` all preserve or control directionality. The cosine operation is the fundamental measurement. One cosine. One flip. One curve.

## Conviction in the Pipeline

Conviction appears at multiple points in the [[four-step-loop]]:

### Market Observer Conviction
The market observer's reckoner computes conviction against its Up/Down discriminant. High conviction → strong lean toward one direction. The observer returns `(thought, Prediction { scores, conviction }, edge, misses)`. The conviction is the raw measure. The edge (from the curve) is the calibrated measure.

### Broker Conviction
The broker's reckoner computes conviction against its Grace/Violence discriminant. This is the conviction that matters for capital allocation. The broker calls `edge-at(reckoner, conviction)` to get the accuracy at this conviction level, and that edge value goes on the [[proposal-system|Proposal]]. The treasury sorts by edge and funds proportionally.

### Exit Observer Conviction (Continuous)
The exit observer's continuous reckoners use cosine internally to weight stored observations. When predicting a distance for a new thought, the reckoners compute cosine between the query thought and each stored observation. Observations with high cosine similarity (similar context) get more weight. The weighted average IS the predicted distance.

## The Conviction-Accuracy Curve

This is where conviction becomes self-awareness.

The reckoner carries an internal curve — a continuous surface mapping conviction levels to historical accuracy rates. It's built from resolved predictions:

```
resolve(reckoner, conviction, correct?)  — feed the curve
edge-at(reckoner, conviction) → f64      — read the curve
proven?(reckoner, min-samples) → bool     — is the curve reliable?
```

Each time a prediction resolves (the trade settles and the outcome is known), the curve receives a data point: "at conviction X, was the prediction correct?" Over many resolved predictions, the curve learns the relationship between conviction and accuracy.

**The curve IS a thought.** This is the self-referential insight. The Conviction-Accuracy Curve measures the quality of predictions, and predictions are thoughts, and the curve itself can be represented as a scalar fact — `(bind (atom "producer-edge") (encode-linear edge 1.0))`. A downstream reckoner can learn whether that edge predicts Grace. The system thinks about its own thinking.

The communication is one number. The producer calls `edge-at(reckoner, conviction)` and attaches the result to its message. The consumer encodes it as a scalar fact. The consumer's reckoner learns whether the edge predicts Grace. No meta-journal. No curve snapshot. No new primitives. One f64.

## The Curve Judges the System

The curve is what separates a confident fool from a calibrated expert:

- **52% accuracy at high conviction** — the system is barely above noise. It should not deploy capital.
- **60% accuracy at high conviction** — genuine edge. The system has learned something real.
- **70% accuracy at high conviction** — screaming edge. Deploy maximum capital.
- **Below 50% at any conviction** — the system is anti-correlated. **Flip the prediction.** The discriminant has learned the wrong direction, and the curve catches it.

The treasury funds proportionally to the edge value. Edge of 0.0 = no credibility = no capital. Edge of 0.6 = 60% expected accuracy = fund proportionally. The system earns a degree of trust, not a binary gate.

## Amplitude and Exponent

The curve reports two parameters from accumulated data:

- **Amplitude** — how much edge exists at peak conviction. The maximum accuracy the system achieves when it's most confident.
- **Exponent** — how quickly accuracy rises with conviction. A steep exponent means the system is well-calibrated — low conviction is uncertain, high conviction is accurate. A flat exponent means conviction doesn't discriminate well.

These are measurements, not learning. The curve doesn't optimize itself. It reports. The system (via the broker's reckoners and the treasury's funding decisions) responds to what the curve reports.

## The Meta-Thought Loop

The deepest insight about conviction is its self-referential structure:

```
Thought → Conviction → Curve reads accuracy → Edge value
→ Edge encoded as a fact → Bundled into composed thought
→ Downstream reckoner predicts Grace from composed thought (including edge)
→ Trade resolves → Grace or Violence teaches downstream reckoner
```

The system thinks about whether its own confidence is well-calibrated. The edge value — the curve's judgment about the reckoner's judgment — becomes a fact that downstream reckoners can learn from. This is not meta-learning in the gradient-descent sense. It's composition — the same algebra that binds "RSI is at 0.73" also binds "this observer's edge is 0.65." The tools compose.

## Related Concepts

- [[reckoner]] — the primitive that computes conviction and carries the curve
- [[conviction|Conviction-Accuracy Curve]] — the self-evaluation surface on the reckoner
- [[market-observer]] — produces direction predictions with conviction
- [[broker]] — produces Grace/Violence predictions with conviction
- [[thought-space|Discriminant]] — the direction in thought-space that conviction measures against
- [[grace-and-violence]] — the outcomes the curve tracks accuracy against
- [[thought-system]] — the algebra that makes self-referential composition possible
- [[treasury]] — the capital allocator that reads the edge from the curve
