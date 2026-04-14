# Panel of Experts

> **TL;DR:** Five reviewers with complementary perspectives evaluate every proposal. Hickey checks simplicity, Beckman checks correctness, Wyckoff checks market structure, Seykota checks risk, Van Tharp checks psychology. They independently issue APPROVED, CONDITIONAL, or REJECT verdicts. Their disagreements surface trade-offs that a single reviewer would miss.

---

## What the Panel Is

The Panel of Experts is a review mechanism. Every [[proposal-system|proposal]] is sent to all five members for independent review. The panel is not a committee — there is no meeting, no consensus requirement, no negotiation. Each expert reviews from their domain, states their verdict, and explains their reasoning. The resolution synthesizes.

The panel exists because no single perspective is sufficient. A proposal that is mathematically correct (Beckman approves) may be psychologically naive (Seykota rejects). A proposal that is simple and composable (Hickey approves) may miss market structure (Wyckoff rejects). The panel catches these blind spots.

## The Five Experts

### Rich Hickey — Software Design

**Focus:** Simplicity, composability, state management.

Hickey's reviews cut to the structural question: does this change make the system simpler or more complex? Is the proposed abstraction genuine or premature? Does it compose with the existing architecture, or does it require special cases?

His signature move: rejecting names. In Proposal 050, Hickey argued that "position observer" was wrong because "it communicates what this component thinks ABOUT, not what it DOES." He proposed "distance observer" — names the output, not the domain of concern. He applies the same rigor to abstractions: "A richer value is still a value. Making the value richer is a value-level change. Adding pipes is a topology-level change. Values are simple. Topology is not." (Resolution 046)

Hickey catches:
- Premature abstractions
- Names that obscure rather than illuminate
- Unnecessary complexity introduced in the name of flexibility
- State management violations (hidden mutation, shared state)

### Brian Beckman — Formal Methods

**Focus:** Correctness, mathematical rigor, categorical reasoning.

Beckman's reviews frame every proposal in terms of functors, categories, and morphisms. A component is "a functor from the category of composed thoughts to the category of distance pairs." A design choice is "a natural transformation" or "a factoring error."

This isn't jargon — it's precision. When Beckman says "the naturality square commutes," he means the proposed change preserves the existing compositional structure. When he says "M redundant Mealy machines," he means there are M identical state machines consuming the same input stream — a factoring error that should be one machine.

His signature move: identifying redundant computations that look different but are algebraically identical. In Proposal 046, he flagged Option C (trackers on exit threads) as creating M redundant state machines — each exit thread would maintain its own copy of the same pivot tracker. "Beckman's factoring error" became shorthand in the project for this class of bug.

Beckman catches:
- Redundant state machines
- Broken compositional structure
- Incorrect functorial relationships
- Hidden assumptions in type signatures

### Wyckoff — Market Structure

**Focus:** Price action, accumulation, distribution, tape reading.

Wyckoff's reviews evaluate whether a proposal reflects how markets actually work. He thinks in terms of tape readers, accumulation phases, springs, upthrusts — the structural patterns that repeat across assets and timeframes.

His signature move: the tape reader analogy. "The tape reader does not hand the trader a transcript of every print since the market opened. He hands the trader a reading: the current condition and the recent pivots that define it." (Review 046) This framing killed Option C (500-sample rolling history) — the exit doesn't need the tape, it needs the reading.

Wyckoff catches:
- Proposals that violate market structure
- Over-engineering that treats market data as arbitrary numbers
- Abstractions that lose the information a tape reader would see
- Detection vs interpretation boundary violations

### Ed Seykota — Risk Management

**Focus:** Position sizing, drawdown psychology, the emotional dimension of trading.

Seykota's reviews bring the trader's perspective: does this change help or hurt the system's ability to manage risk? He evaluates proposals through the lens of a trader who has lived through drawdowns, winning streaks, and the psychological traps that destroy trading systems.

His signature move: checking whether a name is something a real trader would say. "On a trading desk, nobody says 'position observer.' That is not a role. It is two nouns pushed together." (Review 050) He rejected the proposal's name not on technical grounds but on domain authenticity.

Seykota catches:
- Proposals that work in theory but fail under drawdown stress
- Vocabulary that doesn't match real trading language
- Risk management gaps hidden behind technical elegance
- Over-optimization that ignores the human element

### Van Tharp — Trading Psychology

**Focus:** Expectancy, R-multiples, position sizing models, self-awareness.

Van Tharp's reviews evaluate whether a proposal supports sound position sizing and expectancy management. He thinks in terms of R-multiples (risk units), expectancy distributions, and the statistical properties of trading systems.

His signature move: the statistical argument. In Proposal 046, he argued that 20 records is sufficient for a percentile-based significance filter: "You do not need thousands of samples for an 80th percentile — you need rank ordering, and 20 records give you that with 4 records above threshold." The extra precision of 500 samples (Option C) didn't justify the factoring error.

Van Tharp catches:
- Insufficient statistical reasoning in design choices
- Position sizing implications of architectural changes
- Over-fitting to precision that the coarse gate doesn't need
- Disconnects between the system's statistical properties and its design

## How Disagreement Works

The most valuable proposals are the contested ones. When experts disagree, the resolution document explains the trade-off. Proposal 050 is the canonical example:

```
Seykota:  REJECT     → "distance observer" (names the output)
Hickey:   CONDITIONAL → "distance observer" (future names are lies told early)
Beckman:  CONDITIONAL → "position observer" (forward declaration, ship with 049)
```

Three experts. Two different names. One rejected, two conditional. The resolution synthesized: "position observer," shipped with 049 in the same commit. Beckman's condition was met. Seykota and Hickey's preferred name was acknowledged but overruled — the resolution explained why "distance" would require a second rename after phase awareness landed.

The panel doesn't require unanimity. It requires clarity about where the disagreement lies and why the chosen path was selected.

## Why Five, Not One

A single reviewer catches most issues. But single-reviewer systems have blind spots. A software design expert may not notice that a proposal makes risk management harder. A trading expert may not notice that a proposal introduces a redundant state machine. The five perspectives are complementary:

| Perspective catches... | That others miss... |
|----------------------|-------------------|
| Hickey (design) | Over-complexity | But may miss market structure |
| Beckman (math) | Redundancy, broken composition | But may miss psychological impact |
| Wyckoff (markets) | Tape-reading violations | But may miss formal correctness |
| Seykota (risk) | Drawdown failures | But may over-optimize for safety |
| Van Tharp (psychology) | Statistical gaps | But may miss simplicity |

The union of their perspectives covers the full design space. The intersection of their approvals is a high-confidence signal that the proposal is sound.

## Related Concepts

- [[proposal-system]] — the mechanism that sends proposals to the panel
- [[wards]] — verify that panel-approved changes are faithfully implemented
- [[disposable-machine]] — the regeneration cycle that proposals drive
- [[vocabulary-evolution]] — vocabulary proposals are the most common type
- [[wat-vm|Values Up]] — the principle all five experts enforce from different angles
