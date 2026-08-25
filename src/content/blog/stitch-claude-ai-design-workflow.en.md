---
title: 'Google Stitch 2.0 + Claude Code: an AI design workflow'
description: 'Google Stitch 2.0 wired to Claude Code over MCP lets one person do, in an hour, design work that used to take weeks and thousands of dollars. The lock is not "AI makes screens." It is design.md keeping the system consistent.'
pubDate: '2026-04-06'
heroImage: '../../assets/cover-stitch-claude-ai-design-workflow-en.jpg'
tags: ['设计', 'Claude Code', '产品']
lang: en
translationKey: 'stitch-claude-ai-design-workflow'
---

## The claim

Google Stitch 2.0 connected to Claude Code over MCP rewrote the AI-driven product-design loop. **One person can finish, in an hour, professional design work that used to take weeks and $3,000–$10,000.** The unlock is not "AI generates design." It is a `design.md` file that keeps the design system consistent.

![Design and code linked across two screens](../../assets/inline-stitch-claude-ai-design-workflow-01.jpg)

## What was painful about the old loop

### Cost of the old process

- **Money:** hiring a designer is $3,000–$10,000
- **Time:** weeks waiting for a Figma file
- **Implementation:** more time and money to land the design in code
- **Opportunity:** by the time design lands, product momentum is gone

### The usual AI-design failure

Most apps built with AI look like "AI slop." That is not a model problem. It is a **workflow** problem:

- features work, logic is correct
- the UI is generic; users decide in two seconds
- **consistency is the real break:** page one looks fine, page two falls apart

## What Stitch 2.0 actually changed

### Why it is different

Stitch 2.0 is an **AI-native canvas**. It can:

1. **Take many kinds of input**
   - screenshots of an existing app
   - inspiration from Dribbble or 21st.dev
   - any site URL (reverse-engineer the design)

2. **Generate several variants**
   - not one output — a set you can pick from
   - steal the best piece of each

3. **Build a full design system automatically**
   - type scale (display, headline, label, title, body)
   - primary / secondary / tertiary palettes (complementary colors generated)
   - a scale for every hue
   - component rules and patterns
   - height and depth specs
   - dos and don'ts of the design language

### The real invention: `design.md`

Every rule is written into a **`design.md`** file — plain Markdown that captures the whole language.

**That file changes everything.**

## The working loop

### Step 1: design in Stitch

1. **Gather material**
   - screenshot the main screens of an existing app
   - or grab 2–3 Dribbble images (direction, not a copy)

2. **Write a focused prompt**
   - what the app does
   - which screens you are redesigning
   - direction (dark mode, minimal, editorial…)
   - **name the fonts** (type is the fastest way to change how an app feels)
   - example: a serif for titles, a clean sans for body

3. **Pick the best variant**
   - do not take the first output
   - pull the best piece of each: type from one, layout from another, color energy from a third

4. **Voice input (optional)**
   - Stitch now takes voice
   - it transcribes into a prompt

### Why Stitch output looks better

**Stitch generates an image first, then code.**

- it is not limited by HTML and CSS
- it can imagine any visual
- then it reverse-builds from the reference image
- that is why the design is more refined than prompting a coding tool directly

### Step 2: export `design.md`

1. In the right panel, open **Design Systems**
2. Stitch has already built a system from your design
3. Click **design.md**
4. Copy the whole file
5. Create `design.md` at the project root
6. Paste and save

**That file is now the single source of truth for the whole design language.**

### The problem `design.md` kills

**Before:** every time you asked Claude Code for a new screen or feature, the design drifted.

- colors shifted a little
- fonts changed
- spacing went inconsistent
- the app looked like ten people built it (because every prompt was a new context)

**After:** Claude Code cites `design.md` in every prompt.

- the language stays locked across screens, components, new features
- **the consistency problem that wrecks every AI-built app is solved by one Markdown file**

**It lasts:**

- update `design.md` as the product grows
- add component rules, patterns, constraints
- it grows with you

![One spec lighting a whole set of pages](../../assets/inline-stitch-claude-ai-design-workflow-02.jpg)

### Step 3: connect Stitch to Claude Code over MCP

This is where the workflow gets **unreasonable**.

**`design.md` gives Claude Code rules. MCP gives it something stronger: the actual HTML and CSS of the Stitch frame.**

Not a description of the design. **The source.**

#### Setup

