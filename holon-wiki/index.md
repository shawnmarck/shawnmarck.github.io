# Holon Lab Trading

*A machine that measures thoughts against reality. Grace or Violence. Nothing more. Nothing less.*

The system encodes named market relationships — "RSI diverging from price," "volume contradicting the rally" — as compositional vectors in 10,000-dimensional hyperspace. It learns discriminants separating good predictions from bad ones. It judges itself by the geometry of its own encoding space. No neural networks. No gradient descent. No attention heads. Just algebra, cosine similarity, and closed-loop accountability.

---

## The Big Idea

You cannot build prediction from perception. You build it from cognition.

Visual encoding of price charts — a faithful 48-candle raster grid with every pixel, every wick, every indicator line — produced **50.5% accuracy**. Barely random.

[[Thought Primitives|Thought encoding]] of the same data — named relationships composed into vector algebra — produced **57–62% accuracy** across six years and every market regime. The information isn't in the chart. It's in the **interpretation** of the chart.

The [[Conviction-Accuracy Curve]] — `accuracy = 0.50 + a × exp(b × conviction)` — is continuous, monotonic, and real. It emerges from the geometry of high-dimensional space. Higher conviction means more facts voting coherently. At the top 1% conviction: ~59% accuracy over 652,362 BTC candles (2019–2025).

This is not AI trading. This is **cognitive algebra applied to markets**.

---

## Core Thesis

> The vocabulary IS the model. Different vocabularies produce different thoughts. Different thoughts produce different discriminants. Different discriminants produce different conviction-accuracy curves. The curves compete.

84 atoms → 59.7% accuracy. 107 atoms → 62.1%. The trajectory matters more than the headline: at 90,000 candles, 84 atoms was declining while 107 atoms was climbing. The new thoughts provided signal in the exact regime where the old vocabulary ran dry. The system needs good thoughts and time.

---

## Architecture

The [[The Enterprise|enterprise]] is a coordination plane. It owns [[The Post|posts]] (one per asset pair) and [[The Treasury|the treasury]] (capital management). The architecture is pair-agnostic — any asset pair becomes a post.

```
Enterprise
├── Posts (one per asset pair)
│   ├── Market Observers (N) — predict direction (Up/Down)
│   ├── Exit Observers (M) — predict distances (trail/stop)
│   ├── Brokers (N×M) — accountability units (Grace/Violence)
│   └── Paper Trades — hypothetical "what-if" positions, every candle
└── Treasury — capital management, proportional funding by edge
```

Every candle flows through [[The Four-Step Loop|the four-step loop]]:

| Step | Action |
|------|--------|
| **RESOLVE** | Settle triggered trades, propagate outcomes back through brokers → observers |
| **COMPUTE + DISPATCH** | Encode candle → observers predict → brokers propose |
| **TICK** | Parallel tick brokers (papers), sequential propagate (shared observers), breathing stops |
| **COLLECT + FUND** | Treasury evaluates proposals, funds proven ones by edge |

---

## The Five Primitives

Everything is built from five operations on high-dimensional vectors:

| Primitive | Meaning | Lisp Equivalent |
|-----------|---------|----------------|
| `atom` | Name a concept — the identifier IS the thing | Symbol |
| `bind` | Compose two thoughts — vector multiplication | `apply` |
| `bundle` | Superpose N thoughts — vector addition | `cons` |
| `cosine` | Measure similarity — collapse to scalar | `eval` |
| `reckoner` | Learn — accumulate, build discriminant, predict | `reduce` |

McCarthy built the language of thought in 1958. He just didn't have 10,000 dimensions to think in.

---

## Learning: Grace and Violence

The loop closes through [[Grace vs Violence]]. Two outcomes. Two labels. Everything learns from them.

- **Grace** — the thought produced value (permanent gain). Capital deployed, position ridden, principal recovered, residue accumulated.
- **Violence** — the thought destroyed value (bounded loss). Capital deployed, stop fired, loss bounded by reservation.

Violence isn't failure — it's **teaching**. A reckoner that only sees Grace has no discriminant. Violence provides the contrast that gives the discriminant its shape.

---

## Design Principles

**[[Values Up]]** — Functions return side-effects as values. No queue parameters. No shared mutation during parallel phases. The loop is a pure function from (state, candle) to (new-state, log-entries).

