---
title: 'How coding agents reshape engineering, product, and design'
description: 'Coding agents made writing code strangely easy. What happens to EPD roles? From "the PRD is dead" to a new split: builders vs reviewers.'
pubDate: '2026-04-02'
heroImage: '../../assets/cover-coding-agents-reshape-epd-en.jpg'
tags: ['Agent', '产品', '组织']
lang: en
translationKey: 'coding-agents-reshape-epd'
---

> Source: [How Coding Agents Are Reshaping EPD](https://x.com/hwchase17/status/2031051115169808685)
> Author: Harrison Chase (LangChain founder)
> Via: Baoyu's share

## The claim

EPD in a software company — engineering, product, design — exists to make good software. The roles differ. The goal does not: ship functional software that solves a business problem and that people use. The output, in the end, is code.

**Coding agents suddenly made writing that code strangely easy.** So how do the roles move?

![An empty meeting room and a prototype](../../assets/inline-coding-agents-reshape-epd-01.jpg)

## What happens to the process

- **The PRD is dead** — the old PRD → mock → code conveyor belt is over
- **The bottleneck moved from implementation to review** — generating code is cheap; review is the new queue
- **Long live the PRD** — the *process* died; the need to write down requirements did not

## What happens to roles

### Generalists are more valuable than they used to be

People with a decent feel for product, engineering, *and* design have always been valuable. With coding agents they thrive.

**Why**: communication is the hardest part of almost everything. One person who can do product, design, and engineering is faster than a team of three because the coordination tax disappears. Implementation used to be the bottleneck, so even a generalist still had to talk to other people to finish. Now they only have to talk to an agent.

### Using coding agents is not optional

Implementation cost collapsed. Using the tools is table stakes. People who are good with coding agents can finish more alone:

- PMs can stay in a prototype to test an idea instead of writing a spec and waiting
- Designers can iterate in code, not only in Figma
- Engineers can spend time on systems thinking instead of implementation

### Good PMs get better; bad PMs get worse

Good product taste is more valuable than ever — you can make something actually useful. Bad product taste wastes more than ever.

A bad idea used to die in a doc. Now it can show up as a prototype of a useless or half-thought feature. Those prototypes still need review — engineering, product, design all have to look. That eats time and attention. And the inertia to ship is stronger ("it's already built — just merge it"). The product gets worse or fatter.

### Systems thinking is the skill to grind

In a world where execution is cheap, systems thinking is the real differentiator. Build a clear mental model of your domain:

- **Engineering**: how you would design services, APIs, and the database
- **Product**: what users actually need, not what they say they want
- **Design**: why something *feels* right when you use it

Systems thinking was always important. What changed is implementation cost. Making a thing is easier than it has ever been — that does not mean the thing is good. Good systems thinking lets you be right *before* you start, and sharper when you review someone else's work.

### Everyone needs product sense

A coding agent still needs someone to tell it what to do. If you tell it the wrong thing, you are manufacturing review trash for other people.

Knowing what to ask the agent to do — product sense — is a baseline requirement, or you drag the org. That applies to engineering, design, and (obviously) product.

### The bar for specialization went up

You need to use coding agents. You need product sense. Roles are blending.

Specialization still has a place. A senior engineer who lives in system architecture is still valuable. So is a PM who never learned vibe coding but has a razor-clear model of the customer problem and what to do. So is a designer who can understand and design journeys and interaction.

The bar is just much higher. You have to be excellent in your domain *and* review extremely fast *and* communicate extremely well. There will not be many of these seats in any company.

## A new split: builders vs reviewers

Two roles are forming inside EPD.

![Builders and reviewers](../../assets/inline-coding-agents-reshape-epd-02.jpg)

### Builders

Decent product sense, can drive a coding agent, enough design intuition. With guardrails (test suites, component libraries) they can take a small feature from idea to production, and a large feature to a usable prototype.

### Reviewers

Large, complex work still needs deep EPD review. The bar is high — you have to be a top systems thinker in your domain. And you have to be fast. There is too much to review.

### Career paths

**If you are an engineer today**:

- Grind system design until you can review architecture calmly, and move toward reviewer
- Or raise your product and design game and become a builder

**If you do product or design**:

- Build a top-tier product/design mental model and mostly review
- Or invest in coding agents and raise your engineering floor

The interesting part: roles are collapsing. Engineers have more time to think about product and design. Product and design can write code.

## Everyone thinks their role benefits the most — and they may all be right

The rarest person has an intuitive grasp of the existing product — where it is weak, where it is sharp, how to iterate so it gets sharper. The rarest version of that person sits at the intersection of culture and deep tech. A true bilingual. They know what is technically possible *and* which cultural currents are real rather than a fad. That combination is what makes a product feel inevitable instead of assembled.

The original thread spread in part because every reader thought it was about *them*. Product people forwarded it. Designers forwarded it. Design engineers, founders… everyone felt seen.

They may all be right. The exciting part of this world is that pedigree matters less. True generalists are rare, but they can come from product, design, *or* engineering.

**It is a good time to be a builder.**

## What to take from this

1. **Systems thinking > execution speed**: agents already solved speed; depth of thinking is the game
2. **Product sense is a baseline skill**: every seat needs "why," not only "how"
3. **Generalists rise**: people who can cross the EPD boundary will have outsized impact
4. **Review becomes scarce**: people who can review code / design / product quickly and accurately get more expensive
5. **Role blend is the trend**: future orgs may not be strict functions so much as a mix of builders + reviewers

## Related posts

- [[whatnot-cpo-regrets-pm-exists|Whatnot's CPO: "We regret that the PM function exists"]]
- [[taste-at-speed-pm-skill|Taste at Speed: when building is cheap, PM skill changes]]
- [[software-engineering-splits-three|Software engineering is splitting into three layers]]
