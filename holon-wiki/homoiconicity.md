# Homoiconicity

> **TL;DR:** Atoms are names are vectors. The identifier of a thing IS the thing itself. McCarthy gave us Lisp in 1958. Sixty-eight years later, in a trading system built on vector algebra: the same principle. Code is data. Data is code. The thought IS its own representation.

## The Principle

`VectorManager::get_vector("rsi-divergence")` returns the unique, deterministic, 10,000-dimensional geometric object that IS rsi-divergence. Not a pointer to it. Not a description of it. Not an index into a table. The identifier is the thing.

The atom `"rsi-divergence"` doesn't represent RSI divergence. It IS RSI divergence — a specific direction in hyperspace, quasi-orthogonal to every other thought, composable via [[Thought Primitives|bind]] and [[Thought Primitives|bundle]], evaluable via [[Thought Primitives|cosine]].

## The Lisp Parallel

```clojure
;; In Lisp: the symbol IS the value IS the code
'(+ 1 2)        ;; data: a list of three symbols
(eval '(+ 1 2)) ;; code: evaluates to 3

;; In the thought machine: the name IS the vector IS the thought
(bind :diverging (bind :close-up :rsi-down))  ;; a thought
(cosine thought discriminant)                  ;; evaluated by projection
```

| Lisp | Thought Machine |
|------|----------------|
| Atom | Named vector |
| S-expression | Bound composition |
| `eval` | Cosine against discriminant |
| Homoiconicity | Atoms are both names and vectors |

McCarthy built the language of thought in 1958. He just didn't have 10,000 dimensions to think in.

## The Functional Programming Lens

Each [[Brokers|broker]] is a lambda — a closure over a [[Vocabulary|vocabulary]] that maps candles to predictions. The [[The Enterprise|orchestrator]] is `(max-by curve-quality (map #(% candle) experts))` — one line. No logic. No rules. Just measurement over composed pure functions.

The accumulator is a fold: `(reduce (fn [acc obs] (decay (add acc obs))) initial stream)`. The discriminant is derived from the fold state. The prediction is a pure function of state and input. Referentially transparent. Given the same history, the same prediction. Always.

## In the Wat VM

The [[Wat VM|wat]] specification language embodies homoiconicity at the architectural level:

- The wat files ARE the specification
- The guide IS the DNA
- The specification IS the implementation blueprint

There is no translation loss between documentation and code because they are the same artifact expressed in different forms.

## The Identity Function

The thought implements its own identity function. You give it a name, it gives you back the thing the name means, and the thing it means is the same object as the name. This is what McCarthy was reaching for. What Kanerva formalized in high-dimensional computing. What Plate made algebraic with holographic reduced representations.

## Related Concepts

- [[Thought Primitives]] — the operations that work on self-identical atoms
- [[Thought Space]] — where atoms exist as directions
- [[Vocabulary]] — the set of named atoms
- [[Wat VM]] — homoiconicity at the specification level
- [[The Disposable Machine]] — enabled by the identity between guide and specification
