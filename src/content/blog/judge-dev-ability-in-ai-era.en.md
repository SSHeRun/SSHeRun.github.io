---
title: 'When Everyone Uses AI, How Do You Judge a Developer?'
description: "A V2EX career thread distilled: shared tools do not equal equal skill. Interviews should weight direction, course-correction, architecture, and delivery."
pubDate: '2026-09-05'
updatedDate: '2026-11-16'
heroImage: '../../assets/cover-judge-dev-ability-in-ai-era-en.jpg'
tags: ['Agent', '职业', '思考']
lang: en
translationKey: 'judge-dev-ability-in-ai-era'
---

> Source: [When every programmer uses AI, how do we judge ability?](https://www.v2ex.com/t/1238034) (V2EX · Career)

## Core takeaway

Ubiquitous tools do **not** flatten skill. The same AI in different hands produces very different outcomes.

Shift evaluation from "can they type code" to four signals:

1. **Direction** — how they frame and split the work  
2. **Course-correction** — can they pull the model back when it drifts  
3. **Architecture & domain judgment** — what to pick, what to refuse, how to cover edge cases  
4. **Maintainable delivery** — not a pile of vibe-coded debt

![AI collaboration desk metaphor](../../assets/inline-judge-dev-ability-in-ai-era-01.jpg)

## What the OP asked

If everyone can use AI:

- Do interviews still grill textbook Q&A?  
- Does pedigree matter more?  
- Do likable, articulate people sail through more easily?

Under the hiring questions sits a sharper one: **once coding speed stops being the yardstick, what replaces it?**

## Community consensus: same weapons, different fights

Recurring analogies:

- A strong eye technique is still only as strong as its wielder  
- Everyone owning an AK does not make battles draw  
- Same car, different drivers  
- Calculators did not retire math fundamentals — "Google-oriented coding" becoming "AI-oriented coding" follows the same logic

Portable line: **without human direction, AI digs deeper into the wrong hole.**

One reported case: a strong engineer with a mid-tier model beat a rigid thinker with a top model. Expensive tokens do not patch weak judgment.

![Same tool, different outcomes](../../assets/inline-judge-dev-ability-in-ai-era-02.jpg)

## What rises, what falls

**Rising weight:** task understanding, architecture and business depth, exception coverage, communication, self-drive and learning speed, effective output per token.

**Falling but not gone:** raw typing speed, textbook trivia as the only filter. Weak vibing still shows up as unmaintainable, counter-intuitive systems — that *is* a signal.

Interview practice splits: keep fundamentals; keep ~80% and add change-adaptivity; take-home real features in days; or stop interviewing "programmers" and interview successor roles. Cold water: many firms still run leetcode + trivia next week.

Boss lens is blunt: **story less, shipped value more.**

## Five checks for hiring or self-audit

1. **Fuzzy-brief decomposition** — direction and boundaries, not keystroke rate.  
2. **Drift catch** — plant a bad AI path; see if they notice.  
3. **Maintainability** — handover cost, failure modes, rollback — not just "it runs".  
4. **Design why** — algorithms and systems still fine; demand rationale.  
5. **Evidence of amplification** — real results scaled by AI, not a "I use Cursor" line.

## An interview task you can use as-is

Turn the five checks into a 45-minute hands-on session. Prepare a small repo of a few hundred lines and a vague brief such as "add an export to the orders list". **Any AI tool is allowed.** The interviewer watches the process:

| Time | Stage | What the interviewer does |
|---|---|---|
| 0–10 min | Clarify | Answer only what is asked; see whether they ask about format, data volume, permissions |
| 10–30 min | Build with AI | Plant a trap in the repo (say, a paginated API with a hard cap) and see if they notice what the AI missed |
| 30–40 min | Explain trade-offs | Ask "why this way?" and "what if the data grows 100×?" |
| 40–45 min | Handover | Have them write three lines for the next person who picks this up |

Score the session on these, not on lines written:

| Dimension | Good signal | Bad signal |
|---|---|---|
| Direction | Asks about boundaries before building | Pastes the brief straight into the AI |
| Drift catch | Finds the planted trap and explains it | Accepts whatever the AI says |
| Design judgment | Can name the option they rejected | Can only describe what they did |
| Maintainable delivery | Has tests or a rollback idea; the handover note is clear | Code runs but nobody can follow it |

The task rewards fluent AI users, but only when their judgment keeps up, which is exactly the "same weapon, different fighter" point.

## Three questions for yourself

- The last time the AI got something wrong, how did I find out: tests, reading the code, or a production error?
- Can I explain which option I **rejected** in my last feature?
- If I handed this code to a new hire tomorrow, how many questions would they need to ask me?

If you can answer all three, AI is amplifying your judgment. If not, it may only be amplifying your speed.

Job titles may change. Judgment and delivery quality will not. Before worrying how others get scored, ask which side of these five checks you sit on.

## Related posts

- [[ai-era-programmer-survival-guide|AI-era programmer survival guide]] (addendum: ordinary people + Agents vs programmers)
- [[ai-economy-jobs-demand|AI economy and human jobs]]
- [[programmer-35-crisis-and-self-rescue|35+ programmer crisis]]
