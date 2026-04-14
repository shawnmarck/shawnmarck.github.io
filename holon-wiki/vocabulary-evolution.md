# Vocabulary Evolution

> **TL;DR:** The system's accuracy is bounded by its vocabulary. Starting from 84 atoms, structured proposals have expanded the set to 107 atoms — lifting directional accuracy from 59.7% to 62.1%. Every new atom is proposed, reviewed by the [[panel-of-experts]], and validated by the [[conviction|Conviction-Accuracy Curve]]. The vocabulary IS the model. Growing it means growing what the system can perceive.

---

## Why Vocabulary Matters

In most ML systems, the model is a neural network with weights. The vocabulary is a list of tokens. They're separate things — the model *uses* the vocabulary.

In holon-lab-trading, the vocabulary **IS** the model. There are no weights separate from the vocabulary. Each atom is a 10,000-dimensional vector allocated deterministically by the VectorManager. The discriminant — the learned direction that separates outcomes — is built entirely from compositions of these atom vectors.

The vocabulary is the system's sensory apparatus. It defines what the system can perceive. If there's no atom for "Ichimoku cloud thickness," the system cannot think about Ichimoku cloud thickness. It's blind to it. Adding the atom opens a new dimension of perception.

This is the deepest insight: the system's capacity is bounded by its vocabulary. 107 atoms in 10,000 dimensions. The hyperspace has room for thousands. The question isn't whether to fill it. It's what thoughts to fill it with.

## From 84 to 107

The vocabulary started at 84 atoms covering RSI, MACD, ADX, and basic price structure. The initial system achieved 59.7% directional accuracy across 652,000 BTC candles — real signal, but vocabulary-limited. At 90,000 candles, the system was declining: 58.4% and falling. The original atoms were losing relevance as market structure shifted.

Proposal-driven expansion added 23 atoms across six new modules:

| School | Atoms Added | What They Perceive |
|--------|------------|-------------------|
| Ichimoku | 7 | Cloud position, thickness, tenkan/kijun distances, cross deltas |
| Stochastic | 4 | %K, %D, spread, crossover |
| Fibonacci | 8 | Price position relative to 23.6%, 38.2%, 50%, 61.8%, 78.6% levels |
| Keltner/Bollinger | 6 | Channel position, width, squeeze detection, distance from bands |
| CCI + flow | 4 | Commodity channel index, buying/selling pressure, body ratio |
| Price action | 6 | Range ratio, gap, consecutive bars, wicks |

The result: **62.1% directional accuracy**. A 2.4 percentage point improvement. More importantly, the new vocabulary changed the trajectory. At 90,000 candles, 107 atoms was rising (62.3% and climbing) while 84 atoms was falling. The new thoughts provided signal exactly where the old vocabulary ran dry.

## The Three Domains

The vocabulary is organized into three domains, each serving different observers:

### Shared — Universal Context (5 atoms)

Time atoms: `minute`, `hour`, `day-of-week`, `day-of-month`, `month-of-year`. Encoded as circular scalars. Every observer has access. Time affects every market.

### Market — Direction Signal (~80 atoms)

What the market IS DOING. Used by market observers through their [[lens|lenses]]. Organized into 16 modules: oscillators, flow, persistence, regime, divergence, Ichimoku, stochastic, Fibonacci, Keltner, momentum, price action, timeframe, standard. Each module groups atoms that answer one question about the market.

### Exit — Distance Signal (~25 atoms)

Whether CONDITIONS favor trading. Used by exit observers (position observers). Volatility atoms (ATR ratio, BB width, squeeze), structure atoms (trend consistency, ADX), timing atoms (RSI, stochastic, MACD). Plus the 10 trade-state atoms from Proposal 040: excursion, retracement, trail distance, stop distance, age, signaled, velocity.

## How Atoms Are Added

The process is structured and proposal-driven:

### 1. Identify the Gap

A thinker identifies something the system cannot perceive. "The system can't detect Ichimoku cloud thickness — it's blind to a major school of technical analysis." Or: "The exit observer thinks about candles but not about the trade state. It doesn't know excursion or retracement."

### 2. Write the Proposal

