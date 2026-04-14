# The Treasury

> **TL;DR:** Pure accounting. Available vs reserved capital. Funds proportionally to edge — more conviction-accuracy, more capital. Bounded loss: capital reserved at funding, principal returns at finality. The residue IS the growth.

## What It Is

The treasury manages wealth. Not a cash balance — wealth. Two accounts:

- **Available capital** — ready for deployment
- **Reserved capital** — locked in active trades

The denomination (USD today, could be anything) is how the treasury counts. The treasury is pair-agnostic — it holds balances per asset, and any post for any pair can request funding.

## How It Funds

1. Receive proposals from all posts
2. Sort by **edge** — the broker's conviction-accuracy at its current conviction level
3. Fund proportionally to edge — more edge, more capital
4. Bounded loss: reserve exactly the proposed amount. The maximum loss is known at funding time.

The treasury doesn't decide based on predictions. It decides based on **track record**. A broker with 65% accuracy at high conviction gets more capital than one with 55% accuracy at the same conviction, regardless of what they're predicting.

## The Three Trigger Paths

A trade has a phase lifecycle with three possible resolution paths:

```
Active → safety-stop fires → :settled-violence  (bounded loss)
Active → price moves favorably → :runner         (principal covered, ride continues)
Runner → trailing-stop fires → :settled-grace    (residue is permanent gain)
Runner → safety-stop fires → :settled-violence  (but principal already covered)
```

### Settled Grace

When the trailing stop fires in runner phase:
- Exit swap recovers the principal
- Remainder is **residue** — permanent gain
- Principal returns to available capital for redeployment
- Residue is never withdrawn — it compounds

### Settled Violence

When the safety stop fires (in either active or runner phase):
- Loss bounded by the reservation amount
- Remaining capital returns to available
- No residue. No permanent gain. But no unbounded loss either.

## The Number Flow (Concrete Example)

```
Entry:  $50 USDC → 0.0005 WBTC at $100,000/BTC (one swap, minus fees)

Price rises to $120,000. Trailing stop fires at $115,000.
Position value: 0.0005 BTC × $115,000 = $57.50

Exit swap: enough WBTC → USDC to recover $50 principal
  = 50 / 115,000 ≈ 0.000435 WBTC → $50 USDC

What remains:
  $50 USDC       → available (principal, redeployed next candle)
  ~0.000065 WBTC → available (residue, ~$7.50, permanent gain)

Both sides of the pair grew. The residue IS the target asset.
```

## The Pair Doesn't Matter

```
(SPY, GOLD):      deploy SPY → acquire GOLD. Recover SPY. Residue is GOLD.
(GOLD, SPY):      deploy GOLD → acquire SPY. Recover GOLD. Residue is SPY.
(USDC, WBTC):     deploy USDC → acquire WBTC. Recover USDC. Residue is WBTC.
```

Any pair. Both directions. Deploy capital. Ride the trade. Recover capital. The remainder is wealth. The residue compounds.

## Costs

Each trade is two swaps: entry and exit. Each swap incurs:
- `swap-fee` — venue fee (configurable, default 0.0010 = 0.1%)
- `slippage` — execution cost (configurable, default 0.0025 = 0.25%)

The edge must exceed the venue cost rate for the trade to be worth taking. The curve already accounts for this — Grace outcomes include fees.

## Residue

Residue is the permanent gain that accumulates over time. The enterprise never withdraws residue — it compounds. The accumulation model: deploy, recover principal, keep the residue. This is how the system grows wealth over time.

## Related Concepts

- [[Grace vs Violence]] — the outcomes the treasury measures
- [[Brokers]] — produce proposals the treasury evaluates
- [[The Proposal System]] — the data structure the treasury receives
- [[Trade Lifecycle]] — the phase transitions the treasury manages
- [[The Post]] — submits proposals to the treasury
- [[The Enterprise]] — owns the treasury and routes settlements
- [[The Four-Step Loop]] — step 4 (collect+fund) is the treasury's phase
