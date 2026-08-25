---
title: 'An agent-friendly blog'
description: 'A personal site should not only be a page for people. In the agent era it should also be a machine-readable interface. Here is how this blog is built for both humans and AI agents.'
pubDate: '2026-03-18'
heroImage: '../../assets/cover-hello-world-en.jpg'
tags: ['Agent', '工程']
lang: en
translationKey: 'hello-world'
---

## Why be agent-friendly?

The old logic of a personal site is simple: a person arrives, sees a polished page, reads, and leaves.

In 2026, humans are no longer the only visitors. More and more AI agents browse, collect, and summarize on a user's behalf. When an agent hits a typical blog, it faces a pile of HTML, CSS, and JavaScript — noise it does not need.

**Agent-friendly** means your content also exists in a form machines can consume efficiently. The site should have a face (HTML) and a brain (structured data plus plain-text interfaces).

![Human blog and machine-readable dual interface](../../assets/inline-hello-world-01.jpg)

## What this site does

### 1. llms.txt — a map for LLMs

[llms.txt](https://llmstxt.org/) is an emerging convention, a cousin of `robots.txt` with the opposite job: not "stay out," but "if you came, start here."

This site's `/llms.txt` is generated at build time. It includes:

- a short site and author intro
- titles, links, and summaries for every post
- a sketch of the site structure
- pointers to full content

An agent can read one file and understand the whole site.

### 2. llms-full.txt — the full context

For agents that need depth, `/llms-full.txt` concatenates every post's Markdown into a single document. One request, the whole knowledge base — no page-by-page crawl.

### 3. Raw Markdown endpoints

Every article has a matching `.md` URL. This English post lives at `/en/blog/hello-world.md`; the Chinese original is `/blog/hello-world.md`.

That follows the llms.txt recommendation: give each page a plain Markdown twin so a machine can skip HTML parsing and take structured text.

### 4. JSON-LD

Each HTML page embeds Schema.org `BlogPosting` JSON-LD: title, description, publish time, author, language, and keywords. Search engines and AI crawlers can parse the metadata without guessing.

### 5. Open discovery

- `/robots.txt` — crawlers are welcome
- `/rss.xml` — RSS
- `/sitemap-index.xml` — sitemap
- `<link rel="help" href="/llms.txt">` — a discovery hint in the HTML head

## These endpoints are generated

None of the agent-facing files are hand-maintained static copies. Astro builds them from the content collection. Write a new post and `llms.txt`, `llms-full.txt`, and the `.md` endpoints update themselves.

Zero upkeep is the only version that lasts.

![A knowledge base as connected structured nodes](../../assets/inline-hello-world-02.jpg)

### 6. Obsidian-style wikilinks

The Markdown pipeline understands Obsidian wikilinks, so notes can ship from an Obsidian vault without rewriting links.

Supported forms:

- `[[post-slug]]` — link to a post
- `[[post-slug|display text]]` — custom label
- `[[post-slug#heading]]` — jump to a section
- `![[image.png]]` — embed an image

For more systems and Windows notes, see [[winpe-pecmd-commands|PECMD commands in WinPE]] and [[vs-atl-exe-cannot-generate-dll|VS ATL exe template cannot generate a DLL]].

## What next

This is a starting point. Following the idea of [what a personal site becomes in the agent era](https://x.com/i/status/2033784623864680927), later experiments could include:

- **A conversational knowledge persona** — an agent that actually knows everything you have written
- **Structured capability, not just essays** — interactive playgrounds
- **Intent-aware visitor interfaces** — different responses for different kinds of visitors

Don't just display yourself. Deploy yourself.

## Related posts

- [[agent-skills-five-design-patterns|Five design patterns for Agent Skills]]
- [[agent-skills-hub|Agent Skills Hub: finding and managing good Skills]]
- [[dual-entry-human-agent-design|Two product entrances: design for humans and agents]]
- [[anthropic-skills-lessons|Lessons from hundreds of Skills inside Anthropic]]
