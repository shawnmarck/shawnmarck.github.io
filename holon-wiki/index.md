# Holon Lab Trading — Semantic Idea Wiki

> **A self-organizing trading system built on algebraic thought primitives.**
> Everything is a Thought. Thoughts compose. Thoughts compete. Thoughts learn.

---

## What This Is

Holon Lab Trading is an attempt to answer a single question: **what if observation, decision, and learning were all the same mathematical object?**

Instead of separate systems for market analysis, trade execution, and performance feedback, Holon collapses all three into a unified algebra called the [[thought-system|Thought System]]. Market data is encoded as vectors called Thoughts. Predictions are Thoughts. Trade decisions are Thoughts. Even the accuracy of past predictions is itself a Thought — a self-referential [[curve|Curve]].

The system runs on a custom concurrent runtime called the [[wat-vm]], where independent programs communicate exclusively through typed message queues. No shared mutable state. No dependency injection frameworks. Values flow up, not queues down.

## Core Philosophy

### Thoughts All the Way Down

The founding insight is that **named relational facts carry predictive signal where raw data does not.** A candle's OHLC values are noise. But a Thought that says *"the volume ratio is rising and the close is above the 20-period SMA and the Wyckoff spring pattern is active"* — that composition, encoded as a high-dimensional vector, carries information about future direction.

The [[vocabulary|Vocabulary]] is not a dictionary — it is the model. Different [[lens|lenses]] (momentum, structure, volume, regime, narrative, generalist) select different subsets of the vocabulary, creating different "minds" that think different thoughts about the same market data. The [[conviction|Conviction-Accuracy Curve]] then measures which minds are right, allocating capital accordingly.

### Values Up, Not Queues Down

Every side effect in the system — cache misses, log entries, [[signal-propagation|Propagation]] facts — is returned as a value through function return types. No queue parameters. No shared mutation during parallel phases. The type checker enforces correctness; the [[chain-types|Chain Types]] prove data flow through the pipeline.

### The Disposable Machine

The system is designed to be regenerated from scratch. The `wat/GUIDE.md` is the DNA — the master specification. The wat s-expression files are the mRNA. The eight [[wards|Wards]] are the ribosomes — defensive spells that verify the transcription. The Rust code is the protein — the functional organism. Delete the Rust. Run the spells. The wat regenerates it. This has been proven three times, each inscription leaner than the last.

---

## Architecture Overview

```
┌─────────────┐
│   Market    │  Raw candle stream
│   (BTC/USD) │
└──────┬──────┘
       │ candle
       ▼
┌─────────────┐
│   Post      │  Per-asset-pair unit, owns all observers + brokers
│             │
│  ┌───────────────────────────────┐
│  │     Four-Step Loop            │
│  │  1. RESOLVE (settle trades)   │
│  │  2. COMPUTE (encode + predict)│
│  │  3. TICK (paper trade)        │
│  │  4. COLLECT (fund winners)    │
│  └───────────────────────────────┘
│             │
│  ┌─────────┐  ┌──────────┐  ┌───────────┐
│  │ Market  │  │  Exit    │  │  Broker   │
│  │Observer │→│ Observer │→│ (N×M grid)│
│  │ (×N)    │  │  (×M)    │  │           │
│  └─────────┘  └──────────┘  └─────┬─────┘
│       ↑                              │
│       └──── learn signals ───────────┘
└──────┬──────┘
       │ proposals
       ▼
┌─────────────┐
│  Treasury   │  Capital management, proportional funding
└─────────────┘
```

All of this runs on the [[wat-vm]] — a message-passing runtime where each box above is an independent program thread, communicating through [[services|Services]] (Queue, Topic, Mailbox).

---

## Idea Map

### The Thought System (the algebra)

