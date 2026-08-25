---
title: 'Taste at Speed: when building is cheap, PM skill changes'
description: 'Anthropic''s Boris Cherny ships 20–30 PRs a day, all written by Claude. When building is no longer the bottleneck, the PM job becomes: evaluate fast, kill most of it, ship only the survivors.'
pubDate: '2026-03-20'
heroImage: '../../assets/cover-taste-at-speed-pm-skill-en.jpg'
tags: ['产品', 'Claude Code', '效率']
lang: en
translationKey: 'taste-at-speed-pm-skill'
---

Boris Cherny's first PR at Anthropic was rejected. Not because the code was bad — because he had written it by hand.

His onboarding buddy told him to use Clyde (Claude Code's predecessor). He spent half a day learning the tool. The AI then produced a usable PR in one shot.

That was September 2024. By December, Opus 4.5 was writing 100% of his code. He uninstalled the IDE.

He now lands 20–30 PRs a day, with five Claude instances in parallel. His team shipped Cowork as a complete product in about ten days and tried hundreds of versions in the prototype stage. No PRD. No Figma.

![A pile of prototypes being filtered out](../../assets/inline-taste-at-speed-pm-skill-01.jpg)

## The printing-press analogy

Boris likes this comparison: in the 1400s, literacy in Europe was under 1%. Scribes worked for kings. After the press, printing cost dropped 100× and volume rose 10,000×. Scribes vanished. A new job appeared: writer.

Software engineers are today's scribes. PMs are the kings who hire them. AI coding is the press.

When the cost of building falls toward zero, the bottleneck moves from "can we build it?" to "should we ship it?"

PRDs exist because building was expensive and needed authorization. When a prototype takes 45 minutes instead of six weeks, nobody needs a document to authorize exploration. They need someone who can look at running software and say "this one, not that one."

## What Taste at Speed is

Taste at Speed — taste times speed: the ability to evaluate running software quickly, cut most of it, and ship only the survivors.

It is a filter, not an accelerator. An 80% kill rate is the point.

Boris himself: "Half my ideas are bad. You just have to try. Try something, put it in front of users, talk to them, learn, and maybe you find a good idea. Sometimes you don't."

Without taste, speed only means doing the wrong thing faster. That is a feature factory on steroids.

## Old loop vs new loop

The traditional flow is linear: idea → PRD → design → build → QA → ship, eight to twelve weeks.

The AI-era flow is a cycle: idea → five prototypes → evaluate → kill four → write a spec for the survivor → ship, one to two weeks.

The spec did not die. It moved from step 2 to step 6. Know what you are making, then write it down.

## Compounding speed

A PM who evaluates 15 prototypes a week builds judgment much faster than one who reviews one spec a month. After six months, that gap in pattern-matching becomes a gap in taste, then a career gap. It compounds every week.

That is why people who start building this muscle now get a real head start.

![Judging a running prototype](../../assets/inline-taste-at-speed-pm-skill-02.jpg)

## Five lenses on a prototype

When you stare at a running prototype, five judgments should run at once:

- Empathy: does this solve a real problem?
- Simulation: what breaks at scale?
- Strategy: does this fit our direction?
- Taste: is this the best of the options?
- Creative execution: can I imagine a version that is 2× better?

AI tools will commoditize. When everyone has roughly the same model, the only differentiation is the judgment a human puts on top of the output.

## How Boris actually works

Five terminal tabs, each a parallel checkout of the repo. Each starts in Claude Code's plan mode. He rotates. Once the plan is right, Opus 4.6 implements it in one shot almost every time.

He even starts agents from his phone in the morning. By the time he sits down, a third of the code is already there.

His take on plan mode is blunt: "Plan mode may have a limited lifespan. Maybe we won't need it in a month." That is a wild thing to hear from the person who built the feature, and it matches his philosophy: do not build product for today's model. Build for the model six months from now.

"Every part of Claude Code has been written and rewritten. Nothing that exists today existed six months ago."

## Can you copy this?

Anthropic is a special case: the team is almost all senior full-stack engineers, Boris has 15+ years from Instagram, the product *is* the AI tool they use, and hiring density is extreme.

What you *can* copy: a prototype-first evaluation loop, the discipline of trying tens or hundreds of versions, a culture of showing instead of writing, specs that come after the fact.

Boris's prediction: "By the end of the year, everyone is a PM and everyone writes code. The software-engineer title disappears and gets replaced by builder."

The question is not whether this workflow becomes standard. It is when.

## References

- [Original](https://www.news.aakashg.com/p/taste-at-speed) (Product Growth, Aakash Gupta)
- [Boris Cherny interview](https://www.youtube.com/watch?v=PQU9o_5rHC4)

## Related posts

- [[coding-agents-reshape-epd|How coding agents reshape engineering, product, and design]]
- [[gstack-yc-ceo-factory|gstack: the Claude Code factory YC's CEO uses]]
- [[whatnot-cpo-regrets-pm-exists|Whatnot's CPO: "We regret that the PM function exists"]]
- [[software-engineering-splits-three|Software engineering is splitting into three layers]]
