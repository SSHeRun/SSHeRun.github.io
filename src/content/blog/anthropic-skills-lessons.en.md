---
title: 'Lessons from hundreds of Skills inside Anthropic'
description: 'Anthropic engineer Thariq on what the team learned running hundreds of Skills in Claude Code. A Skill is not just a Markdown file — it is a folder of scripts, assets, and data the agent can discover and use.'
pubDate: '2026-03-20'
heroImage: '../../assets/cover-anthropic-skills-lessons-en.jpg'
tags: ['Skills', 'Claude Code', 'Agent']
lang: en
translationKey: 'anthropic-skills-lessons'
---

Anthropic runs hundreds of Skills in production. Engineer Thariq recently wrote down what the team actually learned.

A common myth: Skills are "just Markdown files." The interesting ones are folders — scripts, assets, data — that an agent can discover, explore, and operate on.

![A cabinet of skill archives](../../assets/inline-anthropic-skills-lessons-01.jpg)

## Nine Skill types

After sorting everything they had, Skills clustered into a few recurring categories. The best ones sit cleanly in one category. The confusing ones straddle several.

### 1. Library / SDK

How to use a library, CLI, or SDK correctly. Snippets plus a gotcha list of mistakes Claude keeps making. The edge cases in your internal billing library. When to use each subcommand of your internal CLI.

### 2. Verification

How to test or verify that code actually works, usually with Playwright, tmux, and other outside tools.

Anthropic thinks verification Skills are so useful that an engineer should spend a full week sharpening one. Tricks: have Claude record an output video so you can replay the test; make programmatic assertions at every step.

### 3. Data & monitoring

Connect data and monitoring systems: credentials, dashboard IDs, common query workflows. Example: which events you have to join to see signup → activation → paid.

### 4. Workflow

Turn a repetitive workflow into one command. A key trick: persist historical results to a log so the model stays consistent across runs.

### 5. Scaffolding

Generate boilerplate for a specific feature in the codebase. Especially useful when the need is in natural language and a pure code template cannot cover it.

### 6. Code quality

Enforce quality standards. Can include deterministic scripts, or run as hooks / GitHub Actions. The most interesting example is adversarial-review: spawn a sub-agent with a fresh point of view to criticize the code, apply fixes, and iterate until the findings degrade into nitpicks.

### 7. CI / CD

Help fetch, push, and deploy. Example: babysit-pr — watch the PR → retry flaky CI → resolve merge conflicts → enable automerge.

### 8. Debugging

Start from a symptom (a Slack thread, an alert, an error signature), investigate across tools, produce a structured report.

### 9. Maintenance

Routine ops with guardrails around destructive actions. Example: find orphaned resources → post to Slack → wait out a confirmation window → user confirms → cascade cleanup.

## Nine ways to write a better Skill

### Write what Claude does *not* already know

Claude already knows a lot of coding and has strong default tastes. If your Skill is mostly knowledge, write the information that *pushes Claude off its defaults*.

Anthropic's internal frontend-design Skill is the example — it exists to avoid Inter and purple gradients, Claude's house aesthetic.

### Gotchas are the highest-signal section

The strongest part of a Skill is usually the Gotchas chapter. Accumulate it from real failure points as Claude uses the Skill, and keep updating it.

### Use the folder for progressive disclosure

Put detailed API signatures in `references/api.md`, templates in `assets/`. Tell Claude which files exist; it will read them when it needs them. The filesystem *is* context engineering.

### Give flexibility; do not over-specify

Skills are reusable. Over-specific instructions shrink the set of cases they fit. Give Claude the information it needs, then leave room to adapt. Same idea as Garry Tan's plan-ceo-review: define a stance, not a syllabus.

### Store user config in `config.json`

If the Skill needs user context (a Slack channel, say), put it in `config.json`. If the config is missing, have the agent ask.

### Description is a trigger, not a summary

At startup Claude scans every Skill description to decide what to load. Write "when should this fire," not "what this Skill is."

### Give the Skill memory

Store data in the Skill directory — logs, JSON, even SQLite. The standup-post Skill keeps a history of each post so the next run can see what changed.

### Give Claude code, not only instructions

Scripts and libraries let Claude compose and decide instead of rebuilding boilerplate.

### Use hooks as safety rails

`/careful` blocks `rm -rf`, `DROP TABLE`, force-push. `/freeze` only allows edits in certain directories. Turn them on when you need them — not globally.

![Sharpening a skill under guardrails](../../assets/inline-anthropic-skills-lessons-02.jpg)

## Distribution: from a repo to a marketplace

A small team can commit Skills into `.claude/skills/`. At scale every Skill costs model context, and you need an internal plugin marketplace.

Anthropic's path is organic discovery: try it in a sandbox folder, list it formally after it has traction. No central team decides what ships, but you still need curation — low-quality and duplicate Skills are too easy to create.

They also use a PreToolUse hook to track usage: which Skills are hot, which never fire.

## How this sits with the other posts

Together with earlier pieces, this is a complete Agent Skills picture:

- Google's five design patterns define the architectural shapes
- YC CEO's plan-ceo-review shows what a top Skill does in the wild
- This Anthropic note is the method: classify, write, distribute

The three together roughly cover "what a good Skill is, how to write one, how to use one."

## References

- [Original post](https://x.com/i/status/2033949937936085378)
- Author: Thariq (@trq212), Anthropic engineer

## Related posts

- [[agent-skills-five-design-patterns|Five design patterns for Agent Skills]]
- [[agent-skills-hub|Agent Skills Hub: finding and managing good Skills]]
- [[top-skill-yc-ceo-review|What a top Skill looks like: YC CEO's 600-line review prompt]]
- [[dual-entry-human-agent-design|Two product entrances: design for humans and agents]]
