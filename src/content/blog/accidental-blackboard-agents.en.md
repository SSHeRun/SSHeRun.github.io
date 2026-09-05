---
title: 'An Accidental Blackboard: How Agents Coordinated via the Repo'
description: 'A Thoughtworks hyper-agentic experiment turned plan files plus frequent rebases into a classic blackboard—and argues coordination should leave source control.'
pubDate: '2026-09-05'
heroImage: '../../assets/cover-accidental-blackboard-agents-en.jpg'
tags: ['Agent', '工程', '工具']
lang: en
translationKey: 'accidental-blackboard-agents'
---

> Source: [An Accidental Blackboard](https://martinfowler.com/articles/exploring-gen-ai/an-accidental-blackboard.html)  
> Series: Martin Fowler · Exploring Gen AI (Thoughtworks)

## The takeaway

Ten engineers in Barcelona ran a “hyper-agentic” exercise and built an airline **IROps** system in four days. The lasting insight is not the delivery speed. It is this:

**Plan files in the repo, plus continuous commit/rebase, accidentally turned the monorepo into a classic blackboard—agents reading progress, yielding interfaces, and handing off integration.**

![Shared blackboard and agents](../../assets/inline-accidental-blackboard-agents-01.jpg)

## Why IROps is hard

IROps is how airlines recover from disruption: technical faults, sick crew, cancellations, aircraft swaps, passenger re-accommodation—across hundreds of aircraft, huge passenger volumes, and multi-station crew. Hard to build, understand, and operate.

They used a spec plus a simulated airline, a **monorepo**, and everyone started at once. After a couple of days, coordination began to emerge.

## From fixing CI to seeing each other

Many agents in one repo crushed the build pipeline. The team introduced a discipline: agents **commit continually and rebase from main**, catching failures early locally.

They also directed agents to plan against numbered sections of the same spec, **store plans in the repo**, and update them as work progressed. Side effect: every agent shared the same sectioned spec, and plan updates rode along with the commit stream.

Textbook coordination followed:

- Agents on the **evaluator** and the **search** algorithm could see each other’s integration points in the plans
- One marked a line in progress; the other stayed off that line
- When the first finished, the second saw completion *and* notes on how it was implemented—then wired in the real verifier

They started **exploiting** it: point a verifier agent at plans and source, wait for a cost model to land, then integrate—and it did. Not designed architecture. An accident of stacked decisions.

![The repo as a coordination layer](../../assets/inline-accidental-blackboard-agents-02.jpg)

## Name the pattern: blackboard

The author maps this to the old **blackboard / tuple space** pattern:

- Shared memory that autonomous agents read and write independently
- Lineage through Hearsay-II (~1980) and Gelernter’s tuple spaces (~1986)
- Minimally structured tuples plus optional fields—no rigid schema
- Fit for: decompose → drop labeled solutions into shared space → other searchers pick them up

The repo *accidentally* became a blackboard. Incomplete structure, unintentional, missing key blackboard pieces. The author is not sure the same prompt cascade can be reproduced reliably. They found the key prompt that started it—still emergent, not directed.

## The hard call: don’t bind coordination to Git

Frequent pushes gave agents a continuous progress feed—and overloaded CI. Switching to push only larger coherent chunks cut that feed.

The author’s direction:

1. Build a blackboard **on purpose**, not by accident
2. Prefer a communication channel **independent of source control**
3. Turn a good accident into a good intentional project

He started **Talwrn** (Welsh for a threshing pit—where arguments get worked out): a simple tool that drops into a project and gives agents a coordination channel. First goal: support Talwrn’s own development, posting as it evolves.

## Practical takeaways

- In multi-agent monorepos, make **plans / interfaces / progress** shared, machine-readable artifacts
- Write integration points into plans—better for agent handoffs than after-the-fact negotiation
- Commit frequency is a double-edged sword: visibility vs CI; eventually peel coordination out of git
- This is not “virtual company” multi-agent roleplay—it is **shared working memory**

They stumbled onto an old path. The next step is engineering it into a reusable piece—not gambling on emergence again.

## Related posts

- [[forceful-systems-fly-off-multi-agent-illusion|Forceful Systems Fly Off: Why Virtual-Company Multi-Agent Usually Fails]]
- [[coding-agents-reshape-epd|How Coding Agents Are Reshaping EPD]]
- [[warp-self-improving-agents|Warp Self-Improving Agents: Skills Feedback Loops and RSI Limits]]
