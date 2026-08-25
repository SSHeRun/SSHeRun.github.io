---
title: 'Why Stitch''s DESIGN.md matters: from image tool to design infrastructure'
description: 'Reading Stitch''s official DESIGN.md spec next to how people actually use Stitch 2.0: Google is not just generating UI faster. It is turning the design system into something AI can read, execute, and reuse.'
pubDate: '2026-03-28'
heroImage: '../../assets/cover-stitch-design-md-infrastructure-en.jpg'
tags: ['设计', 'Agent', '产品']
lang: en
translationKey: 'stitch-design-md-infrastructure'
---

# Why Stitch's DESIGN.md matters: from image tool to design infrastructure

I recently sat with two pieces on Google Stitch at once:

- the official docs on the `DESIGN.md` format
- a practitioner thread on X about what is actually good about Stitch 2.0

Read together, the feeling is sharp:

**What is worth watching in Stitch is not whether it can generate UI a bit faster. It is that it is turning the "design system" into infrastructure — readable, executable, and reusable by AI.**

And `DESIGN.md` is the critical layer in that direction.

![Design-system infrastructure](../../assets/inline-stitch-design-md-infrastructure-01.jpg)

---

## The conclusion first: Stitch is no longer "generate a page." It is "generate a consistent *set* of pages and keep them that way"

Most AI UI tools can now produce a page from a sentence.

The problem was never "can it output." It is:

- style drifts from page two
- color, type size, and component logic do not agree
- a new project means explaining the style again
- intent dies on the way to the coding agent

The hard job was never **generating one image**. It is:

> **How do you generate a whole UI system that stays in one language, can iterate for months, and can be handed to the next agent.**

That is the problem Stitch is clearly trying to solve.

---

## What `DESIGN.md` actually is

From the official docs, `DESIGN.md` is not a casual Markdown note.

It has two layers:

### Layer 1: a design summary for humans

Think of it as a design-system spec:

- overall style
- how color is defined
- how type is paired
- component constraints
- what to do and what not to do

This layer is for design, product, and engineering to read together.

### Layer 2: structured tokens for machines

The docs are explicit: behind `DESIGN.md` sit structured tokens Stitch maintains.

Which means:

- you see Markdown
- Stitch consumes structured design data

That is the important part.

> `DESIGN.md` is not a leftover design diary. It is a format that is human-readable *and* machine-executable.

That is a different object from a traditional design doc.

---

## Why this matters: prompts are not enough

A lot of AI design still runs on prompts:

- a more "tech" landing page
- dark theme
- Linear and Stripe as references
- softer card radii

You will get a picture.

Prompts have built-in defects:

- unstable
- hard to reuse
- inconsistent across pages
- hard to hand to a later coding agent
- hard to turn into a long-lived team asset

That is the job `DESIGN.md` takes.

It sits *on top of* the prompt as a **persistent spec layer**:

- define once, use next time
- import / export
- move across projects
- an agent can read it directly
- the whole system becomes a long-term asset

If you need an analogy:

- a PRD in product
- a component spec on the front end
- an API schema in code

It just lives at the design layer.

---

## Stitch 2.0's upgrades show it wants more than pictures

The X thread is useful because it is not a concept piece. It is a feel for the product.

A few points sit next to `DESIGN.md` especially well.

### 1. A theme system

Stitch now lets you:

- pick a theme
- switch color pairings
- change the theme color by hand
- update existing pages globally after you change it

What does that mean?

The substrate is no longer a single page. It is a set of **global design variables**.

Same logic as the tokens behind `DESIGN.md`.

### 2. An infinite canvas

The author says the UI now feels more like Figma — a canvas that can grow.

Stitch's goal is no longer "one landing page." It is moving toward a **multi-page product design space**.

### 3. Instant interactive prototypes

Pages stitch together; the system can infer which screen a button should open.

It now covers:

- static visual design
- page relationships
- prototype interaction

From "draw a picture" toward "a design process."

### 4. HTML export + AI coding + audit

The author's real loop:

1. generate UI in Stitch
2. export HTML and design images
3. hand them to Claude Code / Codex
4. send a sub-agent to audit spacing, type size, color, hierarchy
5. if it fails, fix and repeat

Worth sitting with.

This is not a traditional designer loop. It is:

> **AI-native design → AI-native build → AI-native audit**

Drop `DESIGN.md` into that line and it is the visual-spec middleware.

### 5. An MCP server

Stitch already has an MCP server you can plug into Claude Code or Cursor.

The ambition is not only a web tool. It wants to be:

**the design-capability vendor inside an AI IDE.**

If that lands, it is a large deal.

![Humans and machines reading the same spec](../../assets/inline-stitch-design-md-infrastructure-02.jpg)

---

## Three things worth keeping from both pieces

### Insight 1: design assets are becoming text

Design assets used to be:

- Figma files
- palettes
- component libraries
- a pile of loose spec docs

They will look more like:

- Markdown specs
- design tokens
- schemas an agent can consume
- design notes that travel between projects

`DESIGN.md` is a typical artifact of that trend.

---

### Insight 2: for the first time, a design system can be *stably* consumed by an agent

When AI wrote front end, design input was:

- screenshots
- prompts
- verbal description
- Figma screengrabs

None of that is stable.

A format like `DESIGN.md` is the first real chance for a design system to become:

- readable
- parseable
- executable
- transferable

as agent input.

That is a large change for AI coding workflows.

---

### Insight 3: Stitch looks more like new design infrastructure than a Figma killer

On the surface, Stitch is "an AI that generates comps."

Put the capabilities together:

- theme system
- design tokens
- `DESIGN.md`
- interactive prototypes
- HTML export
- MCP server

What it is actually trying to open is:

**design description → design system → page prototype → code → consistency audit**

That is not "an image tool" logic.

It is a new layer of design infrastructure.

---

## What this means for indies and people who run agent workflows

Three practical takeaways.

### 1. The design system can settle *before* the code

A lot of indie developers used to:

- write pages first
- fix UI later
- watch the style fall apart

A more reasonable order now:

1. prototype in Stitch
2. freeze the system in `DESIGN.md`
3. let a coding agent implement
4. add an audit agent for fidelity

The design system becomes an *earlier* asset.

### 2. Multi-agent collaboration gets more natural

A natural chain:

- Stitch owns the design source
- `DESIGN.md` carries the spec
- a coding agent implements
- an audit agent checks consistency

More reliable than one agent doing the whole job.

### 3. The winning move in AI design is not speed. It is consistency

What will separate products is not who can emit a page in ten seconds. It is who can:

- ship a set of pages that look like one product
- change a theme and have it apply everywhere
- inherit a system across projects
- keep the next implementation agent on the rails

That is productized value.

---

## Bottom line

If you treat Google Stitch as "an AI that generates UI," you will undersell it.

What is worth watching is that it is turning the design system into a middle layer that is:

- **human-readable**
- **machine-executable**
- **reusable across projects**
- **consumable by agents**

And `DESIGN.md` is the core of that layer.

**In one line:**

> Stitch's goal is not a few more pages. It is making the design system infrastructure you can pass, execute, and reuse in the AI era.

If that direction holds, the change may be as large as design systems themselves were for front-end engineering.

## Related posts

- [[stitch-claude-ai-design-workflow|Google Stitch 2.0 + Claude Code: an AI design workflow]]
- [[ai-ui-design-workflow|Why AI-generated UI isn't shippable — and the combo that works]]
- [[design-without-designing|Design Without Designing: how engineers ship high-quality design with AI]]
