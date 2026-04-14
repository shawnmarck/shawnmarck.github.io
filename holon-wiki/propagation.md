# Propagation

> *Values flow up, not queues down. When a trade resolves, the broker returns facts — it doesn't push them. The post distributes. The observers learn.*

Propagation is how learning flows through the system. When a trade resolves (Grace or Violence), the outcome must reach every observer that contributed to the decision. But holon-lab-trading doesn't use callbacks, event buses, or side-effect channels. It uses return values.

## The Mechanism

1. A trade resolves → the [[Brokers|broker]] records the outcome
2. The broker creates **PropagationFacts** — encoded thought vectors carrying the Grace/Violence label
3. These facts are returned as values (not sent through a queue) from `.tick()`
4. The [[The Post|post]] receives the propagation facts and distributes them to the correct observers
5. Each observer's [[The Reckoner|reckoner]] accumulates the fact into its Grace or Violence buffer

The key property: **no shared mutation during parallel phases.** During the tick phase, all N×M brokers run on separate threads. None of them writes to shared observer state. They return propagation facts as values. Only after all brokers finish does the post sequentially apply the facts to observers.

## What Gets Propagated

When a trade resolves, the broker propagates back to:
- **Its market observer** — the direction prediction was right or wrong
- **Its exit observer** — the distance predictions were right or wrong
- **Its own reckoner** — the overall trade was Grace or Violence

Each observer accumulates these outcomes independently. A single market observer might serve 4 brokers — it receives propagation from all 4, learning from each independently.

## Why "Values Up"

This is the [[Values Up]] principle in action. Side-effects don't flow down through shared state. They flow up through return types. The broker doesn't call `observer.learn(outcome)`. It returns `(thought, outcome)` and the caller handles it.

This eliminates entire classes of bugs: race conditions, callback hell, ordering dependencies. If you need to know what happened, look at the return value. It's right there.

## Related Concepts

- [[Grace vs Violence]] — the labels being propagated
- [[Brokers]] — the source of propagation facts
- [[The Reckoner]] — the destination that accumulates them
- [[The Four-Step Loop]] — propagation happens in step 3c
- [[Values Up]] — the architectural principle
- [[The Post]] — the distributor of propagation facts
