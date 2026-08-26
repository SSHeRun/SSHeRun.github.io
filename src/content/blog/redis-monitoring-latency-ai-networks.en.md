---
title: 'Monitoring Looks Fine, Answers Get Worse: Latency Is a Correctness Problem in AI Networks'
description: 'Flat error rates hide thinner RAG context and truncated agent loops. Why TTFT, tail latency, per-stage retrieval metrics, and SLOs matter for answer quality—not just speed.'
pubDate: '2026-08-26'
heroImage: '../../assets/cover-redis-monitoring-latency-ai-networks-en.jpg'
tags: ['Redis', 'AI', 'SRE', 'RAG']
lang: en
translationKey: 'redis-monitoring-latency-ai-networks'
---
Your dashboards look healthy, but users say the AI is getting dumber. That pairing is common in production.

[Redis's post](https://redis.io/blog/monitoring-latency-ai-networks/) isn't really about shaving P99 from 200ms to 150ms. The point is: **in AI networks, latency is often the early signal that answer quality is degrading.** Retrieval and serving systems degrade gracefully under load—search a cached subset, fall back to a cheaper ranker, skip reranking. Requests still return 200, error rates stay flat, but the model gets thinner context.

## Latency is a family of metrics, not one number

![Monitoring looks fine but answers degrade](../../assets/inline-redis-monitoring-latency-ai-networks-01.jpg)

At minimum, split a single LLM call into:

| Metric | What it captures |
|--------|------------------|
| **TTFT** | Queue + prefill + network; long prompts hurt here |
| **ITL** | Gaps between streamed tokens; chat should feel like reading speed |
| **End-to-end** | Full path: prefill + decode + retrieval/tools |
| **P95 / P99** | What your slowest users actually feel |

Prefill reads the whole prompt once; decode writes token by token—they slow down for different reasons under load. **One average hides regressions.**

Research shows healthy medians can still leave ~1% of requests waiting nearly two seconds for the first token. Typical target thinking: TTFT under ~500ms, ITL in tens of milliseconds—**set targets per metric so one can't hide inside another.**


![Tail latency and correctness](../../assets/inline-redis-monitoring-latency-ai-networks-03.jpg)

## Why latency is correctness, not just speed

Overloaded AI systems rarely hard-fail. They quietly get worse:

- Search a memory subset instead of the full index
- Switch to a faster, less accurate ranker
- Retries amplify overload into cascading failures

**RAG** follows the same tradeoff: ANN indexes, caching, lighter retrievers cut latency at some accuracy cost. Slightly worse retrieval → worse context → wrong answers even when the pipeline is "green."

**Agents** make it obvious: a self-correcting architecture kept its edge below roughly 25k documents/day throughput; past that, **timeout constraints truncated correction loops** and most of the advantage over a simpler pipeline vanished. No crash—just dumber.

SRE-aligned teams treat a missed latency SLO as a **failed request**. Slow answers and wrong answers land in the same bucket.


![What monitoring should change](../../assets/inline-redis-monitoring-latency-ai-networks-04.jpg)

## Where latency hides

### Retrieval (often underestimated)

In one RAG pipeline characterization, retrieval was **41%** of end-to-end latency:

- Embeddings: queueing under concurrency
- **Reranking**: the biggest variable; cross-encoder cost swings with candidate count, batching, and hardware—profile it separately

### Inference and tools

In agentic coding, tool execution can dominate when generation and tools must run in sequence. **Per-API latency lies**—measure program- or turn-level end-to-end.

### Cross-service fan-out

If each dependency has a 1% P99 of 1s, fan-out to 100 services pushes the chance of a slow overall request to about **63%** (tail at scale). Embeddings, vector indexes, gateways, tool APIs—every RPC adds serialization, transport, and queueing.

## What to instrument

![Latency curves and tail latency](../../assets/inline-redis-monitoring-latency-ai-networks-02.jpg)

**OpenTelemetry GenAI** (experimental) is a reasonable start:

- `gen_ai.client.operation.duration` — LLM histograms by model
- `gen_ai.server.time_per_output_token` — decode-phase latency

Client-side TTFT isn't fully standardized yet—most teams track it themselves.

**Golden signals:** for streaming apps, measure **how slow failures are**—slow failures hurt more than fast ones.

**Percentiles over averages:** one Google service averaged ~50ms while 5% of requests were 20× slower; the average looked fine. P50 = typical; P95/P99 = worst case.

**RAG:** instrument embedding, search, and reranking **separately** so one slow stage doesn't hide inside end-to-end.

## Two ways to protect the retrieval budget

1. **Semantic caching** — similar queries skip the LLM on hit; great for FAQ-style traffic, weak for open conversation—measure hit rate before budgeting ROI.
2. **Low-latency vector search** — Redis cites ~200ms median on billion-vector workloads at 50 concurrent top-100 queries (with RTT); LangCache scenarios report up to ~15× faster hits and ~73% lower inference cost.

The post pitches **Redis Iris** as a managed context engine (semantic cache + vector search) on Redis you may already run—product-forward, but the engineering takeaway holds: **don't let retrieval eat the whole latency budget.**

## Institutionalize it: SLOs and error budgets

- Layered thresholds: loose for most requests, strict for the tail
- Exhausted error budgets can trigger **feature freezes** (reliability fixes only)
- Alert on **budget burn rate**, not raw thresholds alone

GitHub cut Copilot's default toolset from 40 to 13 and saw **~400ms lower average latency** in A/B tests—cutting capability to protect latency is a product decision rooted in reliability.

## Bottom line

Latency in AI networks spans TTFT, ITL, end-to-end, and tail percentiles across retrieval, inference, tools, and fan-out. When any stage slips, systems often trade answer quality for availability. Monitor per stage, at the tail, with SLOs attached—before users notice the regression.

**Source:** [Why it's important to monitor latency in AI networks](https://redis.io/blog/monitoring-latency-ai-networks/)
