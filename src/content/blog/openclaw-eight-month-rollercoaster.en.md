---
title: 'OpenClaw’s Eight-Month Rollercoaster: From Viral to “Nobody Cares”'
description: 'Peter Steinberger’s Startup School recap: personal brand can’t be forked, your dependency’s business model is yours, and don’t stop having fun—plus the Meituan “raise shrimp” contrast.'
pubDate: '2026-09-05'
heroImage: '../../assets/cover-openclaw-eight-month-rollercoaster-en.jpg'
tags: ['Agent', '开源', '创业']
lang: en
translationKey: 'openclaw-eight-month-rollercoaster'
---

> Source: [InfoQ (ZH)](https://www.infoq.cn/article/4KQHJC49t8J8FPqaEVLv)  
> Talk: Peter Steinberger · Startup School 2026 · [video](https://www.youtube.com/watch?v=whcfSGN6CAU)

## The takeaway

OpenClaw is not just another agent-framework origin story. It is an **eight-month product cycle compressed**: kitchen WhatsApp relay → global attention → crushed by security narratives and configuration explosion → climbing back toward fun.

Three lines worth keeping:

1. **Anything you build can be forked; your name cannot**—build personal brand before you need it.  
2. **Your dependency’s business model is your business model**—when a lab cuts subscriptions, your roadmap breaks with it.  
3. **Don’t stop having fun**—fun is speed; weeks without joy tend to ship configuration options.

![Lobster and rollercoaster metaphor](../../assets/inline-openclaw-eight-month-rollercoaster-01.jpg)

## Contrast: Meituan’s “raise shrimp” vs Peter’s intuition

InfoQ opens with the enterprise lens: in Feb–Mar 2026 Meituan rolled OpenClaw company-wide—high enthusiasm, high cost (AI bills reportedly burning millions of RMB per day), and errors starting to interfere with real operations. Wang Puzhong framed it as phase one of AI transformation: AI stuffed into daily work without touching core business; process, org, and systems didn’t move together. Only by July did horse-racing experiments surface usable product paths.

Enterprise takeaway: **system engineering; don’t rush.** Peter’s takeaway: **trust intuition; fix what annoys you.** They don’t conflict—one is about landing at scale, the other about the fuel that starts a product. Dropping a personal open-source toy into a public company’s ops needs boundaries and governance, not just an install guide.

## Origin: built from being annoyed

Inspiration usually starts as irritation. On a rainy day he wanted to watch local agents from his phone—no clean path—so a WhatsApp relay appeared in about an hour. The magic wasn’t “chat in a terminal”; it was the **feel**: short replies, proactive check-ins, friend-like tone; model/context/session complexity melted away.

Twitter couldn’t sell it → friends in group chats → non-technical friends wanted it and got angry it “wasn’t for them yet”—strong PMF signal. A Discord PR turned a single-channel relay into a multi-platform bot (names molted from ClaudeAss toward OpenClaw). New Year’s Eve: build in public; a launch daemon resurrected after Ctrl+C; wake up to ~800 messages—almost got owned, and truly went viral.

In eight months: tens of thousands of issue/PR authors, thousands of committers; Mac Minis sold out; he nearly deleted the whole project. Lesson: **be careful what you wish for.**

![From personal relay to build-in-public](../../assets/inline-openclaw-eight-month-rollercoaster-02.jpg)

## Hermes, security, and ~9,500 config options

Competitors won at the pain point: security-report floods plus media claims that ~20% of Skills were malicious (their scan of ~67k Skills put the real ratio nearer 0.3%). Debunking never outruns panic.

He hardened the stack—sandboxes, allowlists, permissions, symlink safety, atomic config writes. Users love the abstract word “secure” and hate slower updates, broken workflows, and harder upgrades. Features are the fun part—one prompt away; the cost arrives later: every feature drags config options, peaking near **9,500**. Software with users is infinitely harder to evolve.

The sharper cut was dependency risk: the harness was overly optimized for Opus; Anthropic gave ~24 hours’ notice before disabling subscriptions—not enough time to turn. Write this down:

**Your dependency’s business model is your business model.**

Downloads behave like weather: ~835k/week at the May trough; after June “obituaries,” a spike to ~4.7M/week. You don’t control the storm—only what you repair inside it.

## When fun dies, the product dies

Around February it stopped being fun. He stopped using his own product and became the person who fixes bugs, security, infra, media, and lawyers—“for everyone” killed “for me.” NVIDIA asked early “what do you need?” and staffed much of the security load. Around his May birthday, fun returned: irritation at software he couldn’t prompt an agent to change became building fuel again.

“OpenClaw killer” headlines miss the point: **open source.** It’s hard to beat someone who is simply having fun.

## What’s next—and a checklist

The pitch stays clear: labs sell you an agent; OpenClaw is the alternative—open source, runs anywhere, any model; with local weights, data need never leave the device. The team is pushing shared session visibility and orchestration; the product is moving toward voice and multimodal (FaceTime hacks included).

Useful checks if you build agent tools:

- **Are you user #1?** Users #2–20 are friends; if you’re not excited, don’t expect the market to be.  
- **Do you have a vision.md?** Will you reject the N+1 “cool but off-course” PR?  
- **Are security boundaries explicit?** What you guarantee vs what was never the product promise—don’t let unverified reports own the roadmap.  
- **Is the harness married to one subscription?** Multi-model and open weights are survival, not polish.  
- **Is config exploding?** Compatibility switches are a tax on fun and maintainability.

Live in the future. Build what’s missing. When they write your obituary, keep shipping—confuse them.

## Related posts

- [[accidental-blackboard-agents|An Accidental Blackboard: How Agents Coordinated via the Repo]]
- [[warp-self-improving-agents|What “self-improving agents” actually improve]]
- [[coding-agents-reshape-epd|How coding agents reshape engineering, product, and design]]
