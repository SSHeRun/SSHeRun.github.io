---
title: 'When I learn a new field, I scrape it first'
description: 'The first step in a new field is no longer reading a book. It is batch-scraping the best sources into a private knowledge base. With XCrawl I went from zero to 80 clean documents in under two hours.'
pubDate: '2026-03-21'
heroImage: '../../assets/cover-learn-by-scraping-en.jpg'
tags: ['工具', '效率', 'Agent']
lang: en
translationKey: 'learn-by-scraping'
---

I have been reading Simon Willison.

He is a co-founder of Django and one of the most active indie developers in the AI tooling space. His blog, simonwillison.net, has more than ten years of writing — Python, SQLite, LLM apps, data engineering — at very high density.

At some point I thought: can I scrape the whole blog into a private knowledge base? Then, when I want his take on a technology, I ask an AI instead of flipping posts one by one.

The same move works in any field: find the best sources in a direction, batch-scrape them, make them *your* domain library.

![Pulling good sources into a private knowledge base](../../assets/inline-learn-by-scraping-01.jpg)

## The problem I hit

My first instinct was to tell OpenClaw what I wanted and let it handle it.

In practice, a single article was fine. A batch was not. It installed some open-source tools and came back with a lot of irrelevant links. It could not do "give me every post on this site."

What I needed:

1. A full URL list of Simon's posts
2. Each post scraped into clean Markdown
3. Ideally all of it inside an AI conversation, with no code of my own

Then I found **XCrawl**, which does all three.

## What XCrawl is

XCrawl is a web-scraping API with four core verbs:

1. **Search** — query a search engine, get structured results (title, URL, snippet, rank)
2. **Map** — scan a site and list its URLs
3. **Scrape** — fetch a URL as clean Markdown
4. **Crawl** — recursive whole-site crawl for large batches

It also ships an OpenClaw Skill, so you can call these in natural language without writing code.

**Setup is short:**

1. Register at https://www.xcrawl.com/?keyword=ut0qflxk and get a key
2. New accounts get 1,000 free credits
3. Hand OpenClaw the Skill docs: https://docs.xcrawl.com/zh/doc/developer-guides/openclaw/
4. OpenClaw installs the Skill

## Scraping all of Simon Willison

### Step 1: Map for every post URL

Map walks the sitemap and link graph and returns matching URLs. I filtered by year and kept the last three years.

**Result: 233 post URLs**

Simon is prolific — about 100 posts a year. By March 2026 he already had 24.

### Step 2: Scrape each body

Scrape is precision-guided: one URL, one clean Markdown file. No nav, no comments.

**Result:**

- 233 posts, under 10 minutes
- Clean Markdown each
- Headings, code blocks, and links kept

### Step 3: Save locally, analyze with AI

Because the output *is* Markdown, I had OpenClaw write the files to a local folder, then opened a Claude Code session on that folder.

I can now ask:

> "What does Simon think about SQLite?"
> "Has he written best practices for LLM apps?"

**Result:** I have a working copy of "Simon's brain." Want to learn something — ask.

## Building a library in a field you do not know

The case above assumes you already know *who* to learn from. More often you do not even know whose work to read.

Add Search: find the best sources first, Map each site, then Scrape only the documents that match your intent.

### Case: learning WebAssembly from scratch

**Step 1: Search for a direction**

Query "WebAssembly learning." You get structured results — title, URL, snippet, rank.

From 40 hits I kept five high-quality sites:

- a core docs site
- a deep blog
- an awesome list

**Step 2: Map each site**

Some sites had 20 essays. Some had 500 pages, mostly API reference.

Map lets you judge *before* you scrape, and keep only the valuable slice.

**Step 3: Scrape on purpose**

Same as above — fetch only what matches intent.

**Result:**

- 80 high-quality documents
- All clean Markdown
- Saved locally as a knowledge base
- **From "I know nothing about WebAssembly" to "I have 80 core docs of my own" in under two hours**

![Asking an AI against a local knowledge base](../../assets/inline-learn-by-scraping-02.jpg)

## Five notes

### 1. Map first. Always.

No matter how sure you are, run Map and look at the URL structure. A lot of sites do not match the pattern you imagined. Map saves you from a pile of junk pages.

### 2. Search language matters

The same keyword in English vs Chinese returns a completely different set. In technical fields, search English first. Source quality is usually higher.

### 3. Markdown output is the real convenience

Because the output is already Markdown, OpenClaw can drop files straight into a local notes vault. No conversion. Ready to use.

### 4. Stability was better than I expected

XCrawl rotates IPs under the hood. A few hundred posts still run fast, and privacy/security felt fine. Some open-source stacks get blocked. I did not hit that here.

### 5. On compliance

XCrawl checks `robots.txt` and only collects public pages. Still: confirm the target site's crawl policy yourself.

## How the learning loop changed

**Before:**

1. Find sources yourself
2. Read them yourself
3. Take notes yourself

**Now:**

1. Search for sources
2. Map the terrain
3. Scrape
4. Save locally
5. Learn in conversation with an AI

## The biggest shift

**The bottleneck moved from "I cannot find good content" to "can I ask a good question?"**

That is what learning should look like in the AI era.

## The essence

Take high-quality writing scattered across the internet, turn it into a private library, and let AI help you digest it.

---

**Original:** https://x.com/i/status/2034793001864872440

## Related posts

- [[cli-ai-revival|CLI: the command-line revival in the AI era]]
- [[x-3-open-source-tools-autoclip-cloud-mail-open-lovable|Three open-source tools from X: AutoClip, Cloud-Mail, Open Lovable]]