1. Search Google Stitch docs for "Google Stitch MCP setup"
2. Find the install command for your platform
3. In Stitch Settings → API, create a key
4. Paste the install command and key into the Claude Code terminal
5. Start a new session; Stitch shows as connected

#### How you use it

Prompt Claude Code:

```
Use the Stitch MCP to update the dashboard screen so it matches the desktop frame in Google Stitch.
```

Claude Code will:

- list your Stitch projects
- find the right frame
- fetch the source
- rebuild the UI to match

**Minutes, not a day.**

#### A catch

Stitch sometimes designs features your app does not have yet ("recent activity," a notification drawer).

**Fix:**

- tell Claude Code exactly what to include and skip
- name the features that actually exist in the repo
- otherwise you spend time deleting things that should not be there

### Step 4: build the whole product

Stay in the same Claude Code session for the integrations:

#### Auth (Supabase)

- connect Supabase
- generate tokens and hand them to Claude Code
- user accounts, login, role-level security get set up
- sessions persist across refresh

#### Payments (Stripe)

- create products and prices in the Stripe dashboard
- give Claude Code the public and secret keys
- it finds product IDs, builds checkout, wires users
- **test in sandbox first** (test card: 4242 4242 4242 4242)

#### Email (Resend)

- connect Resend
- password reset, welcome mail, notifications
- Claude Code builds edge functions and hooks them to auth

#### Deploy (GitHub + Vercel)

- push to GitHub
- deploy to Vercel (one click)
- every later change shows on the live site

**The real advantage:** Claude Code walks you through each integration.

- you do not need Stripe webhooks
- you do not need Supabase security-model details
- say what you want; it asks for the exact credentials

## Honest limits

The original author is clear about what is still rough:

1. **Fonts:** after a Stitch design, you sometimes tweak them by hand
2. **Color:** tones do not always land exactly
3. **Complex layouts:** MCP reads HTML/CSS; if Stitch generated something dense, Claude may interpret it differently
4. **Tokens:** long sessions cost more; keep prompts focused

**None of that changes the shift:**

- work that cost thousands of dollars and weeks
- one person can now finish in an afternoon
- the workflow is not perfect, and it is already better than everything before it
- Google is shipping Stitch updates fast; the gap is closing

## This is the new default

### The old world

- **Funded teams:** designers, brand guides, Figma systems, someone paid to keep consistency
- **Indies and small teams:** never had those resources

### 2026

If you are building a product with AI in 2026 and you are:

- still paying a designer thousands for MVP-level work, or
- shipping something that looks like "AI slop" because you do not know how to fix the design

**This workflow exists. It works. It has been tested.**

## What to take from it

### 1. Design systems got democratized

A system only big companies could afford is now available to any indie:

- a full type system
- a consistent color system
- component rules and patterns
- generated and documented automatically

### 2. `design.md` is the invention

Not the generated screens themselves:

- **one source of truth:** one file owns the language
- **persistent context:** every prompt cites the same rules
- **evolvable:** update it as the product grows

That is the largest pain in AI-driven development: **consistency.**

### 3. Workflow > tools

The piece keeps saying:

- if your app looks like AI slop, it is not the model's fault
- it is a **workflow** problem
- the right workflow lets one person do a whole team's job

### 4. Cost comparison

| Item | Old way | This workflow |
|------|---------|---------------|
| Designer | $3,000–$10,000 | $0 |
| Time | weeks | 1 hour |
| Implementation | extra cost | included |
| Consistency | a dedicated person | automated |

### 5. The stack

A complete modern AI-driven stack:

- **Design:** Google Stitch 2.0
- **Build:** Claude Code
- **Auth:** Supabase
- **Pay:** Stripe
- **Mail:** Resend
- **Deploy:** GitHub + Vercel

All of it can happen in one session, with Claude Code walking the path.

## Action list

- [ ] Generate a design system in Google Stitch 2.0
- [ ] Learn to write a focused design prompt
- [ ] Put a `design.md` workflow in a real project
- [ ] Test Stitch MCP with Claude Code
- [ ] Try the full stack (Supabase + Stripe + Resend)

---

*Source: [X/Twitter — @PrajwalTomar_](https://x.com/i/status/2037104246647382058)*

## Related posts

- [[stitch-design-md-infrastructure|Why Stitch's DESIGN.md matters: from image tool to design infrastructure]]
- [[ai-ui-design-workflow|Why AI-generated UI isn't shippable — and the combo that works]]
- [[design-without-designing|Design Without Designing: how engineers ship high-quality design with AI]]