**[[Homoiconicity]]** — Atoms are names are vectors. The identifier of a thing IS the thing itself. Code is data. Data is code. The thought IS its own representation.

**[[The Disposable Machine]]** — The guide IS the DNA. The spells are the ribosomes. The wat is the protein. Delete the wat. Run the wards. The wat reappears. Each inscription leaner. The fixed point approaches.

**Never average a distribution.** Let values breathe with the market.

---

## Origins

The system was built by a DDoS expert who pivoted to markets — not as a trader, but as a thinker trying to understand why some interpretations predict and others don't. The original idea was [[Shield Cognition]]: VSA-based anomaly detection for network security, rejected at AWS. Markets became the new proving ground.

> Opus trained the human. Sonnet built the system. Neither could have done this alone.

---

## Wiki Index

### Foundation
| Page | TL;DR |
|------|-------|
| [[Thought Primitives]] | Five operations — atom, bind, bundle, cosine, reckoner — form the complete algebra of cognition |
| [[Thought Space]] | 10,000-dimensional hyperspace where every concept is a direction and every prediction is a cosine |
| [[Vocabulary]] | 107 named atoms across schools — the vocabulary IS the model |
| [[Homoiconicity]] | Atoms are names are vectors — the identifier of a thing IS the thing itself |
| [[Values Up]] | Functions return side-effects as values. No queues. No shared mutation. |

### Learning
| Page | TL;DR |
|------|-------|
| [[The Reckoner]] | The sole learning primitive — accumulates, discriminates, predicts, carries its own proof curve |
| [[Discriminant]] | The learned direction in thought-space that separates Grace from Violence |
| [[Conviction]] | Cosine against the discriminant — how strongly the reckoner predicts |
| [[Conviction-Accuracy Curve]] | `accuracy = 0.50 + a × exp(b × conviction)` — the universal judge |
| [[Grace vs Violence]] | Two outcomes. Grace = permanent gain. Violence = bounded loss. Violence is teaching. |
| [[Noise Subspace]] | Learns what normal looks like — strips background texture so reckoners see signal |
| [[Engram Gating]] | Snapshot good discriminant states, reject bad recalibrations |
| [[Scalar Accumulator]] | Per-value vector learning — what distances does Grace prefer? |

### Architecture
| Page | TL;DR |
|------|-------|
| [[The Enterprise]] | The coordination plane — owns posts and treasury, routes candles, returns values |
| [[The Post]] | Per-asset-pair unit — owns observers, brokers, indicator bank |
| [[Market Observers]] | N entities per post, each with a lens — predict direction (Up/Down) |
| [[Exit Observers]] | M entities per post — predict optimal exit distances via continuous reckoners |
| [[Brokers]] | The accountability unit — binds market + exit observer, owns papers and Grace/Violence reckoner |
| [[The Treasury]] | Pure accounting — funds proportionally to edge, bounded loss, residue IS the growth |
| [[The Four-Step Loop]] | The heartbeat — resolve, compute+dispatch, tick, collect+fund — every candle |
| [[The Proposal System]] | What brokers produce, what the treasury evaluates |
| [[Paper Trades]] | Hypothetical what-if positions — the fast learning stream, every candle |
| [[Trade Lifecycle]] | Active → Runner → Settled. Stops breathe. One entry. One exit. |

### Specification
| Page | TL;DR |
|------|-------|
| [[Wat VM]] | The s-expression specification language — GUIDE → wat → Rust |
| [[Lenses]] | Vocabulary subset selector — six market lenses, four exit lenses |
| [[The Wards]] | Eight spells that defend against bad thoughts |
| [[The Disposable Machine]] | Delete the wat. Run the spells. It reappears. |

### Vision
| Page | TL;DR |
|------|-------|
| [[Seeds and Emergence]] | Named experts are seeds. The geometry reveals the real unnamed experts. |
| [[The GPU Thought Engine]] | Massive parallel thought discovery — GPU evaluates, discriminant judges, LLM interprets |
| [[Shield Cognition]] | The rejected AWS origin — VSA anomaly detection for network security |
| [[The Debugger]] | An LLM is a breakpoint in yourself — the system was debugged into existence |

---

*From [holon-lab-trading](https://github.com/watmin/holon-lab-trading) by watministrator. Built by a datamancer and a machine. Neither could have built it alone.*
