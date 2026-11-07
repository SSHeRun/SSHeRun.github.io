---
title: 'How to Spot AI Writing in Chinese'
description: 'A V2EX thread on a Zhihu ban shows why detector scores often clash with human taste—and which Chinese AI tells, fake sincerity, and soft-promo patterns actually work.'
pubDate: '2026-11-07'
heroImage: '../../assets/cover-spot-ai-writing-in-chinese-en.jpg'
tags: ['LLM', '思考', '工程']
lang: en
translationKey: 'spot-ai-writing-in-chinese'
---

Zhihu banned someone for “suspected AI-assisted content.” The author asked V2EX: how did they even tell?

The interesting part wasn’t watermark debate. The thread almost unanimously answered a sharper question: **what does Chinese AI-flavored prose look like?** Detector scores often fight human taste. More reliable signals are template sentences, fake sincerity, emotional flatness, and “correct fluff + soft promo.”

Source: [V2EX #1254605](https://www.v2ex.com/t/1254605)

## A sample that failed the vibe check

![中文环境下如何识别 AI 语句 — overview](../../assets/inline-spot-ai-writing-in-chinese-01.jpg)

The OP pasted a “my take on reading English classics” essay, claiming only a few words were edited. One detector (Zhuque) scored it 99.6% human / 0.4% AI.

Commenters: obviously AI.

Worse, the second half read like a BookYell product sheet—pain point, then feature list, then “for example” introducing a product nobody knows. Later replies used “we’ll verify / we’ll maintain,” which basically confirmed promo intent.

So the real conclusion isn’t “how Zhihu detects AI.” It’s this: **people hate AI-flavored marketing more than they hate “used AI.”**

## Vibe signals that give it away

High-frequency kill shots from the thread:

- **Empty contrast:** “but I’m not lying”—but about what?
- **Weird collocation:** harvests that “grow on the body”
- **Over-tidy structure:** first feel for language, then culture, finally “don’t treat it as a task”—school essay form
- **Restrained emotion:** even “almost gave up” feels like a labeled emotion sticker
- **Too-complete grammar:** humans drop subjects; models rarely leave fragments
- **Written + spoken mashup:** formal parallel clauses ending in slangy phrasing

One brutal test: you finish feeling “deeply moved,” yet can’t restate a single new fact. That’s aislop. When every line sounds like a quote, quotes lose value.

## Chinese AI tells: a phrase checklist

Patterns the community repeatedly flagged:

1. Endless “not X, but Y” contrasts
2. “What’s truly scarce / what we should really fear is never…”
3. “In one sentence,” “put simply,” “this is what I really mean”
4. “Let me break it down from X angles”
5. “Underlying logic” wrapping obvious truths
6. Avoiding hedges like “maybe / probably / I feel”

Someone pastiched a full aislop essay—“it’s not that AI writes like humans; it’s that too many humans write like AI”—and it felt punchy while teaching nothing. That’s the detector: you’re led by the nose, and leave with empty pockets.

## Why single detectors fail

![中文环境下如何识别 AI 语句 — detail](../../assets/inline-spot-ai-writing-in-chinese-02.jpg)

Zhuque, scanner apps, homemade classifiers—all showed up. Same paragraph: nearly 100% human for one person, 100% AI for another.

Finer analysis helped more: three-part enumeration + sales-style interaction + LLM default examples (*The Old Man and the Sea* appears suspiciously often) → “AI draft + light human edit as soft promo.” A real reader who struggled with a book usually names the chapter, the page, the moment they quit—not just a famous title.

Platform caveats: detection may be reports, not models; humans get false positives; invisible watermarks exist but break under editing; draft history (one paste vs iterative edits) can beat a model score.

## A practical checklist

### Structure

- Stacked “not X but Y” and dense fake aphorisms
- Textbook wrap-ups: “in short…,” “first… second…”
- “Let me unpack this for you” scaffolding
- Over-aligned paragraphs and flat information flow

### Diction

- Odd metaphors / near-broken collocations
- Formal/spoken mashups
- Contrasts with no object
- Over-controlled emotion; missing hedges
- Over-complete subject–verb–object
- Default LLM examples without concrete struggle details

### Strategy tells

- Feels profound, yields no restatable knowledge → correct fluff
- Pain setup → product-manual word order
- “For example” introducing an unfamiliar product name

### Practice

- Read more pre-AI Chinese prose to train taste
- Short blurbs are hard; long posts almost always smell
- If you used AI, wait a few days before rereading
- Check whether drafts show iterative edits or one paste

Caveats: humans can fake AI style; careful human revision can erase local tells; detectors and watermarks are not silver bullets.

## Three takeaways

1. **For content and product copy:** Chinese audiences are allergic to “not-but + fake quotes + soft ads.” After generation, inject concrete experience, broken spoken edges, and real uncertainty.
2. **For moderation:** don’t bet on one detector score; combine rule features, promo structure, and human review.
3. **For platforms:** users often hate electronic slop marketing, not the tool itself.

Detection is always probabilistic. What’s scarce isn’t “prove it was AI”—it’s still being able to write sentences with body temperature, and still being worth believing.

## Related posts

- [[openai-text-watermark-math-editing|OpenAI text watermarks: hard to forge, easy to erase by editing]]
- [[ai-era-clarity-matters|The core skill in the AI era: saying things clearly]]
- [[hanhua-groups-least-afraid-of-ai|Why fan translation groups fear AI least]]
