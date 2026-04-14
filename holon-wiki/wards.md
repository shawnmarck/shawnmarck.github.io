# Wards

> **TL;DR:** Eight defensive spells that verify the wat specification against the guide. Seven check correctness — tangled logic, dead code, divergent intent, bad names, missing types, wasted compute. The eighth checks completeness. The assay caught 1,400 missing lines that no other ward noticed.

---

## What Wards Are

The wards are automated checks that run against the wat specification files. They are the immune system of the [[disposable-machine]] — every time the wat is regenerated from the guide, the wards inspect the output and produce findings. The designer addresses findings, the wat is updated, and the wards run again.

This cycle is the inscription loop. Each pass produces fewer findings. The system converges toward a fixed point where the guide, the wat, and the implementation are in perfect alignment.

The guide IS the DNA. The wards ARE the ribosomes. They translate the DNA into protein and quality-check the result.

## The Seven Correctness Wards

### `/sever` — Cuts Tangled Threads

Braided concerns, misplaced logic. When one function does three things, or when a struct holds fields that belong to two different domains, `/sever` finds it.

The principle it enforces: one concern per module. If a wat file describes both the broker's capital logic AND the broker's trade-state tracking, that's a sever finding. The concerns should live in separate compositions.

### `/reap` — Harvests What No Longer Lives

Dead code, unused fields, stale references. After three inscriptions, accumulated vocabulary changes leave behind atoms that nothing references, structs with fields nothing reads, and functions nothing calls.

`/reap` traces the dependency graph and flags anything unreachable. Between inscription 2 (4,847 lines) and inscription 3 (3,248 lines), the reaper removed hundreds of lines that had become orphaned.

### `/scry` — Divines Truth from Intention

Spec vs implementation divergences. The guide says the broker owns paper trades. Does the wat actually give the broker a paper field? Does the paper struct match the guide's description? `/scry` cross-references the guide declarations against the wat implementations and flags mismatches.

This is the most common source of findings. The guide evolves faster than the wat. A designer adds a concept to the guide, forgets to add it to the wat, and the scry catches the gap.

### `/gaze` — Sees the Form

Names that mumble, comments that lie. "A good name is the cheapest documentation" (Hickey). `/gaze` reads every name in the specification and flags anything that obscures rather than illuminates.

The classic finding: Proposal 050 renamed "exit observer" to "position observer" because the gaze ward identified the original name as a Level 1 lie — it described one-third of the component's job and hid the other two. The name was re-written before the logic.

### `/forge` — Tests the Craft

Values not places, types that enforce. `/forge` checks that the specification's type signatures express the architecture's intent. Are side-effects returned as values? Are chain types provable? Does the encoding cache enforce its own constraints?

This ward enforces the [[wat-vm|Values Up]] principle: every side effect flows up through return types, never down through queue parameters.

### `/temper` — Quiets the Fire

Redundant computation, allocation waste. `/temper` flags unnecessary work: duplicated indicator computations across modules, redundant encoding passes, allocations that could be static.

The five designer decisions between inscription 2 and 3 were largely temper findings. 4,847 lines became 3,248 — a 33% reduction driven by identifying and removing redundancy.

### `/ignorant` — Knows Nothing

Reads the path as a stranger. The most powerful ward. It reads the specification with no assumptions, no context from prior readings, no knowledge of what the guide intended. Just: does this make sense on its own?

This is the hardest test because it requires forgetting everything you know. The other wards operate with context — they know the guide's intent, the prior inscriptions' history, the architecture's trajectory. `/ignorant` strips all that away.

## The Eighth Ward: `/assay`

Seven wards check correctness. The assay checks **completeness**.

The assay asks: "Is this specification a complete program, or just a description?" A correct specification can still be incomplete — every individual wat file may pass `/sever`, `/reap`, `/scry`, `/gaze`, `/forge`, `/temper`, and `/ignorant`, yet the overall specification could be missing entire modules, computations, or state transitions.

### The Indicator-Bank Incident

The assay's power was proven when it caught what the other seven missed. Between inscriptions, the indicator-bank specification lost 1,400 lines. The missing lines contained indicators, state tracking, and computation logic. No other ward noticed because:

- `/sever` saw no tangled threads — the remaining code was cleanly structured
- `/reap` saw no dead code — the remaining code was all referenced
- `/scry` saw no divergence — the remaining code matched the guide for what it covered
- Every individual check passed

The assay saw the whole picture. It measured the substance: is every indicator the guide declares actually specified? Is every state transition defined? Is every computation path complete? The answer was no. 1,400 lines were missing.

This is why the assay exists. Correctness without completeness is a well-organized lie.

## The Convergence

Each inscription produces fewer findings. The sequence tells the story:

| Metric | Inscription 1 | Inscription 2 | Inscription 3 |
|--------|--------------|--------------|--------------|
| Files | 38 | 39 | 40 |
| Lines | — | 4,847 | 3,248 |
| Ward findings | many | fewer | approaching zero |

The fixed point is the state where the wards find nothing — where the guide, the wat, and the implementation are identical. The fixed point approaches. The wards are how we know.

## Related Concepts

- [[disposable-machine]] — the delete-and-regenerate cycle the wards protect
- [[wat-vm]] — the specification language being verified
- [[wat-vm|Values Up]] — the architectural principle `/forge` enforces
- [[vocabulary]] — what `/assay` checks for completeness
- [[proposal-system]] — changes to the guide that trigger new ward runs
- [[panel-of-experts]] — reviewers whose proposals drive the guide changes
