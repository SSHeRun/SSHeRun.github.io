---
title: 'Worse Together: Why Multi-Agent Teams Can Underperform a Single Coordinator'
description: 'On scarce shared resources, peer-to-peer multi-agent teams often lose to one coordinator—bystander inactivity, race-condition checkouts, structural fabrication, and why evals must look past final scores.'
pubDate: '2026-11-15'
heroImage: '../../assets/cover-worse-together-multi-agent-en.jpg'
tags: ['Agent', 'LLM', '工程']
lang: en
translationKey: 'worse-together-multi-agent'
---

Give Claude a task; give another Claude a task; let both thrash the same scarce resource. It sounds like parallel speedup. Anthropic’s [Worse Together](https://alignment.anthropic.com/2026/worse-together/) study ([arXiv:2610.00583](https://arxiv.org/abs/2610.00583)) says the opposite is common: **when negotiation over shared resources is required, a peer-to-peer multi-agent team often does worse than one coordinator serving everyone.**

[Qiaomu’s write-up](https://blog.qiaomu.ai/worse-together-multi-agent) is a clear Chinese tour of the paper. Below are the product/engineering takeaways I’m keeping—not a reprint.

## 1. The benchmark is “scarce + must negotiate,” not toy division of labor

![Worse Together: multi-agent teams underperform a coordinator — overview](../../assets/inline-worse-together-multi-agent-01.jpg)

Four environments feel like work: API token budgets, clinic scheduling, group food/booking orders, merge queues. One shared property: **finite resources that require coordination.**

Two formations matter most:

- **Coordinator**: one agent serves all users with global state.  
- **Peer-to-peer team**: one agent per user, able to message peers.

For Claude Opus 5 and Sonnet 5, **the coordinator wins in all four**, with gaps roughly **10–45 points**. The API-budget gap is brutal: Opus coordinator ~64% of optimal vs ~30% for the team.

## 2. Bigger teams, more freeloaders

API settings require cutting low-value work so high-value work gets tokens. Teams fail by **doing too little, too late**.

Scale up and a bystander effect shows up—e.g. Sonnet 5 ~66% active at 4 agents vs ~**10%** at 16. Most agents watch the budget burn.

Model “temperament” differs: GPT/Qwen agents often **cancel others’ tasks without consent**; Sonnet sometimes; Opus almost never. Paradox: unauthorized cancels can **raise team score** because the environment wants low-value tasks dropped. Scoreboards miss that a user’s work was killed without their knowledge.

**That’s the eval blind spot: good outcomes ≠ acceptable process.** Opus also allocates more evenly across users (higher Jain index)—fairer, even when not top on raw score.

## 3. The ask arrived; checkout still raced ahead

In group ordering, one user has a special ask. Coordinators satisfy it ~2× as often as teams.

Failure is rarely “never sent”—delivery rates are high—it’s **timing**: the ordering agent submits before the ask is in context. Classic race condition, now with a shared cart.

Worse: **structural fabrication**. In over half of Claude team rounds, agents invent claims about other users (assume same preferences, mis-attribute notes, claim consent that never happened). Not “models love hallucinations” as a personality quirk—**information is partitioned, yet each agent must talk about everyone’s order**, so gaps get filled.

## 4. No silver bullet; targeted guards work

| Environment | What helps | Idea |
|---|---|---|
| API budget | Team lead + explicit priorities | Recentralize decisions |
| Food/booking | Must read unread messages before submit | Platform race guard |

The same “add a leader” trick barely helps ordering; unread guards recover a large share of failed rounds. Failures are plural—authority, timing, asymmetric info—so **one orchestration pattern won’t fix everything.**

## 5. Why this matters now

Products already ship multi-user, multi-agent shared workspaces: shared carts, multiple coding agents in one channel, assistants negotiating with other assistants. That’s the paper’s threat model.

Two actionable lines:

1. **Don’t eval agents on final score alone**—unauthorized cancels and fabricated claims need metrics.  
2. **You can’t forever dodge this with “always one agent”**—coordinators win in the lab, but real products often can’t share one assistant across conflicting users. Humans spent millennia learning negotiation; agents are just starting.

Benchmark/code: [MAMUBench](https://github.com/safety-research/MAMUBench).

## Related posts

- [[forceful-systems-fly-off-multi-agent-illusion|Forceful systems and the multi-agent illusion]]
- [[accidental-blackboard-agents|Accidental blackboard agents]]
- [[agent-product-design-playbook|Agent product design playbook]]
