# The Disposable Machine

> **TL;DR:** The guide IS the DNA. The spells are the ribosomes. The wat is the protein. Delete the wat. Run the spells. The wat reappears. Each inscription is leaner. The fixed point approaches.

## The Principle

The enterprise specification is **disposable**. The wat files can be deleted and regenerated from the guide at any time. This isn't a backup strategy — it's a quality strategy. If the regenerated wat differs from the existing wat, one of them is wrong.

## The Inscription Cycle

```
GUIDE.md (source of truth)
    ↓ wards (spells)
wat/ files (generated specification)
    ↓ compilation
src/ (Rust implementation)
```

Each regeneration is an "inscription." Three inscriptions have been completed:

| Inscription | Files | Lines | Notes |
|-------------|-------|-------|-------|
| 1 | 38 | — | Pre-session, stale after guide changes |
| 2 | 39 | 4,847 | More complete, but verbose |
| 3 | 40 | 3,248 | Five designer decisions applied, leaner |

Each inscription is leaner. Each ward pass finds fewer defects. The system approaches a fixed point where the guide, the wat, and the implementation are in perfect alignment.

## Why Disposable?

1. **Single source of truth** — the guide is the program. Everything else is derived.
2. **Drift detection** — if regeneration produces different output, something drifted.
3. **Quality enforcement** — the wards run on every inscription, catching defects early.
4. **Fearless refactoring** — delete and regenerate. If it was important, the guide captured it.

## The Biological Analogy

The metaphor is precise:

- **DNA** (guide) — contains the complete instructions, the source of truth
- **Ribosomes** (spells/wards) — translate DNA into protein, quality-check the result
- **Protein** (wat) — the functional specification, folded from the DNA
- **Organism** (Rust) — the living system, compiled from the protein

The organism can be rebuilt from the DNA at any time. The DNA is all you need.

## The Designer Decisions

Five designer decisions were applied between inscription 2 and 3, reducing 4,847 lines to 3,248:
- Simplifications in struct definitions
- Removal of redundancy caught by /temper
- Clarifications in naming caught by /gaze
- Completeness fixes caught by /assay

## Related Concepts

- [[The Wards]] — the eight spells that verify wat quality
- [[Wat VM]] — the specification language being regenerated
- [[Values Up]] — the architectural principle that simplifies each inscription
