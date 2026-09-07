---
title: 'After the Agent Hype: Traditional SaaS Is Dead; AI-Native Keeps the Seat'
description: 'Atlassian’s rebound is not a seat-license comeback. “Agent as employee” hit enterprise reality—SoR, evals, and judgment matter again. Chat widgets won’t save legacy SaaS.'
pubDate: '2026-09-07'
heroImage: '../../assets/cover-ai-native-saas-after-agent-hype-en.jpg'
tags: ['创业', 'Agent', '思考']
lang: en
translationKey: 'ai-native-saas-after-agent-hype'
---

> Notes with references to [Atlassian’s FY26 Q4 shareholder letter](https://www.atlassian.com/blog/announcements/shareholder-letter-q4fy26), [Anthropic’s multi-agent engineering post](https://www.anthropic.com/engineering/multi-agent-research-system), [agent evals](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents), and [METR time horizons](https://metr.org/time-horizons/).

## Core take

SaaS stocks soft for half a year are being told again. Atlassian’s FY26 Q4: total revenue +28% y/y, cloud +31%. That is not “classic seat SaaS is back on the throne.”

The sharper read: the early-year **“Agent as employee”** story finally met real enterprise conditions. Bills, waits, and retries arrived. Industry data and evals still have to be built in-house. **The system of record does not go away.** So workflow, context, judgment, and domain benchmarks matter again.

Bottom line up front: **I do not buy traditional SaaS run the old way. The future is AI-native SaaS.** Bolting a chat box onto a legacy product does not fix it.

![Enterprise context and agent workflow metaphor](../../assets/inline-ai-native-saas-after-agent-hype-01.jpg)

## Why the software story returned

Capital loves a narrative everyone pushes together. From proving you are AI-native to burning tokens and asking where the outcomes are—things split and recombine.

What Atlassian actually leans on in the letter is not “we shipped a chat UI,” but **Teamwork Graph / System of Work**: you can hire intelligence by the token; you cannot hire context. Graph grounding can make answers more accurate while using fewer tokens. Humans and agents share one system of work. That rhymes with the market’s swing back to systems of record.

Early in the year, from OpenClaw to Claude Code, it was easy to extrapolate: models finish every task, invent workflows, use tools, generate UIs—so why keep software at all? Running it long enough shows the gap between “can run a task” and “can act like an employee.”

## Four judgments that still hold

I told the team this in April. I still hold it.

### 1. Token cost becomes a top concern

Cheap per-million tokens is not the same as cheap total cost to get something *right*.

Anthropic’s engineering write-up (their system data at the time—not a universal multiplier): agents used about **4×** the tokens of a normal chat; multi-agent systems about **15×**.

Also budget the supervision labor: ten terminals open all day monitoring jobs is still cost.

### 2. Evals are the bottleneck

Outside coding, many companies still do not know how to evaluate their own business decisions. Industry benchmarks exist, but “score on a leaderboard” is not “was this decision right for *our* company.”

Coding feedback is clearer than most domains—and even there, green tests are not the whole story.

### 3. Task-running agent ≠ agent employee

The latter needs enterprise context, trustworthy consistent judgment, and a sense of what it may decide alone versus escalate.

The hard question: why did the company make past decisions, which options were rejected, what constraints applied—and is any of that documented? If not, wiring CRM will not invent it.

Then long-horizon loops: recovery from failure, state, verification. “Just keep it running” is not a design. METR also warns that **task time horizons are not the same as real job competence**.

### 4. Stronger observability

You need traces: where tokens burned, where it failed, where it looped. Which proven paths can harden into workflows, skills, and playbooks so the model does not re-explore the same process on your dime every time?

![Tokens, evals, and observability](../../assets/inline-ai-native-saas-after-agent-hype-02.jpg)

## What AI-native SaaS looks like

At minimum:

1. **Business data is readable and operable by agents within permissions by default.**  
2. **Human UI is customizable per user with the agent, and changeable anytime.**  
3. **Decisions, rationales, and outcomes are first-class data.**  
4. **Data, analysis, and action are one stack**—more vertical than classic SaaS, and deeper: upstream and downstream of a scenario.  
5. **Eventually, industry models.** Model + app becomes table stakes. Fine-tune and distill ≠ train a foundation model from scratch at every company.

Deep vertical apps become the new neo labs: real tasks, industry data, evals, and outcome feedback in hand—so they know how to change the model usefully.

That does not contradict “software gets cheap.” What commoditizes is the vibe-able feature shell. **What stays valuable moves to SoR, context, judgment, domain loops, and vertical depth that can feed models.** The shape has to be agent-read/write and human-UI-malleable—not seat licenses plus a dialog.

## Why incumbents are at risk

Enterprises still need copilots, UIs, and approvals. Those needs do not vanish overnight. But old companies also protect existing products, seat revenue, and delivery motions. I bet they cannot pivot as fast as AI-native companies. A chat widget on yesterday’s SaaS does not close the gap.

## Two meta-takeaways

1. **Ignore whatever capital is hyping—solve real customer problems, or you leave the table.**  
2. **Staying at the table is what matters most.**

## Related posts

- [[software-not-valuable-ai-era|Software gets cheap in the AI era—below the kill line, and maybe customization too]]
- [[lovable-future-saas-agent-capabilities|Lovable: the future of SaaS is agent-callable capabilities]]
- [[muse-fast-code-slow-delivery|Coding got fast; delivery didn’t: Xiaohongshu Muse’s agentic architecture]]
