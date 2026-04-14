# Services

> *Three message patterns — Queue, Topic, Mailbox — are the entire instruction set of the [[Wat-VM]]. Programs only see queues.*

The wat-vm's ISA has three instructions. Not three hundred. Three. Every interaction in the system — between programs, between programs and the cache, between programs and the database — uses exactly one of these three patterns.

## Queue — 1→1 Point-to-Point

A thin wrapper around `crossbeam::channel`. One sender, one receiver.

```rust
let (tx, rx) = queue::<Message>(bounded: 64);
tx.send(msg);  // blocks if full (backpressure)
rx.recv();     // blocks if empty
```

Backpressure is explicit. A bounded queue with capacity 64 means: if the receiver is slow, the sender waits. This prevents unbounded memory growth and creates natural flow control.

When the sender is dropped, the receiver eventually gets `Disconnected`. This isn't an error — it's the **shutdown signal**. Programs detect shutdown by watching for disconnection, not by receiving a special "stop" message.

## Topic — 1→N Fan-Out

One producer, N consumers. Each consumer gets a copy of every message.

Internally: one bounded input queue + a fan-out thread. The fan-out thread reads from the input, clones the message, and writes to N output queues.

**Backpressure propagates.** If one subscriber is slow, the fan-out thread blocks on that subscriber's queue. All other subscribers wait too. This is intentional — it prevents the fast subscribers from getting arbitrarily far ahead of the slow one.

When the input sender is dropped, the fan-out thread exits, which drops all output senders, cascading disconnection to all subscribers.

## Mailbox — N→1 Fan-In

N producers, one consumer. Messages interleave in arrival order.

Internally: uses `crossbeam::Select` across N input receivers. The mailbox thread polls all inputs, forwards whichever is ready to a single output queue. Tracks which inputs are still alive; removes dead ones from the select set.

All inputs must disconnect for the consumer to see `Disconnected`. If 3 of 4 senders are dropped, the mailbox still reads from the 4th.

## Programs Only See Queues

Topics and Mailboxes are **plumbing** — they exist during the wiring phase. Programs' function signatures accept `QueueSender<T>` and `QueueReceiver<T>`. A program has no idea whether its input comes from a direct queue, a topic output, or a mailbox output.

This is the [[Wat-VM]]'s key abstraction: **everything is a queue.** The same way Plan 9 makes everything a file descriptor, the wat-vm makes everything a queue.

## Related Concepts

- [[Wat-VM]] — the runtime that hosts services
- [[Programs]] — the consumers and producers of services
- [[Values Up]] — why return values instead of shared state
- [[The Four-Step Loop]] — how services connect the pipeline stages
