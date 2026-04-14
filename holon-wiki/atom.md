# Atom

> *Naming a concept assigns it a random point in high-dimensional space — the name IS the vector.*

An Atom is the most fundamental primitive in holon-rs. You name something. That name maps to a random unit vector in ~1,000-dimensional space. That's it. That's the whole primitive.

But from this simple act — naming — an entire cognitive algebra emerges.

## How It Works

When you create an atom `volume-ratio`, the system generates a random unit vector `v`. Every time any thought references `volume-ratio`, it uses the same `v`. This is deterministic: the same atom name always produces the same vector (via a hash seed).

This means atoms are **stable** — you can encode a thought today and re-encode it next week and get the same vector. Stability is what makes learning possible. If vectors changed every time, the [[Discriminant]] would be chasing a moving target.

## Orthogonality by Default

In high-dimensional space, random unit vectors are approximately orthogonal. `cosine(v₁, v₂) ≈ 0` for any two different atoms. This isn't perfect, but at ~1,000 dimensions, the interference between unrelated atoms is negligible.

This matters because it means **unrelated concepts don't collide**. `rsi-divergence-bull` and `atr-ratio` live in different parts of the space. When you [[Bind and Bundle|bundle]] them together, you get a vector that's meaningfully distinct from either alone.

## The Five Schools

Atoms aren't random — they encode trading knowledge from five expert traditions:

| School | Example Atoms | Philosophy |
|--------|---------------|------------|
| **Wyckoff** | `choppiness`, `since-vol-spike`, `dist-from-low` | Structural price analysis, accumulation/distribution |
| **Dow** | `trend-aligned`, `higher-highs`, `volume-confirms` | Trend following, market breadth |
| **Pring** | `rsi-divergence-bull`, `di-spread`, `adx` | Momentum and divergence, oscillator analysis |
| **Seykota** | `volatility-regime`, `trend-quality` | Risk-based, volatility-aware trading |
| **Van Tharp** | `position-sizing`, `risk-reward`, `expectancy` | Position management, expectancy-based |

The total [[Vocabulary]] is 107 atoms across market, exit, and trade domains. Each school contributes a different way of *thinking about* the same market. The system doesn't pick a winner — it lets them compete through the [[Conviction-Accuracy Curve]].

## Naming IS Modeling

The deep insight: choosing atom names is choosing what concepts the system can *think about*. An atom for `choppiness` means the system can detect and reason about choppy markets. No atom for it? The concept doesn't exist in the system's cognition.

This is why the proposal system matters so much — adding a new atom is literally expanding the system's cognitive vocabulary. Each new thought is a new dimension of reasoning.

## Related Concepts

- [[Thought Primitives]] — the full set of six compositional operations
- [[Bind and Bundle]] — how atoms compose into complex thoughts
- [[Fact]] — atoms combined with scalar values and timestamps
- [[Vocabulary]] — the full set of 107 atoms and their organization
- [[Thought Space]] — the geometry where atom vectors live
- [[Lenses]] — how observers select which atoms to think with
