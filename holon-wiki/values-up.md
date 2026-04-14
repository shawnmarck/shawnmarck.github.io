# Values Up

> **TL;DR:** Functions return side-effects as values. No queue parameters. No shared mutation during parallel phases. Cache misses, log entries, propagation facts — all flow up through return types.

## The Principle

> Values up, not queues down.

This is the enterprise's core architectural principle. Every function returns its outputs as values. Side-effects are not pushed through queues or callbacks — they are collected and returned.

```
// NOT this:
fn process(candle: Candle, queue: &mut Queue)  // shared mutation

// THIS:
fn process(candle: Candle) -> (State, Vec<LogEntry>, Vec<CacheMiss>)  // values
```

## What Flows Up

- **Cache misses** — composition cache lookups that failed, returned for insertion between candles
- **Log entries** — glass-box records of everything that happened (proposals, fundings, settlements, propagations)
- **Propagation facts** — what each observer needs to learn from resolved trades
- **Misses** — database write batches, queue messages, all returned as values

## Why It Matters

### Testability
Pure functions with value returns are trivially testable. Given the same inputs, the same outputs. No mocking queues. No simulating shared state.

### Parallelism
During parallel phases (step 3a — tick brokers), there is NO shared mutable state. Each broker is a pure function. The results are collected (map-and-collect), then applied sequentially.

### Determinism
Given the same history and the same candle, the enterprise produces the same output. The loop is referentially transparent. Every run is reproducible.

### Composition
Values compose. Functions that return values can be chained, mapped, collected. Functions that push to queues create entangled dependency graphs.

## The One Seam

`ctx` is immutable during each candle — except for one seam: the ThoughtEncoder's composition cache. During encoding (parallel), the cache is read-only and misses are returned as values. Between candles (sequential), the enterprise inserts the collected misses.

This seam is bounded by the fold boundary. It's not a violation of "values up" — the cache updates ARE values collected during the parallel phase and applied between phases.

## The Binary Writes the Ledger

The enterprise produces values. The binary writes the ledger. This separation is deliberate — the enterprise is pure logic. The binary is I/O. The tests exercise the enterprise. The production binary adds file writes and progress display.

## Related Concepts

- [[The Four-Step Loop]] — where values flow up through each phase
- [[The Enterprise]] — the coordination plane that collects values
- [[The Disposable Machine]] — values-up enables the delete-and-regenerate cycle
- [[Wat VM]] — specifications that enforce values-up in their structure
