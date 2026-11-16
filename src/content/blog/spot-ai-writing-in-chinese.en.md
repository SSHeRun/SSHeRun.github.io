---
title: 'How to Spot AI Writing in Chinese'
description: 'A V2EX thread on a Zhihu ban shows why detector scores often clash with human taste—and which Chinese AI tells, fake sincerity, and soft-promo patterns actually work. Tables and examples included.'
pubDate: '2026-11-07'
updatedDate: '2026-11-15'
heroImage: '../../assets/cover-spot-ai-writing-in-chinese-en.jpg'
tags: ['LLM', '工程']
lang: en
translationKey: 'spot-ai-writing-in-chinese'
---

Zhihu banned someone for “suspected AI-assisted content.” The author asked V2EX: how did they even tell?

The interesting part wasn’t watermark debate. The thread almost unanimously answered a sharper question: **what does Chinese AI-flavored prose look like?** Detector scores often fight human taste. More reliable signals are template sentences, fake sincerity, emotional flatness, and “correct fluff + soft promo.”

Source: [V2EX #1254605](https://www.v2ex.com/t/1254605)

## A sample that failed the vibe check

![How to spot AI writing in Chinese — overview](../../assets/inline-spot-ai-writing-in-chinese-01.jpg)

The OP pasted a “my take on reading English classics” essay, claiming only a few words were edited. Zhuque scored it 99.6% human / 0.4% AI.

| Who | Verdict | Note |
|---|---|---|
| Zhuque detector | 99.6% human | Clashes with commenter taste |
| Commenters | Obviously AI | Templates, fake sincerity, soft promo |
| Second half of text | BookYell manual tone | Pain setup → features → “for example” new product |

Later replies used “we’ll verify / we’ll maintain,” which basically confirmed promo intent.

Real conclusion: **people hate AI-flavored marketing more than they hate “used AI.”**

## Vibe signals that give it away

![Fake golden lines and empty pockets](../../assets/inline-spot-ai-writing-in-chinese-03.jpg)

| Signal | Sample flavor | Why it smells |
|---|---|---|
| Empty contrast | “but I’m not lying”—but about what? | Template turn with no anchor |
| Weird collocation | Harvests that “grow on the body” | Near-broken, not human |
| Over-tidy structure | First feel, then culture, finally “don’t treat it as a task” | School-essay form |
| Restrained emotion | “Almost gave up” as a sticker | Labeled emotion in a manual |
| Too-complete grammar | Every clause intact | Humans drop subjects |
| Written + spoken mashup | Formal parallels ending in slang | Two registers welded |

Brutal test: you feel “deeply moved,” yet can’t restate a single new fact. That’s aislop.

## Chinese AI tells: a phrase checklist

| # | Tell | Why suspicious |
|---|---|---|
| 1 | Endless “not X, but Y” | Fake dialectic, often zero information |
| 2 | “What’s truly scarce / what we should really fear is never…” | Correct-fluff opener |
| 3 | “In one sentence,” “put simply,” “this is what I really mean” | Self-dramatizing |
| 4 | “Let me break it down from X angles” | Slide-deck voice |
| 5 | “Underlying logic” wrapping obvious truths | Noun inflation |
| 6 | Avoiding “maybe / probably / I feel” | Missing human hedges |

## Why single detectors fail

![How to spot AI writing in Chinese — detail](../../assets/inline-spot-ai-writing-in-chinese-02.jpg)

| Method | Useful for | Don’t mythologize |
|---|---|---|
| Single detector score | Coarse filter | Often fights vibe |
| Fine structure | Enumeration + sales UX + default examples | More stable than a total |
| Invisible watermarks | Exist | Break under editing |
| Draft history | One paste vs iterative edits | Sometimes beats model score |
| Platform folds | May be reports | Humans get false positives |

A real reader who struggled with a book usually names the chapter and the quit moment—not just a famous title.

## A practical checklist

![Review desk: taste vs conflicting gauges](../../assets/inline-spot-ai-writing-in-chinese-04.jpg)

| Layer | Red flags |
|---|---|
| Structure | Stacked not-but; “in short / first / second”; “let me unpack”; over-aligned paragraphs |
| Diction | Odd metaphors; formal/spoken mashups; contrasts with no object; missing hedges; over-complete SVO; default LLM examples |
| Strategy | Profound feel, no restatable knowledge; pain → product-manual order; “for example” + unfamiliar product |
| Practice | Train on pre-AI prose; short blurbs hard; wait days before rereading own AI drafts; check draft history |

Caveats: humans can fake AI style; careful revision can erase local tells; detectors aren’t silver bullets.

## Three takeaways

| Role | Move |
|---|---|
| Content / product copy | Inject concrete experience, broken spoken edges, real uncertainty |
| Moderation | Rules + promo structure + human review; don’t bet one score |
| Platforms | Users often hate electronic slop marketing, not the tool |

Detection is always probabilistic. What’s scarce isn’t “prove it was AI”—it’s still writing sentences with body temperature, and still being worth believing.

## Related posts

- [[openai-text-watermark-math-editing|OpenAI text watermarks: hard to forge, easy to erase by editing]]
- [[ai-era-clarity-matters|The core skill in the AI era: saying things clearly]]
- [[hanhua-groups-least-afraid-of-ai|Why fan translation groups fear AI least]]
