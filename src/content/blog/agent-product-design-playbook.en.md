---
title: 'Product Design with Coding Agents: HTML Specs, Design Systems, Subtraction'
description: 'A practical playbook after months with coding agents: know good design, draft in HTML, start from component libraries, treat the design system as constitution, subtract boldly—and why iOS needs a different path.'
pubDate: '2026-09-07'
heroImage: '../../assets/cover-agent-product-design-playbook-en.jpg'
tags: ['产品', '设计', 'Agent']
lang: en
translationKey: 'agent-product-design-playbook'
---

> Notes from an essay on product design with coding agents (the author says it was written entirely by hand). At the end I add my take on whether HTML design drafts work for iOS.

## Core takeaway

Do not worship one-shot prompts that spit out flashy UIs. What actually works is old-school discipline that agents can execute:

**Know what good design is → draft in HTML → start from a component library → treat the design system as constitution → subtract boldly → compare options in isolated files → iterate patiently.**

For native iOS, the jump from an HTML demo to the real device is often rough—unless you render on simulator or device from the start.

![Metaphor of a design system and UI skeleton](../../assets/inline-agent-product-design-playbook-01.jpg)

## First: know what good product design is

It sounds trivial. It is the whole game. Wrong direction turns effort into waste.

Example: Claude’s warm background plus serif type once looked tasteful; it now often reads as “UI nobody polished.” GPT’s green form look ages the same way.

The only reliable fix: look at genuinely good products, go to primary sources, and avoid secondhand taste.

## Beauty is a means, not always the goal

Design is not art for its own sake. The job is to solve problems, meet needs, hit goals. Looking good is neither necessary nor sufficient.

Imagine a web IP-quality checker. Users want answers fast after opening the page. If you pile on highlights, shadows, materials, and Three.js for “beauty,” load time tanks and the experience suffers—design has drifted from the need.

## Use HTML files as the design medium

When the bar is extremely high, Figma or Paper still make sense. For most cases, **HTML is already the better carrier**—for web apps and for early exploration on many native projects.

HTML is almost as agent-friendly as Markdown: style and interaction edits are cheap, and agent browsers can open, annotate, and screenshot the draft.

### Sidebar: does this apply to iOS?

My answer: **partly—do not treat HTML as the default bridge to native.**

HTML is great for exploring information architecture, flows, copy, and rough layout—agents can edit and compare quickly. Shipping that demo to iOS is another story: materials, navigation patterns, gestures, safe areas, typography, and system-control semantics diverge. The middle often breaks.

The smoother path: **start with simulator or device rendering.** Keep HTML for low-fidelity exploration; use SwiftUI/UIKit previews or real devices for high fidelity and acceptance. Do not expect a one-shot HTML→native translation.

![Medium gap from web mock to mobile](../../assets/inline-agent-product-design-playbook-02.jpg)

## Use a component library—do not invent everything

A solid library saves time and consistency. Pick by taste and maturity: Shadcn UI, Hero UI, Base UI, and friends.

## Build a design system: the agent’s constitution

This is the core technique.

A design system is the constitution for how the agent designs pages: color, type, layout, spacing, shadow, components, interaction, and copy voice—written down in one HTML file or folder.

Doing this before the project starts saves endless micro-tweaks. After every new module, ask: does this match the current design system?

Same idea as Stitch / `DESIGN.md`: consistency comes from a spec file, not from the model “remembering last time’s colors.”

## Subtract aggressively

Models love extra detail. Delete what is not needed.

After a round of edits, ask the agent to extract the design principles behind those decisions and fold them back into the system—so the constitution gets sharper with use.

## Compare within bounds

Stuck on a module? Have the agent produce several options—but only in **separate HTML files**. Do not mutate the real project while exploring.

## Do not worship one-shot

Ignore social-media demos where one prompt “finishes” a product. Better prep and clearer intent make the project go faster. Whether it takes one round, two, or ten does not matter.

Patient polish is the normal case.

## Checklist

| Principle | Practice |
| --- | --- |
| Taste | Study real good products |
| Goal | Solve the problem; beauty is a means |
| Medium | HTML for web; HTML explore + device accept for iOS |
| Start | Component library |
| Constitution | Design-system file; self-check after modules |
| Iterate | Subtract; write principles back |
| Explore | Isolated HTML A/B |
| Pace | No one-shot mythology |

Agents accelerate edits. They do not replace your judgment of what good design is. That part you still have to train.

## Related posts

- [[ai-ui-design-workflow|Why AI-generated UI isn’t shippable—and a workflow that fixes consistency]]
- [[stitch-design-md-infrastructure|Why Google Stitch’s DESIGN.md matters: from image tools to design infrastructure]]
- [[design-without-designing|Design Without Designing: engineers shipping quality design with AI]]
