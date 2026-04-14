# Window Sampler

> *Every candle is not created equal. The window sampler picks a random subset for each training cycle — preventing overfitting and enforcing generalization.*

The Window Sampler controls which candles each observer uses for training. Instead of training on the most recent N candles (which overfits to current regime), it samples randomly from a sliding window.

## How It Works

Each [[Market Observers|market observer]] has its own WindowSampler. Given a window of recent candles (configurable size), the sampler picks a random subset of K candles per training cycle. The seed is per-observer, so different observers see different subsets of the same data.

```
window: [candle_1, candle_2, ..., candle_100]
sample: [candle_7, candle_23, candle_42, candle_89, candle_95]  // K=5
```

Each sample is used to compute training thoughts. The [[The Reckoner|reckoner]] accumulates Grace and Violence vectors from these samples, then computes the [[Discriminant]].

## Why Random Sampling?

Training on the full window would overfit to recent data. If the last 100 candles are all uptrending, the reckoner learns "everything is Up" — and gets destroyed when the regime changes.

Random sampling ensures the reckoner sees a **representative mix** of market conditions from the recent window. It's a cheap form of regularization — no dropout, no weight decay, just don't look at everything every time.

## Per-Observer Independence

Each observer gets its own sampler with its own seed. Two observers with the same [[Lenses|lens]] but different seeds will see different candle subsets. This is deliberate — it creates diversity in the N×M [[Brokers|broker]] grid. Two brokers using the same market observer will have slightly different training data, producing slightly different predictions.

## Related Concepts

- [[The Reckoner]] — uses window samples for training
- [[Market Observers]] — each has its own window sampler
- [[Discriminant]] — learned from sampled candles
- [[Noise Subspace]] — learns the background distribution of all thoughts
