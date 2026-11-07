---
title: 'Claude’s Double Standard: Ingest Copyright to Train, Guard Studio IP on Output'
description: 'After Anthropic barred Claude from recreating existing games, Reddit’s top takes weren’t about compliance—they were about whose IP earns a system-prompt.'
pubDate: '2026-11-07'
heroImage: '../../assets/cover-claude-ip-double-standard-en.jpg'
tags: ['LLM', '产品', '思考']
lang: en
translationKey: 'claude-ip-double-standard'
---

Anthropic added a short rule to Claude: build original games, genre games, and games from the user’s own designs—**don’t** recreate a specific existing title, even if you rename it or call it original.

The official line is tidy: using Claude to infringe IP violates the usage policy. The community translation is uglier: **so you care about intellectual property now—selectively.**

Thread: [r/technology](https://www.reddit.com/r/technology/comments/1xl7omq/anthropic_adds_new_claude_rule_banning/) (~5.5k upvotes)

## What the double standard looks like

![Claude 的双标：训练时吞版权，输出时护大厂游戏 — overview](../../assets/inline-claude-ip-double-standard-01.jpg)

Top comments rhyme:

1. **Training:** vacuum up copyrighted text at planetary scale, sell access.  
2. **Inference:** block “make a game like X” with a system-prompt fence.  
3. **Trigger:** it becomes a “problem” when Sony or Disney’s bottom line is in play.

“They can steal my art, but corporate products must be protected” isn’t a brief—it’s a verdict on asymmetry. Small creators feed the model; platform IP gets behavioral hard-coding.

## How principled is the ban?

Two facts make “we respect copyright” sound like PR:

**Trivial to bypass.** Ask another model for a GDD of the original, then feed Claude; or “blocks fall, lines clear, totally my idea.” The rule catches lazy prompts, not intent.

**Collateral damage.** Coverage later said naming a game just to describe mechanics got false-positived; Anthropic loosened toward similar mechanics and “I’ll build something original in that genre instead.” Round one looked like an emergency brake; round two a product patch. Clear principles shouldn’t need a public diff after the backlash.

Others noted the closed-model tax: arbitrary new rules anytime; even defensive security prompts get smothered by the same monitoring mood. Games are just the visible railing.

## The real issue isn’t “should games be cloned”

![Claude 的双标：训练时吞版权，输出时护大厂游戏 — detail](../../assets/inline-claude-ip-double-standard-02.jpg)

Indie demos reverse-engineered overnight—and sometimes held hostage—are a real harm. Blocking one-click GTA clones is coherent risk management.

Stop the story at “Anthropic protects creators,” though, and you miss the power map:

- **Whose IP** gets system-prompt-grade constraints  
- **Whose IP** stays a footnote in training-data fights  
- **Who** lives in “steal first, apologize later—only to those who can sue”

The stronger the closed assistant, the more the rule list resembles a new EULA: not a constitution—an ops manual written for investors and litigation, not for your sense of fairness.

## Three takeaways

1. **Product signal:** policy moves serve sue-able mega-IP and viral abuse first, not universal copyright ethics.  
2. **Engineering dependency:** wiring critical workflow to one closed model means accepting two new sentences that shrink your capability overnight.  
3. **Creator strategy:** distribution, community, and law still beat hoping the company that trained on you will treat you like Disney at inference time.

Claude can refuse to remake Tetris. Watch harder which names that “respect IP” speech actually protects—in the training log versus the system prompt.

## Related posts

- [[anthropic-skills-lessons|Anthropic: lessons from building Claude Code Skills]]
- [[openai-text-watermark-math-editing|OpenAI text watermarks: hard math, easy to erase]]
- [[spot-ai-writing-in-chinese|How to spot AI writing in Chinese]]
