# Disposable Machine

> **TL;DR:** The guide IS the DNA. The wat is the protein. The Rust is the organism. The spells are the ribosomes. Delete the compiled output, run the spells, and the entire specification regenerates from the master blueprint. Proven three times, each inscription leaner than the last. The fixed point approaches.

---

## The Core Idea

The enterprise specification is **disposable**. At any time, you can delete every wat file and regenerate them from the guide. This isn't a backup strategy — it's a quality strategy. If the regenerated wat differs from the existing wat, something drifted. The guide is the source of truth. Everything else is a derivation.

This idea comes from molecular biology. DNA contains the complete instructions for building a protein. Ribosomes translate the DNA into mRNA, which folds into a functional protein. The organism can be rebuilt from the DNA alone. In the enterprise:

- **DNA** → `wat/GUIDE.md` — the master blueprint
- **Ribosomes** → the eight [[wards]] (spells) — verify and translate
- **Protein** → the wat s-expression files — the folded specification
- **Organism** → the Rust code in `src/` — the running system

The guide IS the program. The wat is the program expressed as a specification. The Rust is the program expressed as a compiled language. Three representations of the same thing. The guide is authoritative.

## The Inscription Cycle

An "inscription" is one complete regeneration cycle: guide → spells → wat. Each inscription is a proof that the guide contains enough information to reconstruct the entire specification.

```
wat/GUIDE.md (source of truth — the DNA)
    │
    ├─→ /sever, /reap, /scry (correctness wards)
    ├─→ /gaze, /forge, /temper (quality wards)
    ├─→ /ignorant (fresh-eyes review)
    ├─→ /assay (completeness check)
    │
    ▼
wat/ files (generated specification — the protein)
    │
    ▼
src/ (Rust implementation — the organism)
```

## Three Inscriptions

The system has been through three complete inscription cycles. Each one demonstrates that the approach works and that the quality improves:

### Inscription 1: 38 Files

Pre-session. The wat files existed from earlier work, but the guide had since changed. The first inscription regenerated from the updated guide and revealed drift — the existing wat was stale. This proved the approach: regeneration caught inconsistencies that manual review had missed.

### Inscription 2: 39 Files, 4,847 Lines

More complete. The guide had matured. The regenerated wat captured more of the architecture's intent. But it was verbose — 4,847 lines of specification that included redundancy, duplication, and over-description. The wards found many issues. The designer applied fixes.

### Inscription 3: 40 Files, 3,248 Lines

The leanest inscription yet. Five designer decisions were applied between inscription 2 and 3:

1. Simplifications in struct definitions (caught by `/temper`)
2. Removal of redundant computation paths (caught by `/temper`)
3. Clarifications in naming conventions (caught by `/gaze`)
4. Completeness fixes in indicator specifications (caught by `/assay`)
5. Elimination of orphaned atoms and unused modules (caught by `/reap`)

The result: 33% fewer lines despite adding more files. The specification got denser and more precise.

## The Fixed Point

Each inscription produces fewer ward findings. The trend is clear:

```
Inscription 1:  many findings, stale base
Inscription 2:  fewer findings, verbose output  
Inscription 3:  minimal findings, lean output
Inscription N:  zero findings → FIXED POINT
```

The fixed point is the state where the guide, the wat, and the (future) Rust implementation are in perfect alignment. Delete anything. Regenerate. Get the same thing back. That's when the machine is truly disposable — and truly trustworthy.

## Why This Matters

### Drift Detection

In any large system, the documentation drifts from the implementation. Someone changes code without updating docs. Someone updates docs without changing code. Over time, the gap grows. The disposable machine makes drift *detectable*: regenerate and diff. Any difference is a bug — either in the guide (intent changed but wasn't recorded) or in the wat (implementation diverged from intent).

### Fearless Refactoring

If you want to restructure the entire broker subsystem, you don't need to carefully modify dozens of interdependent files while maintaining consistency. You modify the guide, delete the wat, and regenerate. If the guide's changes were coherent, the regenerated wat reflects them coherently. If not, the wards catch the incoherence.

### Quality Enforcement

The wards run on every inscription. They catch:

- **Structural issues** (`/sever`) — tangled concerns, misplaced logic
- **Orphaned code** (`/reap`) — dead references from deleted vocabulary
- **Intent gaps** (`/scry`) — guide says X, wat does Y
- **Naming problems** (`/gaze`) — names that obscure rather than illuminate
- **Type violations** (`/forge`) — values-up principle broken
- **Redundancy** (`/temper`) — duplicated computation or allocation
- **Completeness** (`/assay`) — entire modules missing

### Singular Source of Truth

There is one place to look for what the system does: `wat/GUIDE.md`. Not the wat files (they're generated). Not the Rust code (it's derived from the wat). The guide. Every architectural decision, every struct definition, every interface contract lives there. If it's not in the guide, it doesn't exist.

## The Biological Analogy in Practice

The analogy isn't decorative — it's structural:

- The guide has no runtime behavior. It's pure information. Like DNA.
- The spells read the guide and produce structured output. Like transcription.
- The wards verify the output against the guide. Like proofreading during translation.
- The wat files have no runtime behavior either. They're specifications. Like mRNA.
- The Rust code compiles and runs. Like a folded protein doing work.

The critical insight: the organism (Rust) is currently empty. The system is building the protein (wat) first, proving it with the wards, and only then compiling the organism. This is deliberate. You verify the specification before you build the implementation. The [[wards]] are how you verify. The inscriptions are the proof.

## Related Concepts

- [[wards]] — the eight spells that verify wat quality on every inscription
- [[wat-vm]] — the specification language being regenerated
- [[wat-vm|Values Up]] — the architectural principle that simplifies each inscription
- [[vocabulary]] — the atom definitions that the guide declares and the wat implements
- [[proposal-system]] — how the guide (and thus the DNA) evolves
- [[panel-of-experts]] — the reviewers who approve changes to the guide
