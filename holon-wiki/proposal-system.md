# Proposal System

> **TL;DR:** The mechanism for evolving the system. Every architectural change is written as a proposal, reviewed by the [[panel-of-experts]], and resolved with a clear decision. Over 50 proposals have been processed, covering everything from vocabulary expansion to pipe topology to naming conventions. The system evolves through structured debate, not ad-hoc changes.

---

## What a Proposal Is

A proposal is a document that describes a change to the enterprise. It states what changes, why, what doesn't change, and what the alternatives are. Every proposal goes through the same review process:

1. **Written** — the designer identifies a problem or opportunity, analyzes it, and writes the proposal
2. **Reviewed** — each member of the Panel of Experts reviews independently
3. **Resolved** — a resolution document synthesizes the reviews and states the decision

No change to the guide, the wat, or the architecture happens without a proposal. This is not bureaucracy — it is how the system maintains coherence across hundreds of design decisions.

## Proposal Structure

Every proposal follows a consistent structure:

```
# Proposal NNN — Title

**Scope:** userland | kernel | vocabulary
**Depends on:** (prior proposals, if any)

## The Problem / Opportunity
## The Proposed Change
## What Changes
## What Doesn't Change
## Alternatives Considered
## Designer Review (if applicable)
## Resolution
```

The "What Doesn't Change" section is critical. It explicitly states what remains stable, preventing scope creep and ensuring the reviewer understands the bounded nature of the change. Large proposals (like 044-048, the pivot biography series) are broken into smaller, focused proposals that each make one clear change.

## The Review Process

Each proposal is reviewed independently by the five experts on the [[panel-of-experts]]:

| Expert | Domain | Focus |
|--------|--------|-------|
| Rich Hickey | Software design | Simplicity, composability, state management |
| Brian Beckman | Formal methods | Correctness, math rigor, categorical reasoning |
| Wyckoff | Market structure | Price action, accumulation, distribution |
| Ed Seykota | Risk management | Position sizing, psychology, drawdown |
| Van Tharp | Trading psychology | Expectancy, R-multiples, self-awareness |

Each expert reviews the proposal from their perspective and issues one of three verdicts:

- **APPROVED** — the change is sound, proceed
- **CONDITIONAL** — the change is sound but requires a specific condition to be met
- **REJECTED** — the change is flawed, here's why

### Conditions and Tension

The most interesting proposals are the ones where experts disagree. Proposal 050 (renaming "exit observer" to "position observer") is a canonical example:

- **Seykota:** REJECTED. Proposed "distance observer" instead — names what the reckoners predict today.
- **Hickey:** CONDITIONAL. Also proposed "distance observer." Argued that "names for future things are lies told early."
- **Beckman:** CONDITIONAL. Accepted "position observer" as forward declaration — must ship with the phase labeler (Proposal 049).

The resolution: "Position observer," shipped in the same commit as the phase labeler. Beckman's condition was met. The name and the capability arrived together. No window where the name lied.

This is the proposal system working as designed. Three reviewers, three different perspectives, one coherent resolution.

## The Resolution

After all reviews are in, a resolution document is written. It states:

1. **The decision** — what was approved, which option was chosen
2. **Why** — which expert arguments carried the day
3. **What changes** — concrete next steps
4. **What doesn't change** — stability guarantees

Unanimous proposals produce clean resolutions. Contested proposals produce richer ones — the resolution document explains the trade-offs and why the chosen path won over the alternatives.

Resolution 046 (Pivot Pipes) is a model of the form: "Five designers. Five reviews. Zero disagreement." Option A (enrich the chain on the main thread) was chosen unanimously because each expert found a different reason to prefer it:

- Hickey: "A richer value is still a value."
- Beckman: "The naturality square commutes."
- Seykota: "Zero new channels, zero new threads."
- Van Tharp: "20 records is enough for a coarse gate."
- Wyckoff: "The tape reader hands the trader a reading, not the full tape."

Five perspectives. One decision. Each expert validated it from a different angle.

## Proposal Domains

The 50+ proposals fall into several domains:

**Architecture** (002-007): The fundamental structure — posts, observers, brokers, treasury, the four-step loop. These established the pattern that all later proposals build on.

**Learning** (008-018, 020-025): How the reckoners learn, what labels they use, how propagation works, how the learning loop closes. The continuous reckoner, the reward cascade, dual observation.

**Pipelines and Pipes** (009-010): The value flow — chain types, typed thought pipeline, how data moves through the system without shared mutation.

**Vocabulary** (026-027, 040-042): The atoms — exit vocabulary, market vocabulary, the vocabulary challenge, the lens system. How new thoughts are added.

**Trade Mechanics** (030-039, 043): Papers, broker readiness, position sizing, broker survival, exit diversity. How hypothetical trades work.

**Pivot Biography** (044-050): A five-proposal series adding pivot tracking, phase labeling, and position lifecycle management. Each proposal depended on the prior one. The series demonstrates how the proposal system handles complex, multi-step architectural changes.

**Naming and Clarity** (050): The position observer rename. Proof that the proposal system cares about names as much as about logic.

## Why This Works

The proposal system prevents three failure modes:

1. **Drift without notice** — every change is explicit, documented, and reviewed. Nothing slips in.
2. **Conflicting decisions** — the resolution synthesizes expert opinions. When experts disagree, the resolution explains the trade-off.
3. **Lost context** — proposals are append-only. Every design decision has a paper trail. Future designers can read why something was done, not just what was done.

The [[disposable-machine]] regenerates the wat from the guide. The proposal system is how the guide evolves. Together, they ensure the system changes intentionally, coherently, and with full traceability.

## Related Concepts

- [[panel-of-experts]] — the five reviewers who evaluate every proposal
- [[wards]] — verify that proposals are faithfully implemented in the wat
- [[disposable-machine]] — the regeneration cycle that proposals drive
- [[vocabulary]] — many proposals add or reorganize atoms
- [[vocabulary-evolution]] — how the atom set grows through proposals
- [[wat-vm|Values Up]] — the principle that proposals must respect
