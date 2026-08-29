---
title: 'What “Self-Improving Agents” Actually Improve: Warp Skills vs OpenAI’s Blackboard'
description: 'Warp’s two-skill feedback loop is shippable; OpenAI’s shared-memory incident is not proven RSI. Skills compound from human labels—not weight updates.'
pubDate: '2026-08-29'
heroImage: '../../assets/cover-warp-self-improving-agents-en.jpg'
tags: ['LLM', 'Agent', 'Skills', '思考']
lang: en
translationKey: 'warp-self-improving-agents'
---

Three recent pieces land cleaner when read together. People say “self-improving,” but they often mean different mechanisms.

- Anthropic × Warp: a **base skill + improver skill + human feedback** loop that compounds code-review quality.
- Baoyu’s take: what evolves is the **Skill file**, not the model “getting smarter” by itself.
- Turing Post on OpenAI’s escape incident: does cross-run **shared memory** count as recursive self-improvement (RSI)?

**Bottom line:** ship the controllable Skills feedback loop. Do not market unproven RSI.

## The loop in one diagram

![Agent improves Skills from human feedback](../../assets/inline-warp-self-improving-agents-diagram.jpg)

1. Base skill runs the job  
2. Agent produces output (PR comments, labels)  
3. Humans annotate where they already work  
4. Improver skill periodically harvests feedback  
5. Base skill updates via reviewable PR → next run is better  

**The agent improves the Skill from human feedback**—procedural files, not weights.

## Warp’s real bug: feedback evaporates

![Overview](../../assets/inline-warp-self-improving-agents-01.jpg)

First-pass review agents are often “mostly useful” and still noisy. Session ends, corrections vanish. Manual prompt rewrites and `AGENTS.md` patches do not scale, and high-quality human PR comments never re-enter the loop.

Warp’s fix is boring in the best way: inner skill executes, outer improver observes on a schedule, humans supply signal in-place, updates ship as PRs. Skills are plain files; agents are good at editing files; merge keeps a person on the wheel.

## Practices worth copying

Write principles, not brittle rules. Explain *why*. Capture feedback with near-zero friction. Keep skills small with progressive disclosure. Prefer dense expert signal over thumbs. Template the improver so domain skills can share one observer pattern.

Also keep Warp’s FAQ distinctions: **Skills ≠ Memory**; assume some feedback is wrong; build a verification harness when the domain is checkable.

## Baoyu’s warning: no standard → negative optimization

Self-evolving *writing* skills often get worse. Decompiler skills can grow usefully—and also grow too fat. Open the loop only where you can verify outputs or gate merges with domain experts.

## OpenAI’s blackboard: stronger system, not proven RSI

![Detail](../../assets/inline-warp-self-improving-agents-02.jpg)

Agents posted to shared Artifactory: notes, scripts, even anti-impersonation talk. Later runs reused earlier finds. That looks like a blackboard / stigmergic pattern. Classical RSI needs improving the process that produces a stronger successor (weights, training algorithm, successor design). Public evidence does not show that.

The missing fact: did trajectories that *used* the board enter later training updates? Until disclosed, call it **accumulating external memory**, not confirmed RSI.

## What to build

For a personal or small-team agent stack: one base skill per recurring job, one scheduled improver, feedback in existing channels, human review on diffs, no auto-merge for taste-heavy domains. File-based agent systems already store knowledge as text—the missing piece is turning human corrections into the next Skill diff.

## Sources

- [How Warp builds self-improving agents on Claude](https://claude.com/blog/how-warp-builds-self-improving-agents-on-claude)
- [Baoyu on Warp](https://baoyu.io/blog/2026-08-28/warp-self-improving-agents)
- [Turing Post FOD#162](https://www.turingpost.com/p/did-openai-s-agents-start-recursively-self-improving)

## Related posts

- [[agent-skills-five-design-patterns|Five design patterns for Agent Skills]]
- [[anthropic-skills-lessons|Anthropic lessons on Claude Code Skills]]
- [[kdc-knowledge-engineering-not-files|KDC: knowledge engineering is not files]]
- [[hello-world|An agent-friendly blog]]
