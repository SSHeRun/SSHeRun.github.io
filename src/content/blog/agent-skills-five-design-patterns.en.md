---
title: 'Five design patterns for Agent Skills'
description: 'Google Cloud published five design patterns for Agent Skills — how to organize what goes inside a Skill. From Tool Wrapper to Pipeline, each pattern solves a different kind of work.'
pubDate: '2026-03-19'
heroImage: '../../assets/cover-agent-skills-five-design-patterns-en.jpg'
tags: ['Agent', 'Skills']
lang: en
translationKey: 'agent-skills-five-design-patterns'
---

Google Cloud Tech, in the "Advent of Agents Season 2" series, published something useful: five design patterns for Agent Skills.

The Agent Skills spec (agentskills.io) defines the package — `SKILL.md` plus `references/`, `assets/`, `scripts/`. Format is only a container. The real question is: what goes inside?

The five patterns answer that.

![Five skill artifacts](../../assets/inline-agent-skills-five-design-patterns-01.jpg)

## What is an Agent Skill?

A common mix-up: Tool and Skill are not the same thing.

A Tool is a function: `readFile()`, `calculator()`, `gitCommit()`. Stateless, deterministic. Told what to do, it does it.

A Skill is a cognitive pattern. It includes judgment, memory, and self-correction. A Skill knows when to ask, when to stop, when to read from cache instead of recomputing.

## The five patterns

### 1. Tool Wrapper

The simplest and most widely used.

Package a library or framework's conventions as on-demand knowledge. The instructions say which rules to follow; `references/` holds the long docs. No templates, no scripts.

Google's ADK Core Skills, Vercel's React best practices, and Supabase's Postgres guide are this pattern.

Use it when you only need the agent to use a tool correctly.

### 2. Generator

Fill reusable templates in `assets/` to produce structured output; `references/` holds quality rules.

Same structure every time, different content. Tech reports, API docs, commit messages — repetitive structured output is a Generator job.

Use it when you need the agent to generate in a fixed format.

### 3. Reviewer

Evaluate code against a checklist in `references/`, group findings by severity.

The key split: "what to check" (the checklist file) vs "how to check" (the review protocol). Swap the checklist and the same Skill produces a completely different review.

A real case: Giorgio Crivellari used an ADK governance Skill to move code quality from 29% to 99%.

Use it when you need the agent to score code or content against a standard.

### 4. Inversion

The Skill interviews you before it acts.

Structured questions through defined stages, plus a hard gate: "Do not start building until every stage is done."

This fixes a common failure: agents rush, then generate a pile of output from assumptions instead of real requirements. Inversion forces questions first.

Use it on complex work that needs a complete brief.

### 5. Pipeline

Sequential steps with explicit gates. "Do not enter step 3 until the user confirms."

The most complex pattern, and the only one that reliably stops an agent from skipping a verification step.

Use it on multi-step flows where each step must be confirmed.

## Patterns combine

These five are not exclusive. A Pipeline can contain a Reviewer step. A Generator can use Inversion to collect inputs.

An arXiv paper found production systems use about two patterns per Skill on average.

## Three cognitive modes

Shuva Jyoti Kar on Google Cloud Community maps Skills onto three cognitive modes, which make the Skill vs Tool difference concrete:

### The Scout

Problem: a developer says "map the codebase." The agent runs `ls -R`. Five thousand paths flood the context. Hallucinations start.

Fix: progressive disclosure. Show the top-level directories first. Ask "which one to go into?" Explore layer by layer. If a new layer looks like the last one, stop — you hit the bottom.

The agent is no longer reading files. It is navigating.

### The Resilient Patcher

Problem: a config file has a syntax error. The tool crashes.

Fix: the Skill does not reject bad input. It repairs it. Try strict JSON first; on failure, a loose parser fixes common mistakes (single quotes, trailing commas).

The user may never notice there was a problem. That *is* capability.

### The Librarian

Problem: analyzing a 500MB CSV takes 30 seconds. The user asks a second question. The agent reads the file again.

Fix: keep a local cache. Check the file hash. If you have already analyzed it, read from cache. Thirty seconds becomes zero.

The agent can answer "what do you already know?" — that is long-term memory.

![Exploring a layered archive](../../assets/inline-agent-skills-five-design-patterns-02.jpg)

## A decision tree

- Only need to pass knowledge / conventions? → Tool Wrapper
- Need structured output? → Generator
- Need to evaluate / review code? → Reviewer
- Need to collect requirements before acting? → Inversion
- Need multi-step work with verification? → Pipeline

## Why this matters

Agent Skills are becoming a cross-platform standard. The spec on agentskills.io has been adopted by 26+ platforms, including Claude Code, OpenAI Codex, Gemini CLI, GitHub Copilot, and Cursor.

Google's official ADK Skills install in one line:

```bash
npx skills add google/adk-docs -y -g
```

When you upgrade an agent from "a faster CLI" to "a teammate with cognition," design patterns are the middle layer. They say: do not write more code. Design better patterns so the agent acts like a senior engineer — look before you leap, fix your own mistakes, learn from experience.

## References

- [Google Cloud Tech post](https://x.com/GoogleCloudTech/status/2033953579824758855)
- [Cognitive patterns — Google Cloud Community](https://medium.com/google-cloud/beyond-tool-use-implementing-cognitive-patterns-with-google-antigravity-skills-c0eea90fa430)
- [Reddit discussion](https://www.reddit.com/r/agentdevelopmentkit/comments/1rqq414/5_design_patterns_for_structuring_agent_skills/)
- [Agent Skills spec](https://agentskills.io)
- [Code repo](https://github.com/shuvajyotikar13/agent-design-patterns)

## Related posts

- [[agent-skills-hub|Agent Skills Hub: finding and managing good Skills]]
- [[anthropic-skills-lessons|Lessons from hundreds of Skills inside Anthropic]]
- [[top-skill-yc-ceo-review|What a top Skill looks like: YC CEO's 600-line review prompt]]
- [[hello-world|An agent-friendly blog]]
