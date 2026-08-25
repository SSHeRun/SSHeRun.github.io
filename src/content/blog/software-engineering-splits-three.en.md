---
title: 'Software engineering is splitting into three layers'
description: 'When implementation cost falls toward zero, the bottleneck moves from coding to judgment. The market is splitting into three layers — not just different pay, but different work and different skills.'
pubDate: '2026-03-20'
heroImage: '../../assets/cover-software-engineering-splits-three-en.jpg'
tags: ['工程', '职业']
lang: en
translationKey: 'software-engineering-splits-three'
---

A large regional bank spent months deciding whether to build or buy a payment-reconciliation system. Stakeholders hesitated. Meanwhile an unhandled error delayed thousands of commercial transactions, triggered a $2 million regulatory fine, and weeks of bad press.

The story is simple: in software, a wrong decision does not only cost money. It costs risk, reputation, and real operational pain.

AI is changing the whole frame of that decision.

## The old model is collapsing

![Stalled light in a reconciliation hall](../../assets/inline-software-engineering-splits-three-01.jpg)

Enterprises used to have two options. Build: expensive, slow, risky — reserved for core systems. Outsource or buy: SaaS for generic needs, consultancies for custom work, senior rates for junior developers, knowledge walking out when the contract ends.

Neither option was good.

AI is not mainly changing "can write code." Vercel's CTO put it plainly: the cost of producing software is heading toward zero. Work that took a team weeks can now take hours.

What did not change: someone still has to judge whether the implementation is right, understand the business problem, and keep the system as the business evolves. The bottleneck moved from coding to judgment.

## Three layers, diverging work

The old three tiers of software engineering were mostly about pay. The work was similar — write code, review PRs, debug production. You could jump from a regional bank to a tech giant. Skills transferred.

AI breaks that. When implementation is cheap and judgment is the bottleneck, the three layers start to do *different jobs*.

### Tier 1: tech companies

Software *is* the product. Platform engineering, SRE, deep internal expertise. AI is a multiplier: the same team ships more, but the team is still human, still senior, still accountable.

What you need: senior engineers who can review AI-generated code and catch subtle bugs at scale. People who understand distributed systems, latency budgets, failure modes. AI writes the code. A person decides whether it is the right code.

### Tier 2: large enterprises

Banks, insurance, retail, telecom. Software is critical but not the core product. They have engineering teams and still lose talent auctions to Tier 1.

This is the layer that changes the most. These orgs will lean on platforms with sane defaults and built-in guardrails, and bring in time-shared seniors when they need them — not buy a team for months, but bring an architect in for a few days to review a plan and point at traps.

The purchase shifts from "heads to implement" to "judgment to review."

### Tier 3: small and mid-size businesses

Custom software used to belong to large companies. Small businesses used off-the-shelf products, lived with the limits, or used nothing.

AI changes that. One developer with AI assistance can now build custom software for a small business at a sane price. Think of all the old WordPress and Joomla custom work, expanded into real custom apps — problems too small for a SaaS category.

That creates a new role: the software plumber. A local developer serving local businesses, understanding the scene, translating requirements, showing up when it breaks. The skill is not distributed systems and scale. It is business understanding and fast delivery.

## Career mobility is falling

![Three different desks at night](../../assets/inline-software-engineering-splits-three-02.jpg)

This is the change to watch. You used to start in Tier 3, jump to Tier 1, then move to Tier 2 for a calmer life. Skills were general. The ladder could be climbed.

The skills the three layers need are becoming genuinely different. Tier 1 wants deep systems expertise. Tier 2 wants platform use plus judgment. Tier 3 wants business understanding plus speed. Crossing layers will get harder.

## Five questions for an enterprise engineering lead

1. Are we still buying SaaS for things we could now build?
2. Do we have a platform and guardrails to ship AI-assisted code safely?
3. When we buy outside expertise, are we paying for implementation or judgment?
4. Do we have seniors who can review AI output?
5. Where do the next senior engineers come from?

The last question is the hardest. If juniors no longer accumulate experience by writing a lot of code, what is the path to the next generation of seniors?

Humans in the loop are not going away. Stronger tools make the human more important. *Which* humans, doing *what* work, with *what* support — that is what is changing.

## References

- [Original](https://adventures.nodeland.dev/archive/software-engineering-splits-in-three/) (Adventures in Nodeland)
- [Gergely Orosz — When AI Writes Almost All Code](https://newsletter.pragmaticengineer.com/p/when-ai-writes-almost-all-code-what)

## Related posts

- [[coding-agents-reshape-epd|How coding agents reshape engineering, product, and design]]
- [[ai-era-programmer-survival-guide|A programmer's survival guide in the AI era]]
- [[gstack-yc-ceo-factory|gstack: the Claude Code factory YC's CEO uses]]
- [[taste-at-speed-pm-skill|Taste at Speed: when building is cheap, PM skill changes]]
