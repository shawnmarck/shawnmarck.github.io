# Trade Lifecycle

> **TL;DR:** A trade has a phase, not just a status. Active → Runner → Settled. The stops breathe every candle. One entry. One exit. The residue IS the point.

## The State Machine

```
         safety stop fires
ACTIVE ──────────────────→ SETTLED-VIOLENCE (bounded loss)
  │
  │ price moves favorably
  │ (trailing stop covers principal)
  ↓
RUNNER ─ trailing stop fires → SETTLED-GRACE (permanent gain)
  │
  │ safety stop fires
  ↓
SETTLED-VIOLENCE (but principal already covered)
```

### Active Phase
Capital is reserved. Trailing stop and safety stop are live. The trade is running. Both stops are monitored every candle during step 3c of [[The Four-Step Loop]].

### Runner Phase
The trailing stop has moved far enough that exiting now would recover the principal. The trade is NOT exited — it continues riding. The trailing stop keeps breathing.

The runner is NOT a swap. It's a phase transition in stop management. ONE settlement event per trade.

### Settled Grace
Trailing stop fires in runner phase. Exit amount > principal → residue is permanent gain. Principal returns to available. Residue compounds.

### Settled Violence
Safety stop fires (in either active or runner phase). Remaining value returns to available. Loss bounded by reservation.

## Breathing Stops

Every candle, step 3c re-queries the [[Exit Observers|exit observer]]: "for THIS thought in THIS market context, what are the optimal distances NOW?"

The stops are not set-and-forget. They adapt. Tighter when the market says tighten. Wider when it says breathe. This continuous adaptation IS the mechanism for maximizing [[The Treasury|residue]] — the trade captures as much as the market will give.

## The Update Cost Problem

In-memory: update cost is zero — update every candle, no reason not to.

On-chain: each update is a transaction with gas cost. Micro-adjustments that cost gas but don't materially change the stop levels produce [[Grace vs Violence|Violence]]. The optimal update frequency should be **learned**, not hardcoded. The reckoners can observe whether updates of a given magnitude produced Grace or Violence after accounting for cost.

## One Entry, One Exit

Two swaps total: entry and exit. Each swap incurs `swap-fee + slippage`. The edge must exceed the venue cost rate for the trade to be worth taking.

The runner phase does NOT involve a swap. It is the trailing stop widening while the trade continues. The trade closes over its own price history — a pure function of stops and prices.

## Related Concepts

- [[Grace vs Violence]] — the outcomes trades settle to
- [[The Treasury]] — manages capital reservation and settlement
- [[The Four-Step Loop]] — steps 1 (resolve) and 3c (update triggers) manage lifecycle
- [[Exit Observers]] — provide the breathing stop distances
- [[Brokers]] — own the proposals that become trades
- [[Paper Trades]] — the hypothetical counterpart with the same learning mechanics
