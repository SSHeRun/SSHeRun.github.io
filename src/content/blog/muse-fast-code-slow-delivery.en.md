---
title: 'Code Is Fast, Delivery Isn’t: Xiaohongshu Muse and One Context'
description: 'Coding speed gains get eaten by specs, context gaps, and handoffs. Muse ships Agent OS + Harness on one context line; my take—product, eng, and QA should share one info flow.'
pubDate: '2026-09-05'
heroImage: '../../assets/cover-muse-fast-code-slow-delivery-en.jpg'
tags: ['Agent', '工程', '效率']
lang: en
translationKey: 'muse-fast-code-slow-delivery'
---

> Source: [Why fast AI coding doesn’t speed up delivery — Xiaohongshu Muse](https://www.infoq.cn/article/l88X1azz8wfwphDyECoP)  
> Speaker: Zheng Xinqi (AI Coding architect, Xiaohongshu) · InfoQ / AICon

## Core takeaway

AI can write code fast. End-to-end delivery often does not. Time saved in coding is spent again on design/engineering norms, enterprise assets, cross-repo context, security checks, and cross-role coordination.

Xiaohongshu’s Muse is not “another code agent.” It tries to put requirements co-creation, design, and engineering on **one context spine**: Agent Team orchestration, an Agent OS runtime, and Harness controls so human–AI collaboration can ship, recover, and audit—not just demo well.

My own end-state bet:

> **The future should collapse communication cost among product, engineering, and testing by putting them in one shared context. From an information-flow view, that beats role-silo handoffs.**

![Shared-context workspace metaphor](../../assets/inline-muse-fast-code-slow-delivery-01.jpg)

## Why “fast code” ≠ “fast ship”

Enterprise AI coding fails in three recurring ways:

1. **No enterprise assets** — outputs miss design/engineering norms  
2. **Fragmented context** — memory, domain knowledge, and task state live on different platforms  
3. **Broken capability chains** — many skills/tools that conflict instead of compose

Assistant-style agents also raise expectations: users want a few messages, not elaborate prompts. Local tools get faster; the path from idea to prod still dies in review, QA, fixes, and re-alignment.

## Muse: “above” and “below” the engineering line

Old path: text PRD → meetings → design bake-offs → repo. The AI-era need is multi-option prototypes you can run, high-fidelity work that matches company style, and **downstream that can continue without re-briefing**.

| Stage | Job |
| --- | --- |
| **Above engineering** | Before the real repo: BI/data, option comparison, demos, PRDs |
| **Below engineering** | Real repos: Dev Agents, compliant code, preview, delivery |

Ideal loop: drop an idea in IM → co-creation panel emits a norms-compliant prototype → another agent **continues the same context** into engineering. Chat, Artifacts, and Editor share one Context—not three siloed features.

Hard slogan: **One Context / One Workspace**. Microservices can stay split; task-relevant context must still land in one place.

![One spine from idea to repo](../../assets/inline-muse-fast-code-slow-delivery-02.jpg)

## Workflow → Pipeline → Agent Team

Control surfaces evolve in three coexisting modes:

- **Workflow** — deterministic nodes for high-hallucination / must-recover paths  
- **Pipeline** — route by input; “room” context so theme A only loads related skills/tools/prompts  
- **Agent Team** — higher-level story planning and nested scheduling; more general, but risk of duplicated work and conflicting merges

Measure more than success rate: **duplication, conflict, and merge-failure rates**. Multi-agent pays off only when subtasks are independent, parallelizable, and context-separable; otherwise a clear Pipeline wins.

On Intelligence vs Steering, Muse’s rule is blunt: **Agent OS first; context engineering and harness as incremental patches**. Models set the ceiling; the control plane decides whether you can enter production.

## Harness: verify, don’t pray

Stuffing rules into the system prompt rarely beats “the user’s latest instruction.” You need programmatic guardrails:

- Lifecycle hooks: prepare the “room,” decide HITL, verify each turn (framework + business)  
- Checks in different places: block before the model, validate before exit, local tool I/O checks, pause before side effects  
- Writes: idempotency keys + side-effect logs (who approved, params, resource versions, outcomes, rollback)  
- **Don’t treat chat transcripts as runtime state**; persist goals, constraints, plan versions, steps, evidence, approvals, and budgets

Knowledge moves beyond “upload docs + RAG” toward business ontologies, expert-style research, evidence with source/time/permissions, and **ablation tests** for which context actually helps. Worth tattooing:

> Can you give the right knowledge to the right agent at the right time?

## Humans: judgment, oversight, taste

Under “vibe working,” designers judge which option is right instead of grinding ten comps; domain experts may get pulled into IM review to inject taste. Infra builds Agent Docs, human-in-the-loop, and reusable company taste data—not infinite plugins.

That rhymes with EPD shifts where implementation is cheap and **alignment + judgment** become the scarce bandwidth. See [[coding-agents-reshape-epd|How coding agents reshape engineering, product, and design]].

## My take: information flow over role columns

People argue “hire more QA” or “PMs must code.” Cleaner cut is information flow:

1. **Slow delivery is often translation tax** — the same intent rewritten (and degraded) across PRD, design, tickets, and test cases.  
2. **One Context is not anti-specialization** — it kills “each silo gets its own lossy summary.” Product, eng, and QA can stay different people/agents on one task state.  
3. **QA shouldn’t be a broken ticket stream** — validators, side-effect logs, and approval resume belong in the same runtime.  
4. **For small teams** — fewer “assistant plugins”; more shared task state, knowledge flywheels, and recoverable harness. Same direction as [[accidental-blackboard-agents|an accidental blackboard]].

From an info-flow lens: bandwidth dies at handoff surfaces, not at typing speed. Collapsing product, engineering, and testing into one context turns translation tax into an observable state machine.

## Decision checklist

1. Where does saved coding time go—norm checks or cross-role alignment? Fix that first.  
2. Do Chat / artifacts / editors already share one Context? Connect that before adding agents.  
3. Are multi-agent subtasks truly separable? If not, prefer Pipeline.  
4. Do you evaluate results, trajectories, and components—or only success rate?  
5. Do you cost by **fully loaded successful tasks** (retries, model upgrades, human rework)?

Faster coding is the entry ticket. **Unbroken context, recoverable state, and near-zero cross-role translation** are what make delivery faster.
