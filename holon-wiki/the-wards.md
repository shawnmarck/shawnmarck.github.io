# The Wards

> **TL;DR:** Eight spells that defend against bad thoughts. Seven check correctness. The eighth checks completeness. The assay caught what the other seven missed.

## The Eight Wards

| Ward | Purpose | What It Catches |
|------|---------|----------------|
| `/sever` | Cuts tangled threads | Braided concerns, misplaced logic |
| `/reap` | Harvests what no longer lives | Dead code, unused fields |
| `/scry` | Divines truth from intention | Spec vs implementation divergences |
| `/gaze` | Sees the form | Names that mumble, comments that lie |
| `/forge` | Tests the craft | Values not places, types that enforce |
| `/temper` | Quiets the fire | Redundant computation, allocation waste |
| `/assay` | Measures substance | Is the spec a program or a description? |
| `/ignorant` | Knows nothing | Reads the path as a stranger |

## The Assay — The Eighth Ward

Seven wards check correctness. The assay checks **completeness**. It caught what the other seven missed — the indicator-bank specification lost 1,400 lines between inscriptions and no other ward noticed. The indicator-bank was still valid syntactically, still passed all checks — it was just incomplete. Missing indicators, missing state, missing computations.

The assay asks: "Is this specification a complete program, or just a description?" The distinction matters because the wat files are the bridge between the guide (intent) and the Rust (implementation). An incomplete spec produces incomplete code.

## /ignorant — The Most Powerful Ward

The ignorant ward reads the specification as if it has never seen it before. No assumptions. No context from prior readings. Just: does this make sense on its own?

This is the hardest test because it requires forgetting what you know. The other wards operate with the benefit of context — they know what the guide says, what the other files declare, what the intent was. The ignorant ward strips all that away and asks: would a stranger understand this?

## The Ward Process

Wards run on the wat specifications. They produce findings — specific issues with locations and descriptions. The designer addresses findings, the wat is updated, and the wards are re-run. Each inscription (regeneration cycle) produces fewer findings:

- The system approaches a fixed point where the wards find nothing
- At that point, the wat is a faithful transcription of the guide
- The guide IS the DNA. The wards ARE the immune system.

## Spells as Ribosomes

The wards are implemented as "spells" — scripts that read the wat specifications and the guide, perform their checks, and report findings. They are the ribosomes of [[The Disposable Machine]]: they translate the DNA (guide) into protein (wat) and quality-check the result.

## Related Concepts

- [[The Disposable Machine]] — the delete-and-regenerate cycle the wards protect
- [[Wat VM]] — what the wards verify
- [[Values Up]] — a principle the /forge ward enforces
- [[Homoiconicity]] — what the /gaze ward protects (names must be clear)
