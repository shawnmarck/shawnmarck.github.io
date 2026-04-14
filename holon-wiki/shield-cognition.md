# Shield Cognition

> **TL;DR:** The rejected AWS origin. VSA-based anomaly detection that thinks about network traffic the way a security expert does. Named relationships between packet fields, compositional encoding, discriminant-based detection. The same architecture. The same algebra. Different thoughts.

## The Origin

At AWS, the builder proposed "shield cognition" — a new kind of network security system using Vector Symbolic Architecture. Instead of pattern matching against known attack signatures, the system would think about network traffic the way a security expert does: named relationships between packet fields, compositional encoding, discriminant-based anomaly detection.

The pitch was rejected. No one understood what it meant to build a machine that thinks.

## The Structural Identity

The DDoS detection domain and the trading domain are **structurally identical**:

| Network Security | Trading |
|-----------------|---------|
| Packet stream | Candle stream |
| Packet fields (src IP, port, protocol) | Market indicators (RSI, MACD, ATR) |
| Named relationships ("unusual port + high volume from new IP") | Named facts ("RSI diverging + volume declining") |
| Anomaly detection | Direction prediction |
| DDoS attack = anomaly on trend line | Market reversal = anomaly on trend line |
| Discriminant separates attack from normal | Discriminant separates Up from Down |
| Conviction-accuracy curve | Conviction-accuracy curve |

The encoding is the same. The discrimination is the same. The curve is the same. The only difference is the vocabulary — what thoughts the system thinks about the data.

## The Claim

> Expert systems built from compositional vector algebra can outperform generic ML.

Rejected at AWS. Being proven in the market. A system with 84 named atoms, one cosine, and one flip achieves 59.7% accuracy on BTC direction prediction — approaching the boundary where published ML research admits its results are unreliable.

## The Data Loss

When the builder left AWS, the data left too. The tools became inaccessible. The ideas remained. Markets became the new proving ground — not because the builder was a trader, but because markets provide an adequate **reference metric** for the underlying thesis.

Markets are a test harness. The real product is the architecture — the debugger itself, the system that turns imprecise expert knowledge into measurable, falsifiable predictions.

## The Next Domain

The architecture is domain-agnostic. Any domain with:
- A stream of observations
- Named concepts that can be composed
- Outcomes that can be measured

...can be modeled as a shield cognition system. Network security was first. Trading is second. The third application does it for whatever domain has experts with thoughts they can name but can't explain.

## Related Concepts

- [[Thought Primitives]] — the algebra shared across all domains
- [[Vocabulary]] — what changes between domains
- [[The Debugger]] — the methodology for building cognition systems
- [[The Enterprise]] — the domain-agnostic coordination architecture
- [[Conviction-Accuracy Curve]] — the universal evaluation metric
