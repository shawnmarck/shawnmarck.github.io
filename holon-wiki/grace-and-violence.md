# Grace and Violence

**TL;DR:** Grace and Violence are the two accountability labels in the system. They are not moral judgments — they are empirical measurements. Grace = the trade produced value. Violence = the trade destroyed value. Every resolved trade receives one of these labels, and the label flows back through [[signal-propagation]] to teach every entity that participated in the decision. More Grace, more capital. More Violence, less.

---

## What They Are

The system makes predictions. Reality answers. The answer comes in exactly two flavors:

- **Grace** — the trade was profitable. The residue (exit value minus principal minus fees) is positive. The system produced value.
- **Violence** — the trade lost money. The exit value didn't cover the principal. The system destroyed value.

That's it. No shades of gray in the label itself (though the **weight** of the observation varies — a large Grace teaches harder than a marginal one). The binary outcome is clean: did this thought, applied to this market context, produce value or not?

The names are deliberate. "Profit" and "loss" are accounting terms. "Win" and "loss" are gambling terms. "Grace" and "Violence" carry the full weight of accountability. The system is not gambling. It is measuring. When it's right, the market showed Grace. When it's wrong, the market showed Violence. The system learns from both.

## Where Grace/Violence Are Measured

Grace and Violence are measured at exactly one place: **the broker**. The broker's discrete reckoner is configured with `("Grace", "Violence")`. When a trade or paper resolves:

1. The treasury determines the outcome from the settlement math (exit value vs principal).
2. The enterprise routes the outcome to the post.
3. The post calls `broker.propagate`.
4. The broker feeds its reckoner: `resolve(reckoner, conviction, correct?)`.
5. The broker's internal curve updates.

The broker is the **accountability unit**. Observers predict. The broker is judged. This is a hard boundary — no other entity in the system owns a Grace/Violence reckoner. The market observer predicts Up/Down. The exit observer predicts distances. The broker predicts whether the whole ensemble will produce value.

## The Grace/Violence Ratio

The broker accumulates `cumulative-grace` and `cumulative-violence`. The ratio of these two numbers IS the answer to "do we trust this team?"

```
Grace ratio = cumulative-grace / (cumulative-grace + cumulative-violence)
```

A ratio above 0.5 means the team is producing more value than it's destroying. The further above, the more trustworthy. The treasury reads this ratio (indirectly, through the broker's edge) to decide capital allocation.

## Labels Carry Weight

Grace and Violence are labels, not booleans. They carry weight — `f64` — how much value was at stake.

A $500 Grace teaches the reckoner harder than a $5 Grace. A $1000 Violence is a louder lesson than a $50 Violence. The weight scales the observation's contribution to learning. It flows through `reckoner.observe`, `broker.propagate`, and `scalar_accumulator.observe`.

This is important because not all trades are equal. A trade that risked $1000 and produced $200 of residue is more informative than a trade that risked $50 and produced $10. Both are Grace. But the first one teaches more.

## Labels Are Not Value Judgments

This bears repeating. Grace is not "good." Violence is not "bad." They are measurements.

A Violence outcome in a choppy, unpredictable market is **informative** — it tells the reckoners that this type of thought pattern, in this type of market, produces losses. That's valuable information. The system learns from it. A string of Violences in a regime where everyone is losing is the discriminant sharpening — learning what NOT to do.

A Grace outcome in a trending market is also informative — it confirms that the thought pattern captures the trend. The reckoner strengthens the discriminant in that direction.

The system does not feel shame about Violence. It does not celebrate Grace. It measures. It learns. It adjusts. The labels are inputs to a learning process, not outputs of a moral one.

## The Two Pairs of Labels

The system uses two pairs of labels for different purposes:

| Pair | Meaning | Used By |
|------|---------|---------|
| Up / Down | Direction | Market observers (direction prediction) |
| Grace / Violence | Accountability | Brokers (value creation/destruction) |

A third pair exists conceptually — Buy / Sell (Side) — but it's **derived** from Up/Down, not observed independently. Up → Buy. Down → Sell. The mapping is clean because the system is pair-agnostic — any asset pair, either direction.

There's a beautiful theorem here: Side × Direction forms a 2×2 grid where Buy+Up = Grace, Buy+Down = Violence, Sell+Down = Grace, Sell+Up = Violence. This is a **theorem** — true when the system is coherent — not a definition. Outcome is measured independently (from the treasury settlement) because incoherence (the system acting against its own prediction) is where the machine learns the most.

## How Outcomes Flow Back

When a trade settles, the label flows through the entire chain:

```
Treasury settles → outcome (Grace or Violence)
  → Enterprise computes direction + optimal distances
  → Post receives settlement + computed facts
  → Post calls broker.propagate
    → Broker learns Grace/Violence (its own reckoner + curve)
    → Broker returns PropagationFacts
  → Post applies PropagationFacts:
    → direction + thought + weight → MarketObserver.resolve (Up/Down)
    → optimal + composed + weight → ExitObserver.observe-distances
    → optimal + outcome + weight → Broker's ScalarAccumulators
```

Every entity that contributed to the trade decision learns from the outcome. The broker learns whether the team produced value. The market observer learns whether its direction prediction was correct. The exit observer learns whether its distances were optimal. [[signal-propagation]] carries the lesson to everyone.

## Violence Is Bounded

The architecture enforces a hard limit on Violence: the maximum loss on any trade is bounded by its reservation. The treasury reserves capital at funding time. If the safety stop fires, the position swaps back. The worst case is losing what was reserved.

This is not a risk parameter — it's the architecture. The treasury cannot over-commit. No trade can push available capital below zero. The bounded loss design means Violence is always finite, always known in advance, always limited to what was deliberately risked.

## Related Concepts

- [[broker]] — the accountability unit that measures Grace/Violence
- [[signal-propagation]] — how Grace/Violence outcomes flow back to observers
- [[reckoner]] — the learning primitive that accumulates Grace/Violence experience
- [[conviction|Conviction-Accuracy Curve]] — how the system measures its own accuracy at different conviction levels
- [[treasury]] — the capital allocator that responds to Grace/Violence ratios
- [[paper-trade]] — hypothetical trades that also produce Grace/Violence outcomes
- [[four-step-loop]] — the pipeline where Grace/Violence are resolved and propagated
