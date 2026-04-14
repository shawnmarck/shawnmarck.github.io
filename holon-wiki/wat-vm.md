# Wat VM

> **TL;DR:** The s-expression specification language. Wat files ARE executable blueprints — the guide declares the architecture, the wat specifies it in Scheme-like syntax, and the Rust implements what the wat specifies. Delete the wat. Run the spells. It reappears.

## What It Is

The wat language is a Scheme-like s-expression format used to specify the enterprise's architecture. Each `.wat` file defines one component as data — structs, enums, constructors, and interfaces expressed as nested parenthesized forms.

The wat is not pseudocode. It is a **formal specification** with:
- Grammar rules (defined in `LANGUAGE.md`)
- Host forms (Rust interop)
- Core forms (struct, enum, newtype)
- Type annotations

## The Trinity

```
GUIDE.md  →  The DNA (declarations, semantics, dependencies)
wat/      →  The protein (s-expression specifications)
spells/   →  The ribosomes (ward scripts that regenerate wat from guide)
src/      →  The organism (Rust implementation, compiled from wat)
```

The guide IS the program. The wat IS the protein. The spells ARE the ribosomes.

**The Disposable Machine:** Delete the wat. Run the spells. The wat reappears. Proven three times:
- Inscription 1: 38 files (pre-session, stale after guide changes)
- Inscription 2: 39 files, 4847 lines
- Inscription 3: 40 files, 3248 lines (five designer decisions applied)

Each inscription is leaner. Each ward pass finds fewer findings. The fixed point approaches.

## Wat File Structure

40 files at third inscription, organized by construction order:

```
wat/
├── GUIDE.md       — the master blueprint
├── CIRCUIT.md     — visualization of data flow
├── ORDER.md       — construction order (leaves → root)
├── raw-candle.wat
├── indicator-bank.wat
├── candle.wat
├── ctx.wat
├── enums.wat      — Side, Direction, Outcome, TradePhase
├── thought-encoder.wat
├── market-observer.wat
├── exit-observer.wat
├── broker.wat
├── post.wat
├── treasury.wat
├── enterprise.wat
├── bin/enterprise.wat  — the binary entry point
├── vocab/              — vocabulary module specifications
└── ...                 — window-sampler, scalar-accumulator, etc.
```

The construction order IS the dependency graph. Leaves first, root last. Each file's dependencies are already defined before it appears.

## Example: A Wat Specification

```scheme
(struct raw-candle
  [source-asset : Asset]
  [target-asset : Asset]
  [ts : String]
  [open : f64]
  [high : f64]
  [low : f64]
  [close : f64]
  [volume : f64])
```

This is simultaneously:
- **Data** — a description of the RawCandle struct
- **Code** — a specification that the Rust compiler target will implement
- **Documentation** — a readable declaration of what RawCandle contains

## The Binary Entry Point

`bin/enterprise.wat` wires the entire system:

```scheme
;; Wire market observers (one per MarketLens variant)
(wire-market-observers ctx ...)  → WiredMarketObservers

;; Wire exit observers (one per ExitLens variant)
(wire-position-observers ctx ...)  → WiredPositionObservers

;; Wire brokers (N×M grid)
(wire-brokers market-observers exit-observers ...)  → WiredBrokers

;; Wire the post
;; Wire the treasury
;; Wire the enterprise
```

The `Pipeline` struct carries all the wired components. `main()` creates it and runs the candle loop.

## Homoiconicity in Practice

The wat files demonstrate the project's deepest principle: the identifier of the thing is the thing itself. A wat specification IS both the documentation and the implementation. There is no drift between what the guide declares and what the code does, because the wat sits between them — a formal, machine-verifiable bridge.

## Related Concepts

- [[The Disposable Machine]] — the delete-and-regenerate cycle
- [[The Wards]] — the spells that verify wat quality
- [[Thought Primitives]] — the operations specified in wat
- [[Homoiconicity]] — the philosophical principle behind the wat approach
- [[Values Up]] — the architectural principle encoded in wat
- [[The Enterprise]] — what the wat specifies at the root
