---
title: 'Lovable CTO: The Future of SaaS Is Capabilities Agents Can Call'
description: 'Lovable is shifting from AI app generation to MCP-powered capabilities. CTO Fabian Hedin on the company brain, dual interfaces, connector security, and why SaaS must build shovels for AI.'
pubDate: '2026-08-27'
heroImage: '../../assets/cover-lovable-future-saas-agent-capabilities-en.jpg'
tags: ['Agent', '产品', '创业']
lang: en
translationKey: 'lovable-future-saas-agent-capabilities'
---

Lovable became famous for generating web apps from natural language.

But in a recent Latent Space interview, CTO Fabian Hedin described a counterintuitive direction: **Lovable is preparing for a world where fewer people open conventional apps at all.**

Apps aren't dying. Entry points are consolidating.

![Abstract network of AI and SaaS capabilities](../../assets/inline-lovable-future-saas-agent-capabilities-01.jpg)

## One app, two interfaces

Lovable now exposes selected functions from published apps as tools through a **hosted MCP server**.

They call these **capabilities** — useful parts of an application that an agent can invoke directly, without a human opening the UI.

The result is a classic dual-entry design:

- **Human entry**: traditional UI
- **Agent entry**: MCP tools callable from ChatGPT, Claude, and other MCP clients

This mirrors the [[dual-entry-human-agent-design|LibTV canvas + Agent Skills pattern]], except Lovable packages capabilities at the **MCP layer**.

## What users built in three years

Lovable started as the open-source GPT Engineer project in 2023 and rebranded in late 2024. Hedin attributes the pace to compounding forces:

1. New application-layer capabilities every few months
2. Continuously improving LLMs

The user journey evolved clearly:

**Prototype → MVP → real paying product → internal operations software**

That last bucket includes CRMs, admin panels, and support consoles — not just customer-facing products, but **the operational layer behind the company**.

The numbers are striking (Aug 2026): **$500M+** ARR run rate, **60M+** projects, nearly **two-thirds of Fortune 500** employees have used the platform. Menlo just led a **$400M** Series C at a **$13.3B** valuation.

## The company brain: one entry point for all work

Lovable's vision is a **digital brain for your team** — a single interface for daily tools and workflows.

It needs two things:

1. **As much context as possible** about you, your company, and the world around you
2. **Capabilities** for both general tasks and organization-specific actions

Hedin's line: **"Everything you're building can be reused in an agentic way."**

The platform's job isn't to make you build a separate agent for every task. It's to **connect all capabilities through one agent**.

Internal example: a support tool for granting user credits and managing the platform — those capabilities are now callable through Lovable's internal agent. The agent can also **schedule itself asynchronously**: check a deployment later, then return results to the same conversation.

## Competition: orchestration is easy, connection is hard

Vercel's `@v`, v0, Cloudflare's agent workflows — everyone is chasing the company brain.

Hedin thinks Lovable's wedge is **being the best place to build the capabilities agents need**. Orchestration is the easy part. **Connecting correctly, building reliably, and making capabilities reusable** is the hard part.

He is careful about the word "agent." On the surface it sounds like an employee performing a task. Underneath, it's really about **connecting the right context and capabilities**.

## Security: connectors and the permissioning graph

When agents call capabilities directly, the biggest risk is **over-permissioning**.

Example: an employee builds a Lovable app connected to company Slack. Personal DMs or confidential channels must not leak into the company brain.

Lovable uses **connectors** for external systems. The core pattern is the **app user connector**:

- Preserves each user's identity and source-system permissions
- Credentials stored **server-side, encrypted**, managed by Lovable's connector gateway
- Generated apps receive only **short-lived, user-bound keys** — **never raw credentials**

> "We separate the connection to external systems from the application code being written. The app interfaces with the Lovable platform, but the app itself never gets access to those credentials."

That requires a **permissioning graph** — who can invoke which capability in which context.

![Enterprise software and agent connector security architecture](../../assets/inline-lovable-future-saas-agent-capabilities-02.jpg)

## Will SaaS disappear?

Hedin's take is pragmatic:

- Humans will interact with software through an **AI layer** more and more
- People won't keep as many tabs open, but **vertical capabilities remain valuable**
- Some traditional SaaS products will resist the trend and stick with legacy UIs
- Lovable wants an **open platform** anyone can connect to and use

One line of advice for SaaS companies:

**"SaaS businesses are going to have to focus more on providing the shovel for AI to use their capabilities."**

Dashboards for humans aren't enough. **Agent-callable, reliable capabilities** must be first-class.

## What this means for builders

1. **Design agent interfaces on day one** — MCP/tools, not as an afterthought
2. **Atomize capabilities** — grant credits, look up orders, change config; each action should be its own capability
3. **Separate credentials from generated code** — apps shouldn't hold long-lived API keys
4. **Orchestration will commoditize; reliable capabilities are the moat**

The future of SaaS may not be "another better tab." It may be **making your vertical capabilities a Lego block in someone else's company brain**.

---

*Source: [Lovable CTO: The Future of SaaS Is Apps That Agents Can Use](https://www.latent.space/p/lovable-future-of-saas) · Latent Space (Aug 26, 2026)*
