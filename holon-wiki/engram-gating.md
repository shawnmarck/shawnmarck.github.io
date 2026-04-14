# Engram Gating

> **TL;DR:** Snapshot good discriminant states. Reject bad recalibrations. After a recalibration with high accuracy, save the discriminant as an "engram" — a memory of a known-good state. Future recalibrations must match.

## What It Is

Engram gating protects reckoners from self-inflicted damage during recalibration. Every N observations (the recalib-interval), the [[The Reckoner|reckoner]] recomputes its [[Discriminant|discriminant]] from accumulated state. Sometimes this recalibration is worse than the previous one — the new discriminant is less accurate.

Engram gating prevents this regression:

1. After a recalibration with good accuracy, snapshot the discriminant as an "engram"
2. An OnlineSubspace learns what good discriminants look like
3. Future recalibrations are checked: does the new discriminant match a known good state?
4. If it doesn't match → reject the recalibration, keep the old discriminant

## Four Fields

The engram gate state has exactly four fields — the same for every entity that uses it:
- The current discriminant
- The engram (snapshot of the last known-good discriminant)
- An OnlineSubspace trained on good discriminants
- A threshold for acceptance

## Who Uses It

Any entity with a reckoner:
- **Market observers** — gate direction predictions
- **Brokers** — gate Grace/Violence predictions

Same mechanism, same four fields, different reckoner, different purpose.

## The Philosophical Weight

"Engram" is a term from neuroscience — a memory trace, a physical change in the brain that represents a learned experience. The engram gate literally creates a memory trace of good cognitive states and uses it to filter future states.

This is the system's equivalent of "sleep on it" — consolidating good learning and protecting it from disruption. The gate says: "you've learned something valuable here. Don't throw it away."

## Related Concepts

- [[The Reckoner]] — what the engram gate protects
- [[Discriminant]] — what gets snapshot and checked
- [[Noise Subspace]] — a related OnlineSubspace mechanism
- [[Market Observers]] — use engram gating on direction reckoners
- [[Brokers]] — use engram gating on Grace/Violence reckoners
