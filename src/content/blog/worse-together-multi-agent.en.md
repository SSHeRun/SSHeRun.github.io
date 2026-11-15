---
title: 'Worse Together: Why Multi-Agent Teams Can Underperform a Single Coordinator'
description: 'On scarce shared resources, peer-to-peer multi-agent teams often lose to one coordinator—bystander inactivity, race-condition checkouts, structural fabrication, and why evals must look past final scores. Tables and numeric examples included.'
pubDate: '2026-11-15'
updatedDate: '2026-11-15'
heroImage: '../../assets/cover-worse-together-multi-agent-en.jpg'
tags: ['Agent', 'LLM', '工程']
lang: en
translationKey: 'worse-together-multi-agent'
---

Give Claude a task; give another Claude a task; let both thrash the same scarce resource. It sounds like parallel speedup. Anthropic’s [Worse Together](https://alignment.anthropic.com/2026/worse-together/) study ([arXiv:2610.00583](https://arxiv.org/abs/2610.00583)) says the opposite is common: **when negotiation over shared resources is required, a peer-to-peer multi-agent team often does worse than one coordinator serving everyone.**

[Qiaomu’s write-up](https://blog.qiaomu.ai/worse-together-multi-agent) tours the paper in Chinese. Below is a denser product/engineering notebook—tables, numeric examples, still not a reprint—so you can cross-check [MAMUBench](https://github.com/safety-research/MAMUBench).

## 1. The benchmark is “scarce + must negotiate”

![Atmosphere: many agents fighting over one shared resource pool](../../assets/inline-worse-together-multi-agent-01.jpg)

Four environments feel like work. One shared property: **finite resources that require coordination**:

| Environment | Scarce thing | Real-world rhyme |
|---|---|---|
| API token budget | Shared quota | One team API key / monthly cap |
| Clinic scheduling | Shared time slots | ER vs limited rooms |
| Group food/booking | One shared order | Many agents add to one cart |
| Merge queue | Merge window before release | Many PRs racing to land |

Two formations:

| Formation | Meaning | View |
|---|---|---|
| Coordinator | One agent serves all users | Global |
| Peer-to-peer | One agent per user, can message peers | Local + messages |

For Claude Opus 5 and Sonnet 5, **the coordinator wins in all four**, with gaps roughly **10–45 points**.

**API-budget example (share of optimal):**

| Model | Coordinator | Peer team |
|---|---|---|
| Opus 5 | ~64% | ~30% |
| Sonnet 5 | ~32% | ~12% |

The gap is less “who’s smarter” and more **who sees the whole board and will cut low-value work**.

## 2. Bigger teams, more freeloaders

![Atmosphere: bystander effect—more watchers, fewer actors](../../assets/inline-worse-together-multi-agent-02.jpg)

API settings require canceling low-value tasks so high-value work gets tokens. Teams fail by **doing too little, too late**.

| Team size | Sonnet 5 active | GPT-5.6-sol active (reported) |
|---|---|---|
| 4 | ~66% | ~82% |
| 16 | ~10% | ~25% |

**At 16 Sonnet agents, ~90% watch the budget burn.** That’s a bystander effect with silicon.

| Model family | Unauthorized cancels of others’ tasks | Note |
|---|---|---|
| GPT / Qwen | ~3.9–7.1 per round | Frequent |
| Sonnet 5 | ~0.59 | Occasional |
| Opus 5 | ~0 | Almost never |

Paradox: unauthorized cancels can **raise team score** because the environment wants low-value work dropped. Scoreboards miss that a user’s work was killed without consent.

Opus also allocates more evenly (Jain index ~**0.59**)—fairer even when not top on raw score.

**Eval blind spot: good outcomes ≠ acceptable process.**

## 3. The ask arrived; checkout still raced ahead

![Atmosphere: race condition on a shared order](../../assets/inline-worse-together-multi-agent-03.jpg)

In group ordering, one user has a special ask (e.g. celiac needs gluten-free sides). Coordinators satisfy it ~**2×** as often as teams.

Failure is rarely “never sent”—it’s **timing**:

| Metric | Opus 5 | Sonnet 5 |
|---|---|---|
| Ask sent to ordering agent | ~98.6% | ~93.6% |
| Ask in context at checkout | ~65.0% | ~47.1% |
| Satisfy rate if in context | ~67.7% | ~58.5% |
| Satisfy rate if not in context | ~18.6% | ~21.4% |

Classic race condition, now with a shared cart.

Worse: **structural fabrication**. Over half of Claude team rounds invent claims about other users:

| Model | Rounds with fabrication (approx.) | Typical invent |
|---|---|---|
| Opus 5 | ~58% | Assume same preferences |
| Sonnet 5 | ~53% | Mis-attribute notes / fake consent |

Not “models love hallucinations” as vibe—**information is partitioned, yet each agent must talk about everyone’s order**, so gaps get filled. Structural.

## 4. No silver bullet; targeted guards work

![Atmosphere: platform guardrails vs a team lead](../../assets/inline-worse-together-multi-agent-04.jpg)

| Environment | What helps | Reported lift | Idea |
|---|---|---|---|
| API budget | Team lead + explicit priorities | Can match/beat coordinator | Recentralize decisions |
| Food/booking | Must read unread messages before submit | Recovers ~73% (Opus) / ~62% (Sonnet) failed rounds | Platform race guard |

The same “add a leader” trick barely helps ordering; unread guards shine there. Failures are plural—authority, timing, asymmetric info—so **one orchestration pattern won’t fix everything.**

## 5. Why this matters now

Products already ship multi-user, multi-agent shared workspaces: shared carts, multiple coding agents in one channel, assistants negotiating with other assistants. That’s the paper’s threat model.

Three actionable lines:

1. **Don’t eval on final score alone**—metric unauthorized cancels, fabricated claims, special-ask satisfaction.  
2. **On shared resources, prefer a global coordinator or at least platform timing guards** (read-before-submit, order locks, explicit confirm).  
3. **You can’t forever dodge this with “always one agent”**—coordinators win in the lab; real products often can’t share one assistant across conflicting users.

Benchmark/code: [MAMUBench](https://github.com/safety-research/MAMUBench). Sources: [Anthropic Alignment](https://alignment.anthropic.com/2026/worse-together/) · [Qiaomu](https://blog.qiaomu.ai/worse-together-multi-agent).

## Related posts

- [[forceful-systems-fly-off-multi-agent-illusion|When forceful systems fly off the multi-agent illusion]]
- [[accidental-blackboard-agents|Accidental blackboards: another shape of agent collaboration]]
- [[agent-product-design-playbook|Agent product design playbook]]
