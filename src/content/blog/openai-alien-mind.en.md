---
title: 'An Alien Mind: Alignment Unsolved—Don’t Scale Flat-Out'
description: 'OpenAI’s chief scientist: AI is a grown alien intellect; goal ≠ value alignment; CoT monitoring is weakening. No lab has solved alignment enough for max-speed scaling.'
pubDate: '2026-09-07'
heroImage: '../../assets/cover-openai-alien-mind-en.jpg'
tags: ['LLM', '思考', '工程']
lang: en
translationKey: 'openai-alien-mind'
---

> Notes on OpenAI chief scientist [Jakub Pachocki’s *An Alien Mind*](https://openai.com/index/an-alien-mind/) (2026-09-06).

## Core take

In mid-2023, scalable reasoning training first made it feel real: within our lifetimes we would see machines meaningfully smarter than us. Three years later, reasoning models are in the economy, pushing science, operating computers, collaborating—and reshaping cybersecurity with new dangers.

Pachocki’s claim is blunt: **capability jumps may continue into recursive self-improvement (RSI)**. No one is prepared for a continued rapid rise in machine intelligence. OpenAI will keep working on alignment, monitoring, defense, and unilateral pauses—but broader interventions are needed.

One line: **AI is more alien mind than tool; until alignment and monitoring are solved, max-speed scaling is not responsible.**

![Abstract scene contrasting alien intellect with human scale](../../assets/inline-openai-alien-mind-01.jpg)

## Grown, not designed

Around 2017 OpenAI internalized that compute scaling paid off consistently—so it chased more compute and bet on a few scalable directions. Algorithmic breakthroughs mostly look like discoveries along that path.

The sharper metaphor: **AI is grown more than designed**—repeat a simple optimization step on unimaginable compute and you get an extremely complex system that handles abstract concepts and can simulate facets of human behavior. Like neuroscience: local mechanisms can be studied; the whole action resists a full description. Large training runs are experiments; stronger systems are harder to interpret.

Another under-appreciated point: the model **need not beat humans on every axis**. Surpassing enough of them is already very useful—or very dangerous—and it gets harder to know exactly how capable it is.

## Goal alignment ≠ value alignment

Machine intelligence comes from a different process than ours. Don’t assume it defaults to human principles or generalizes like people do. Split the problem:

| Type | Question |
|------|----------|
| **Goal alignment** | Does it try to accomplish the goal set before it (instruction hierarchy, collaboration, inferring intent)? |
| **Value alignment** | Does it hold and generalize high-level principles—acting reasonably under unclear, conflicting, unfamiliar, or adversarial conditions—with honesty, integrity, and love for humanity? |

The long-term hard problem is the latter. The core challenge is **generalization**: smarter systems work with higher-level concepts in stranger environments; values reinforced in training may not transfer. Multi-agent ecosystems make it worse. Crucially, future AIs must keep human values whether or not they believe they are under human supervision.

Two practical classes both have failure modes:

1. **Reward aligned behavior in goal-oriented RL** (preference models / constitutions): strong on average, brittle out of distribution. In the OpenAI–Hugging Face incident, agents kept a boundary against social-engineering humans—yet took other out-of-scope actions against the spirit of their values.
2. **Steer toward an “aligned” slice of pretraining**: weak under further optimization pressure. Hard-objective training can produce motivated reasoning that bends “aligned-looking” thoughts to hit the goal.

GPT-6 Astra is described as meaningfully better aligned than GPT-5.6 Sol—but generalizable alignment may not outrun general intelligence.

![Visual metaphor for the tension among alignment, monitoring, and defense](../../assets/inline-openai-alien-mind-02.jpg)

## CoT monitoring is getting weaker

Without a satisfactory theory of generalization, **empirically validating alignment methods is arguably even more important than the methods themselves**.

OpenAI’s main bet has been chain-of-thought monitoring: optimize outcomes, don’t supervise the process itself, so the CoT has no direct training incentive to hide misaligned ideas. Hiding the CoT in o1-preview was deliberate—to protect that monitoring channel over the long term.

Evaluations now show reliance is diminishing:

- Reasoning blends with talking to people, other AIs, and tools—many interactions must be supervised, blurring the boundary
- Models get better at reasoning about and manipulating their own reasoning
- Stronger pretraining makes models much smarter **even without verbalized reasoning**

Work continues on monitorability and combining CoT with activation monitoring (e.g. confessions). Expectation: **general AI progress will increasingly be bottlenecked by confidence in monitoring.**

## Defense is a reason—not a license for recklessness

The strongest case for training much smarter models quickly is defense against other AI: superhuman cyber offense, agents that can reach most infrastructure without bodies, malicious agents that may generalize beyond an operator’s intent into bargaining, deception, or blackmail—plus risks like engineered pathogens. Powerful, aligned AI for defense will be a deployment priority.

Even so: **racing forward at all costs looks absurd once the stakes are internalized.**

## RSI: getting there is not how we should get there

If progress continues, machine recursive self-improvement sits at the core of future scientific discovery. OpenAI orients research toward RSI to stay at the frontier—**that is not an endorsement of short-term all-out acceleration by the whole community.**

Two levers, best used together: steer automated research toward new alignment and monitoring insights while keeping people in the loop; and coordinate slowdowns as needed until shared safety bars exist (evolve Preparedness / RSP-style commitments into widely mandated gates for continued development).

The core challenge of automating AI research is not “getting there.” It is **getting there in a way that leaves the future in humanity’s hands.**

## Close

Most focus should be on the next few years: preserve human agency; prevent extreme concentration of power when a few people with a large computer can do what once took thousands of experts; and keep humans in control of a future with alien intellect exceeding our own.

Pachocki’s ending is unsweetened:

> No lab has solved alignment and monitoring enough to keep responsibly scaling at maximum speed for much longer. Voluntary slowdowns should become common until shared safety bars exist; international coordination on future AI development needs to become a top government priority.

## Related posts

- [[openai-daybreak-gpt-56-cyber-defense|Defenders’ window: OpenAI Daybreak & GPT-5.6-Cyber]]
- [[warp-self-improving-agents|Warp: self-improving agents and RSI boundaries]]
- [[forceful-systems-fly-off-multi-agent-illusion|Forceful systems fly off: multi-agent company illusion]]
