# Treasury

**TL;DR:** The treasury is the capital management engine. It holds capital (either available or reserved), evaluates proposals from posts, funds proven ones proportionally to edge, and settles trades with bounded loss. The treasury does not think — it counts. It decides based on capital availability and proof curves.

---

## What the Treasury Does

The treasury is where the money happens. It receives a barrage of [[proposal-system|proposals]] from posts every candle. It evaluates each proposal's edge (accuracy from the broker's [[conviction|Conviction-Accuracy Curve]]), sorts by credibility, and funds the top N that fit within available capital. When trades settle, it routes outcomes back to posts for accountability.

The treasury does NOT predict. It does NOT learn. It counts. It enforces the capital invariant: the maximum loss on any trade is bounded by its reservation. This is not a policy — it is the architecture.

## The Capital Model

Capital exists in two states:

- **Available** — free to deploy. The treasury can commit this to new trades.
- **Reserved** — locked by active trades. Off limits until the trade settles.

```
available + reserved = total equity
```

The denomination (e.g., USD) defines what "value" means. All assets are convertible to the denomination for equity computation. The treasury manages wealth, not a cash balance.

### The Residue Model

When a trade settles with [[grace-and-violence|Grace]], the principal returns to available capital and the profit stays — that profit is the **residue**. Residue is permanent gain. It is never withdrawn. It compounds.

```
Deploy $50 USDC → acquire 0.0005 WBTC at $100,000
Price rises to $120,000, trailing stop fires at $115,000
Exit: swap enough WBTC → ~$50 USDC (recover principal)
Remainder: ~0.000065 WBTC ≈ $7.50 → the residue
```

Both sides of the pair grow. USDC is recycled. WBTC accumulates. The residue IS the target asset. Not converted. Not swapped. The treasury manages wealth — not a cash balance.

## The Proposal Barrage

Every candle, every post submits proposals (one per broker). With 24 brokers per post, that's 24 proposals per candle per post. The treasury receives them all into a `Vec<Proposal>`, then drains the queue after funding.

### Evaluation Criteria

The treasury sorts proposals by `proposal.edge` — the broker's accuracy measure from its internal curve. Higher edge = more credible = more capital.

Before funding, the treasury computes the worst-case venue cost: `(swap-fee + slippage) × amount × 2`. Both paths (entry + exit) cost a swap. The treasury reserves `amount + worst-case-venue-costs`. A proposal whose edge does not exceed the total venue cost rate is rejected — the system never takes a trade it can't afford to lose.

### Funding

```
sorted = sort(proposals, by=edge, descending)
for proposal in sorted:
  cost = amount + worst-case-venue-costs
  if cost ≤ available[source-asset]:
    available -= cost
    reserved += cost
    create Trade from proposal
    stash TradeOrigin (post-idx, broker-slot-idx, thought, prediction)
    log ProposalFunded
  else:
    log ProposalRejected
drain proposals
```

Funding is proportional to edge. A broker with 70% edge gets more capital than one with 55% edge. But the allocation is bounded by what's available. The treasury never deploys more than it has.

## Trade Phases and Settlement

### Active Phase

Capital is reserved. Both stops (trailing and safety) are live. Every candle, step 3c updates the stop levels based on fresh exit observer predictions. The stops breathe.

### Active → Settled-Violence

The safety stop fires. Full position swaps back. Principal minus loss returns to available. The trade is done. The maximum loss is bounded by the reservation — the treasury never loses more than what was reserved.

### Active → Runner

The trailing stop has moved past the break-even point. If the trade exited now, it would recover the principal. The trade transitions from `:active` to `:runner`. No swap occurs. The stop continues to breathe. The trade rides with zero effective risk.

### Runner → Settled-Grace

The trailing stop fires while in runner phase. The treasury swaps enough of the target asset back to recover the principal. The remainder IS the residue — permanent gain.

### Active/Runner → Settled-Violence (trailing stop)

If the trailing stop fires but exit value ≤ principal, the full position swaps back. This is Violence even though the trailing stop fired (not the safety stop). The trade didn't recover its cost.

## Venue Costs

Every swap incurs `swap-fee + slippage`. A round trip (entry + exit) costs `2 × (swap-fee + slippage)`. The treasury deducts these from returned capital before computing residue.

Standard configuration: `swap-fee = 0.0010` (10 basis points), `slippage = 0.0025` (25 basis points). Total round-trip cost: 0.7%. The edge must exceed this for a trade to be worth taking.

The residue from a Grace trade stays as the target asset and never swaps back. So only two swaps total — one entry, one exit. The runner phase does NOT trigger a swap — it's just the stop widening.

## The Routing Map

The treasury maps every active trade back to its origin:

- `trades: Map<TradeId, Trade>` — the active positions
- `trade-origins: Map<TradeId, TradeOrigin>` — the archaeological record (post-idx, broker-slot-idx, composed-thought, prediction)

When a trade settles, the treasury looks up the TradeOrigin, extracts the post-idx and broker-slot-idx, and routes the outcome to the right post and broker for [[signal-propagation]].

`TradeId` is a `newtype` over `usize` — not a raw integer. The compiler enforces type safety. You can't accidentally pass a slot index where a trade ID is expected.

## The Architecture is Pair-Agnostic

The treasury doesn't care what assets it manages. USDC/WBTC today. SPY/GOLD tomorrow. SOL/ETH after that. Each unique pair becomes a post. The treasury holds balances per asset and routes based on the pair's source and target assets.

The pair doesn't matter. The direction doesn't matter. The residue IS the point. Deploy capital. Ride the trade. Recover capital. The remainder is wealth. The residue compounds.

## What the Treasury Owns (and Doesn't)

The treasury owns:
- Available and reserved capital (per asset)
- Active trades and their origins
- The denomination definition
- Venue cost configuration

The treasury does NOT own:
- Observers (those live on posts)
- Brokers (those live on posts)
- The proposal logic (posts assemble proposals)
- The learning system (brokers and observers learn from propagation)

The treasury is pure accounting. It receives proposals, it funds or rejects, it settles, it routes outcomes. It doesn't think. The binary creates it, feeds it proposals, and reads its state for diagnostics.

## Related Concepts

- [[proposal-system|Proposal]] — what posts submit to the treasury for evaluation
- [[broker]] — produces proposals with edge values the treasury reads
- [[grace-and-violence]] — the outcomes the treasury uses for settlement
- [[paper-trade]] — hypothetical trades (not tracked by the treasury)
- [[four-step-loop]] — step 1 (settlement) and step 4 (funding) are treasury steps
- [[four-step-loop|Post]] — submits proposals and receives propagation from treasury settlements
- [[conviction|Conviction-Accuracy Curve]] — the source of the edge values the treasury sorts by
- [[signal-propagation]] — how treasury settlements teach the observers