| Concept | One-Liner |
|---------|-----------|
| [[thought-system|Thought System]] | The six primitives that make everything the same type |
| [[atom|Atom]] | Names a concept — the atomic unit of meaning |
| [[bind|Bind]] | Composes thoughts — vertical, sequential composition |
| [[bundle|Bundle]] | Superposes thoughts — horizontal, parallel composition |
| [[fact|Fact]] | A named observation — a thought bound to real data |
| [[lens|Lens]] | A vocabulary filter — each lens is a different "mind" |
| [[curve|Curve]] | Self-evaluating accuracy — thought that judges thoughts |
| [[thought-encoding|Thought Encoding]] | How market data becomes high-dimensional vectors |
| [[thought-space|Thought Space]] | The vector space where thoughts live and compete |

### Learning and Accountability

| Concept | One-Liner |
|---------|-----------|
| [[reckoner|Reckoner]] | The learning primitive — learns discriminants from outcomes |
| [[grace-and-violence|Grace and Violence]] | The two accountability labels — correct vs incorrect |
| [[conviction|Conviction]] | Cosine similarity against the learned discriminant |
| [[conviction|Conviction-Accuracy Curve]] | Maps prediction confidence to historical accuracy |
| [[signal-propagation|Signal Propagation]] | How learn signals flow back through the system |
| [[vocabulary|Vocabulary]] | The complete set of named concepts — the IS the model |
| [[vocabulary-evolution|Vocabulary Evolution]] | How atoms are added, removed, and reorganized |

### The Runtime (the machine)

| Concept | One-Liner |
|---------|-----------|
| [[wat-vm]] | The concurrent message-passing runtime |
| [[services|Services]] | Queue, Topic, Mailbox — the three service primitives |
| [[programs|Programs]] | Independent functions running on dedicated threads |
| [[chain-types|Chain Types]] | The pipeline type system — the type IS the proof |
| [[encoding-cache|Encoding Cache]] | Distributed LRU where callers encode, cache manages |

### The Enterprise (the organism)

| Concept | One-Liner |
|---------|-----------|
| [[four-step-loop|Four-Step Loop]] | RESOLVE → COMPUTE → TICK → COLLECT per candle |
| [[market-observer|Market Observer]] | Predicts direction (Up/Down) from encoded thoughts |
| [[exit-observer|Exit Observer]] | Predicts distances (stop, take-profit, trailing) |
| [[broker|Broker]] | The accountability unit — binds observer to capital |
| [[four-step-loop|Post]] | Per-asset-pair coordination unit |
| [[treasury|Treasury]] | Capital management with bounded loss |
| [[paper-trade|Paper Trade]] | Hypothetical trades tracked before real commitment |

### The Process (the ribosomes)

| Concept | One-Liner |
|---------|-----------|
| [[wards|Wards]] | Eight defensive spells that verify correctness |
| [[disposable-machine|Disposable Machine]] | Delete the code, run the spells, it regenerates |
| [[proposal-system|Proposal System]] | Evolutionary design through structured debate |
| [[panel-of-experts|Panel of Experts]] | Hickey, Beckman, Wyckoff, Seykota, Van Tharp review proposals |

---

## Influences

The system draws from:

- **Vector Symbolic Architecture** (Kanerva, Plate) — the idea that concepts can be represented as high-dimensional vectors and composed algebraically
- **The Actor Model** (Hewitt, 1973) — independent programs communicating through messages, no shared state
- **FPGA Dataflow** — the topology IS the computation, static wiring at startup
- **Plan 9** — "everything is a queue" echoing "everything is a file"
- **Molecular Biology** — DNA (guide) → mRNA (wat) → protein (Rust), with ribosomes (wards) that verify transcription
- **Trading Philosophy** — Wyckoff (structure), Dow (trend), Seykota (risk), Van Tharp (psychology), Pring (momentum)

---

## Data

- 652,608 five-minute BTC candles (Jan 2019–Mar 2025) in `data/analysis.db`
- Standard benchmark: 100,000 candles
- Append-only run ledgers in `runs/`

---

*Compiled from the Holon Lab Trading knowledge graph — 1,689 nodes, 3,613 edges, 20+ semantic communities.*