A formal proposal specifies the new atoms, what modules they belong to, what encoding scheme they use (linear, log, or circular), and what question they answer. Proposal 040 (Exit Trade Vocabulary) is a model: it specified eight new trade-state atoms, showed the existing paper struct they'd be computed from, and asked the [[panel-of-experts]] for review.

### 3. Expert Review

Each expert reviews from their domain:

- **Hickey:** Are the atoms composable? Do they add unnecessary complexity?
- **Beckman:** Are the encodings mathematically sound? Do they maintain the algebraic structure?
- **Wyckoff:** Do these atoms capture real market structure? Or are they noise?
- **Seykota:** Do they help with risk management? Do they work under drawdown stress?
- **Van Tharp:** Do they improve the statistical properties of the system?

### 4. Implement and Validate

Approved atoms are added to the vocabulary modules. The system runs. The [[conviction|curve]] judges. If accuracy improves, the atoms carry signal. If not, they're noise — but the discriminant filters noise gracefully, so there's little downside to trying.

## How Atoms Are Removed

Atoms are rarely removed. The discriminant is robust to noise — unused atoms don't hurt prediction, they just add dimensions the discriminant ignores. But vocabulary audits (Proposal 032) do identify atoms that:

- Duplicate existing atoms (RSI appearing in both `oscillators.wat` and `momentum.wat`)
- Carry no signal (the discriminant's cosine against them is near zero)
- Could be decomposed into simpler, more informative sub-atoms

Removal is conservative. An atom that carries zero signal today may carry signal in a different market regime. The system's 60.3% accuracy in the 2022 bear market (the best year) demonstrates that atoms useful in one regime may be useless in another. Only clear duplicates are removed.

## The Exit Vocabulary (Proposal 040)

A major evolution: the exit observer gained trade-state atoms. Previously, all 28 exit atoms thought about the candle — the same data the market observer processed. Proposal 040 added atoms about the trade itself: excursion, retracement, trail distance, stop distance, age, signaled status, price velocity, and peak age.

Three designers proposed atoms independently. They converged on a core set. The builder said "all of them" — include every proposed atom and let the discriminant sort it out. The curve is the judge.

This mirrors the system's founding insight: don't decide which thoughts matter in advance. Encode everything. Let the discriminant discover what predicts. Human intuition about which atoms are "important" is unreliable. The curve is not.

## The Market Vocabulary Challenge (Proposal 041)

After the hold architecture (Proposal 038) changed the market observer's question from "will the next 36 candles go up?" to "is something forming?", Proposal 041 challenged the designers: given 80+ atoms from 16 modules, which ones actually matter for *readiness* — not short-term direction prediction, but state detection (accumulation, trend establishment, volume confirmation)?

This is the ongoing frontier. The system has 107 atoms. It needs hundreds or thousands more. The [[panel-of-experts]] guides which atoms to add. The curve validates whether they carry signal. The vocabulary IS the model. Growing it means growing what the system can think about.

## The Downside Is Bounded

Adding atoms has minimal downside. The discriminant filters noise — proven by the initial system's robustness to noisy facts. Each new atom adds one dimension to a 10,000-dimensional space. The cosine computation is O(D) — one pass through the vector. The cost scales linearly.

The upside is unbounded. 84 atoms got 57%. 107 atoms got 62%. The trajectory suggests that more thoughts, more schools of analysis, more ways to perceive the same market data will produce a steeper curve. The bottleneck is not the architecture. It's not the data. It's the vocabulary.

## Related Concepts

- [[vocabulary]] — the current 107 atoms and how they're organized
- [[atom]] — the named vector, the atomic unit of meaning
- [[lens]] — the vocabulary filter that selects atoms for each observer
- [[proposal-system]] — how new atoms are proposed and reviewed
- [[panel-of-experts]] — the five reviewers who evaluate vocabulary proposals
- [[conviction|Conviction-Accuracy Curve]] — the ultimate judge of whether atoms carry signal
- [[thought-encoding]] — how atoms become high-dimensional vectors
- [[thought-space|Discriminant]] — the learned direction in vocabulary-space that separates outcomes
