---
title: 'DeepSeek Engram: conditional memory as a new sparsity axis'
description: 'DeepSeek Engram adds O(1) lookup for the "conditional memory" MoE never had. At the same parameter and compute budget, reasoning and long-context often rise more than rote knowledge.'
pubDate: '2026-08-26'
heroImage: '../../assets/cover-deepseek-engram-conditional-memory-en.jpg'
tags: ['LLM', '工程']
lang: en
translationKey: 'deepseek-engram-conditional-memory'
---

DeepSeek's [Engram](https://arxiv.org/abs/2601.07372) paper is unusually direct: MoE solved *conditional compute*, but Transformers still lack a native *knowledge lookup* primitive. A lot of early layers spend FLOPs pretending to be a table. **Conditional memory** is the missing axis.

Code is open: [deepseek-ai/Engram](https://github.com/deepseek-ai/Engram).

## Language is two jobs

Language modeling does at least two different things:

1. **Compositional reasoning** — needs deep, dynamic compute
2. **Local / static patterns** — entity names, stock phrases, fixed collocations. More dictionary than differential equation

Classic n-grams still work because the second class is a natural **O(1) lookup**. A standard Transformer has no lookup primitive, so it stacks Attention and FFNs to *rebuild a static table at runtime*. Expensive, and it burns depth.

Engram's stance:

- **Conditional compute (MoE)**: activate experts on demand
- **Conditional memory (Engram)**: look up static embeddings from local context

Complementary, not substitutes.

## How Engram works

The module is four steps:

1. **Tokenizer compression**: normalize equivalent tokens (case, NFKC, etc.) to raise semantic density (the paper says a 128k vocab effectively shrinks ~23%).
2. **Multi-head hashing**: multi-order n-grams plus several hash heads fetch embeddings, avoiding a combinatorial explosion of explicit parameters.
3. **Context gating**: current hidden state as Query, static memory as Key/Value. If the semantics do not align, the gate closes — collisions and polysemy get suppressed.
4. **Short causal conv + residual**: fuse back into the trunk. The module is inserted only at selected layers (layers 2 and 15 in the experiments), which also leaves a compute window for system-level prefetch.

The design that matters: **the retrieval address is a deterministic function of token IDs**. Unlike MoE, it does not route on a runtime hidden state. At inference you can park a huge table in host memory, prefetch asynchronously, and overlap with the first few layers. The paper claims ~100B-parameter tables offloaded with &lt;3% overhead. That is a real cost story: not every parameter has to live in HBM.

## How to split the sparsity budget: a U-shaped law

Hold total parameters and activated FLOPs fixed. How much idle sparse budget goes to MoE experts vs Engram tables?

The result is a stable **U-shape**:

- All MoE (ρ=1): the model is forced to *compute* static patterns
- All memory: you starve dynamic reasoning
- Optimum around **ρ ≈ 75%–80%** — move about 20%–25% of the sparse budget to Engram

If memory can grow without bound, larger tables give a log-linear drop in validation loss. Memory is an independently scalable axis that barely adds per-token FLOPs.

## Large-model results: reasoning rises more than you'd expect

Strict comparison at 262B tokens, ~3.8B activated:

| Model | Total params | Engram | Notes |
|-------|--------------|--------|-------|
| MoE-27B | 26.7B | - | 72 routed experts |
| Engram-27B | 26.7B | 5.7B | experts 72→55, ρ≈74% |
| Engram-40B | 39.5B | 18.5B | same activation, bigger table |

**Engram-27B vs MoE-27B (same params, same FLOPs), selected gains:**

- Knowledge: MMLU +3.0, CMMLU +4.0
- Reasoning: BBH +5.0, ARC-Challenge +3.7, DROP +3.3
- Code / math: HumanEval +3.0, MATH +2.4, GSM8K +2.2

A memory module "should" help memorization. The larger lifts show up in reasoning and code. The mechanistic story: early layers drop the job of rebuilding static patterns, which is equivalent to *deepening the effective net* for hard reasoning. Once local dependence is a lookup, attention can watch the global picture.

At 32k context the gap gets louder:

- Multi-Query NIAH: 84.2 → **97.0**
- Variable Tracking: 77.0 → **89.0**

## What product people should take

1. **The sparsity story upgrades**: the next frontier sparse models are likely *experts + memory tables*, not just a bigger MoE.
2. **A budget heuristic**: at the same scale, giving ~1/5–1/4 of idle parameter budget to static memory often beats dumping it all on experts.
3. **Lookup must be gated**: raw n-grams are not enough on average; context gating is the quality lever.
4. **Long context is not only a longer window**: externalizing local patterns is an architectural unload — more on-target than just adding context length.
5. **Cost structure**: deterministic addresses + host prefetch let "lots of parameters, little compute" live in DRAM instead of GPU HBM.

Boundaries: Engram is **static sparse parameters inside the model**, not a RAG corpus. They can coexist; they solve different layers. Engram-40B does not always beat 27B at the same token budget — the authors blame under-training. The memory axis still needs enough data.

## Bottom line

Engram's contribution is not "another embedding trick." It elevates **conditional memory** to a modeling primitive next to MoE, and the U-shaped allocation law gives a usable capacity split. If you care about agents, long context, and inference cost, this paper is more worth reading than another leaderboard dump.

- Paper: https://arxiv.org/abs/2601.07372
- Code: https://github.com/deepseek-ai/Engram

## Related posts

- [[wideseek-ai-cp|Wide + Deep: why a 4B model can punch up]]
- [[software-engineering-splits-three|Software engineering is splitting into three layers]]
