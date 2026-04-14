# The Four-Step Loop

**TL;DR:** Every candle, every post executes the same four-phase pipeline: settle what's done (RESOLVE), think about what's new (COMPUTE+DISPATCH), track hypotheticals (TICK), and fund the winners (COLLECT+FUND). This is the heartbeat of the enterprise — one tick of the clock per candle.

---

## The Big Picture

The enterprise is a fold. `f(state, candle) → state`. The four-step loop is the body of that fold. It runs once per candle, per post, and it is the only place where learning, prediction, and capital allocation happen. Everything outside this loop — construction, teardown, progress display — is plumbing.

The four steps are ordered. Each step produces what the next step consumes. No step reaches ahead. No step reaches behind. The order IS the dependency graph.

## Step 1: RESOLVE

**Settle triggered trades. Propagate outcomes to observers.**

Before any new thinking happens, the system closes the books on what's already done. The treasury holds active trades. Each trade has stop-levels — absolute price levels for the trailing stop and safety stop. The enterprise collects current prices from each post, then asks the treasury: did anything trigger?

Two trigger paths exist:

- **Active + safety-stop fires** → `:settled-violence`. The full position swaps back. Principal minus loss returns to available capital. The trade is done.
- **Active/Runner + trailing-stop fires** → depends on exit value vs principal. If the exit recovers more than was deployed, it's `:settled-grace` (residue is permanent gain). Otherwise, `:settled-violence`.

For each settled trade, the treasury produces a `TreasurySettlement`. The enterprise computes two things from it: the actual **direction** (exit-price vs entry-price → Up or Down) and the **optimal distances** (via `compute-optimal-distances`, replaying the price history). Then it routes to the post, which calls `broker.propagate`. The broker learns its own lesson (Grace/Violence), and returns `PropagationFacts` — values that the post applies to the market observer (direction) and exit observer (optimal distances).

This is **propagation path 1** — real trade outcomes teaching observers.

## Step 2: COMPUTE+DISPATCH

**Encode the candle. Predict. Compose. Propose.**

This is where the thinking happens. The post receives a raw candle, ticks its indicator bank to produce an enriched candle (100+ computed indicators), and pushes it into the candle window.

Then the parallel phase: all N market observers encode simultaneously. Each observer samples a window size from its `WindowSampler`, slices the history, calls the vocabulary modules matching its [[lens]], and encodes the resulting `ThoughtAST` bundle into a high-dimensional vector. Each observer strips noise (the [[market-observer|Noise Subspace]] removes what's normal, leaving what's unusual), predicts via its [[reckoner]] (Up or Down), and returns its thought, prediction, edge, and cache misses.

Then the sequential phase: each market thought flows to every exit observer. The exit observer encodes its own judgment facts (volatility, structure, timing — depending on its lens), composes them with the market thought via `evaluate-and-compose`, and queries its continuous reckoners for recommended distances. Each distance cascades: if the reckoner has experience, use its contextual prediction; else if the broker's [[broker|ScalarAccumulator]] has data, use that global extraction; else fall through to the crutch (default values like 1.5% for trail).

Each broker receives a composed thought, strips noise, predicts Grace/Violence, and the post assembles a [[proposal-system|Proposal]] with the composed thought, distances, edge, side, assets, prediction, and identifiers. The proposal goes to the treasury's barrage.

## Step 3: TICK

Three sub-steps. The busiest phase.

### Step 3a: Parallel Tick

Every broker ticks its papers in parallel. Papers are hypothetical trades — "what if we opened here?" Each broker creates a new paper entry every candle with the current composed thought, entry price, and distances. Both buy-side and sell-side are tracked simultaneously.

Papers resolve when their trailing stops fire (price moved up then retraced, or moved down then retraced). Each resolved paper produces a `Resolution` — facts, not mutations. These are collected via `par_iter` and `collect()`. Each broker touches only its own papers. Disjoint. Lock-free.

### Step 3b: Sequential Propagate

The enterprise folds over the collected resolutions and applies them to the shared observers. Market observers learn the actual direction (Up/Down). Exit observers learn optimal distances. Brokers learn Grace/Violence.

This is **propagation path 2** — paper outcomes teaching observers. Same `broker.propagate` call as Step 1. Different source (papers, not real trades). Both paths teach. The learning doesn't distinguish between hypothetical and real — both feed the same reckoners.

### Step 3c: Update Triggers

The enterprise queries the treasury for active trades belonging to this post. The post composes fresh thoughts (using the current candle's market thoughts + exit facts), queries exit observers for new distances, converts to absolute price levels, and returns them. The enterprise writes the new levels back to the treasury.

The stops **breathe**. They aren't set-and-forget. Every candle, step 3c re-asks: "for THIS thought in THIS market context, what are the optimal distances NOW?" The exit reckoners learned from every prior resolution which distances produced Grace. They apply that learning to active trades continuously.

If a trailing stop has moved past the break-even point (exit would recover the principal), the trade transitions from `:active` to `:runner`. The runner phase means zero effective risk — the principal is already covered. The trade continues riding until the trailing stop fires.

## Step 4: COLLECT+FUND

**The treasury evaluates proposals and funds proven ones.**

The treasury has received proposals from all posts. Now it sorts by edge (the broker's accuracy measure from its [[conviction|Conviction-Accuracy Curve]]) and funds the top N that fit within available capital. Rejected proposals get `ProposalRejected` log entries.

Before funding, the treasury computes worst-case venue costs: `(swap-fee + slippage) × amount × 2` (both entry and exit cost a swap). It reserves `amount + worst-case-venue-costs`. A proposal whose edge doesn't exceed the total venue cost rate is rejected — the system never takes a trade it can't afford to lose.

Funded proposals become trades. Capital moves from available to reserved. A `TradeOrigin` is stashed (post-idx, broker-slot-idx, composed-thought, prediction) — the archaeological record of why the trade exists, used for propagation at settlement.

Then the treasury drains its proposals queue. Clean slate for the next candle.

## The Fold Boundary

Between candles, the binary inserts cache misses into ctx's `ThoughtEncoder` composition cache. This is the one seam in the otherwise immutable world. `ctx` is immutable during a candle. The cache updates between candles. The seam is bounded by the fold boundary.

Log entries are flushed to the ledger. Progress is displayed. Then the next candle arrives, and the loop begins again.

## Performance Constraints

- **Step 2 market encoding** is the heaviest step — six 10,000-dim encodings in parallel.
- **Step 3a broker tick** is the widest — 24 brokers in parallel, but light per-broker.
- **Steps 3b and 3c are sequential** — they touch shared observers and treasury state.
- **Target:** 75–500 candles/second at 10,000 dimensions.

## Related Concepts

- [[four-step-loop|Post]] — the unit that runs this loop for one asset pair
- [[broker]] — the accountability unit that proposes within this loop
- [[market-observer]] — produces the thoughts that drive the loop
- [[exit-observer]] — produces the distances that define trade parameters
- [[treasury]] — the capital allocator in step 4
- [[paper-trade]] — the hypotheticals tracked in step 3a
- [[signal-propagation]] — how learning flows back in steps 1 and 3b
- [[grace-and-violence]] — the accountability labels that close the loop
