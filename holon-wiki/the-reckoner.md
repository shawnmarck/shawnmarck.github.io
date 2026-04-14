# The Reckoner

> **TL;DR:** The sole learning primitive in holon-rs. "Reckon" means both "to count" and "to judge." It accumulates experience, builds a discriminant, delivers verdicts, and carries its own proof curve. One primitive, two readout modes.

## What It Does

A reckoner keeps accounts and delivers a verdict. It:

1. **Accumulates** observations (thoughts paired with outcomes)
2. **Builds** a discriminant — the direction in thought-space that separates outcomes
3. **Predicts** — cosine a new thought against the discriminant to get conviction
4. **Self-evaluates** — the internal curve tracks how conviction maps to accuracy
5. **Decays** — old experience fades (configurable decay factor)
6. **Recalibrates** — periodically recomputes the discriminant from accumulated state

## Two Readout Modes

### Discrete (Classification)

```scheme
(make-reckoner "direction" dims recalib-interval (Discrete ("Up" "Down")))
```

Used by [[Market Observers]] (predict direction: Up/Down) and [[Brokers]] (predict accountability: Grace/Violence). Returns scores per label plus a conviction scalar.

### Continuous (Regression)

```scheme
(make-reckoner "trail" dims recalib-interval (Continuous 0.015))
```

Used by [[Exit Observers]] (predict distances: trail/stop). Returns a scalar value plus an experience count. The default value (0.015 = 1.5% of price) is the **crutch** — returned when the reckoner is ignorant. As observations accumulate, the crutch is replaced by what the market said.

## The Interface

```scheme
(observe reckoner thought observation weight)  ; feed experience
(predict reckoner thought)                       ; get verdict
(decay reckoner factor)                          ; fade old experience
(experience reckoner) → f64                      ; how much learned? 0.0 = ignorant
(recalib-count reckoner) → usize                 ; observations between recalibrations
(resolve reckoner conviction correct?)           ; feed the internal curve
(edge-at reckoner conviction) → f64              ; how accurate at this conviction?
(proven? reckoner min-samples) → bool            ; enough data to trust?
(discriminant reckoner label) → Vector | None    ; the learned direction
```

## The Internal Curve

Every reckoner carries its own [[Conviction-Accuracy Curve]] — a continuous surface mapping prediction strength to accuracy. After many predictions resolve, the curve answers: "when you predicted strongly, how often were you right?"

The curve communicates via **one scalar**. The producer calls `edge-at(conviction)` and attaches the result to its message. The consumer encodes it as a scalar fact. No meta-journal. No curve snapshot. No new primitives. One f64.

## Ignorance

Every reckoner begins with zero experience. No edge. The reckoner does not participate when it knows it doesn't know. There is no special bootstrap logic — **the architecture IS the bootstrap**. [[Paper Trades]] fill the reckoner, experience grows, the treasury starts listening.

Start ignorant. Learn. Graduate.

## Recalibration

The reckoner periodically recomputes its discriminant from accumulated observations. The interval is configurable. Between recalibrations, the discriminant stays fixed — predictions are deterministic within a calibration window.

[[Engram Gating]] protects against bad recalibrations: after a recalibration with good accuracy, the discriminant is snapshot as a "good state." Future recalibrations are checked against this memory.

## Future Readout Modes

The reckoner mechanism is general. Possible future modes:
- **Circular** — for periodic values that wrap (hours, days of week)
- **Ranked** — for orderings

The architecture doesn't constrain what can be reckoned. Any measurable outcome that can be associated with a thought can be learned by a reckoner.

## Philosophical Weight

"Reckon" carries dual meaning — to count and to judge. The reckoner both counts (accumulates evidence) and judges (delivers a verdict). It is the marriage of measurement and evaluation in one primitive.

The curve is the reckoner's conscience. It doesn't just predict — it knows how well it predicts. The reckoner is the only entity that can say "I don't know yet" (experience = 0) and mean it.

## Related Concepts

- [[Thought Primitives]] — the five holon-rs operations (reckoner is the fifth)
- [[Conviction-Accuracy Curve]] — the reckoner's self-evaluation surface
- [[Discriminant]] — what the reckoner builds from experience
- [[Engram Gating]] — protecting reckoner state across recalibrations
- [[Market Observers]] — use discrete reckoners for direction prediction
- [[Exit Observers]] — use continuous reckoners for distance prediction
- [[Brokers]] — use discrete reckoners for Grace/Violence prediction
