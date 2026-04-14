# The Proposal System

> **TL;DR:** What a post produces, what the treasury evaluates. A proposal bundles: composed-thought, distances, edge, side, prediction, and provenance. The treasury sorts by edge and funds proportionally.

## What It Is

A proposal is the output of a [[Brokers|broker]] during step 2 (compute+dispatch) of [[The Four-Step Loop|the four-step loop]]. It represents: "this team of observers, thinking through these lenses, about this market context, proposes this trade."

## The Proposal Structure

```
Proposal:
  composed-thought: Vector    — market thought + exit facts bundled
  distances: Distances        — trail and stop percentages (from exit observer)
  edge: f64                   — broker's conviction-accuracy at current conviction
  side: Side                  — :buy or :sell (derived from Up/Down prediction)
  source-asset: Asset         — what is deployed (e.g. USDC)
  target-asset: Asset         — what is acquired (e.g. WBTC)
  prediction: Prediction      — broker's Grace/Violence verdict at proposal time
  post-idx: usize             — which post produced this
  broker-slot-idx: usize      — which broker proposed this
```

## The Message Protocol

Every learned message carries three semantic values: `(thought: Vector, prediction: Prediction, edge: f64)`.

- **Thought** = what you know
- **Prediction** = what you think will happen
- **Edge** = how accurate you are when you predict this strongly

Edge ∈ [0.0, 1.0]. 0.0 when unproven. 0.50 = noise. Above = correlated. The consumer encodes the edge as a fact and is free to gate, weight, sort, or ignore.

Opinions carry credibility. Data (candles, raw facts) does not.

## Side vs Direction

Side (`:buy`/`:sell`) is the trading **action**. Direction (`:up`/`:down`) is the measured **outcome**. They are related (Up → Buy, Down → Sell) but distinct types:
- One is a decision (what the trader does)
- The other is a measurement (what the price did)

Side appears on proposals and trades. Direction appears in propagation and resolution.

## From Proposal to Trade

When the [[The Treasury|treasury]] funds a proposal:
1. Capital is reserved (available → reserved)
2. A TradeId is assigned
3. A TradeOrigin is created (archaeological record: thought + prediction at funding time)
4. The trade enters the [[Trade Lifecycle|active phase]]

The TradeOrigin preserves the proposal's composed-thought and prediction for later propagation — when the trade resolves, the system can trace back to what was believed at entry.

## Rejection

Proposals below the treasury's edge threshold are rejected. The rejection is logged as a `LogEntry::ProposalRejected` with the broker-slot-idx and reason. Rejection is not punishment — it's "not yet proven." The broker continues learning from papers and will propose again when it has more edge.

## Related Concepts

- [[Brokers]] — produce proposals
- [[The Treasury]] — evaluates and funds proposals
- [[The Four-Step Loop]] — step 2 produces proposals, step 4 funds them
- [[Trade Lifecycle]] — what funded proposals become
- [[Conviction-Accuracy Curve]] — edge comes from the broker's curve
- [[Grace vs Violence]] — what the broker's prediction targets
