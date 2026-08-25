---
title: 'A programmer''s survival guide in the AI era'
description: 'AI is not here to take senior programmers'' jobs. It is here to assist them. The "35-year-old crisis" story flips: experienced engineers become more valuable, not less — if they can decide, constrain, and verify.'
pubDate: '2026-03-24'
heroImage: '../../assets/cover-ai-era-programmer-survival-guide-en.jpg'
tags: ['职业', '思考']
lang: en
translationKey: 'ai-era-programmer-survival-guide'
---

> **A warning:** this piece will fight the usual "35-year-old programmer crisis" story. AI is not here to steal senior jobs. It is here to assist them.

## 1. The cruel fact: CRUD boy is dead

![An empty desk and a system drawing](../../assets/inline-ai-era-programmer-survival-guide-01.jpg)

I could not sleep. I thought about what AI does to programmers.

**The fact is blunt:** if your job can be fully described inside 200K tokens, AI is a one-hit kill.

Meaning:

- **CRUD** — dead
- **UI interaction logic** — dead
- **simple business flows** — dead
- **standard API work** — dead

ChatGPT in 2023. Cursor and Windsurf in 2024. Claude Code, Codex, OpenClaw in 2025.

**Agents flipped the old programming mode — people no longer have to write the code by hand.**

From "hand-write code" to "drive the AI," the center of gravity moved:

```
Old:  need → understand → design → hand-write → test → ship
AI:   need → understand → design a Skill → generate → verify → ship
```

**So: is a programmer still worth anything? Where do 35+ engineers go?**

---

## 2. The counter-intuitive fact: 35+ just got more valuable

### The finding that breaks the story

In the AI era, **experience did not depreciate. It spiked.**

Why?

AI changed *how* we write code. **It did not change the nature of deciding.**

AI can replace people who solve problems. **It still cannot replace people who pose them.**

### Seven things AI still cannot do

| Capability | Why the model fails | Who is better |
|------------|---------------------|---------------|
| **Defining the need** | Raw need comes from watching a real world | 35+ |
| **Trade-offs** | Priority, values, strategy | 35+ |
| **Drawing the boundary** | Knowing which "solutions" plant landmines | 35+ |
| **Managing constraints** | The model does not know your time, budget, or team | 35+ |
| **Cost** | Estimating three-year tech debt | 35+ |
| **Strategy** | Deep feel for people, orgs, an industry | 35+ |
| **Judging the result** | "It runs" ≠ "we did the right thing" | 35+ |

**The point:** AI is smart. It is an *executor*, not a *decider*.

---

## 3. The new job: from code peasant to AI trainer

### Old skills vs AI-era skills

| Dimension | Then | Now | Change |
|-----------|------|-----|--------|
| Writing code | very high | average | ↓ |
| Understanding the need | average | very high | ↑ |
| System design | high | very high | ↑↑ |
| Algorithmic thinking | high | very high | ↑↑ |
| Directing / supervising | low | very high | new |
| Quality verification | high | very high | ↑ |

**The era changed the ask:**

- **Then:** clean split — PM owns the need, architect owns design, programmer owns implementation
- **Now:** fused — one person has to understand the need, the architecture, and the algorithms, then drive the AI

### Example: an order API

**Wrong — ask the model directly:**

```
Prompt: "Implement an order API that updates inventory and writes a log."

You get:
processOrder(order);
updateInventory(order);
writeLog(order);
```

**Problem:** under concurrency every request blocks. The bottleneck is obvious.

**Right — ask with direction:**

```
Prompt: "High-concurrency order API. Inventory and logs must be async. Core path under 200ms."

You get:
// confirm the order on the critical path
// inventory + log via thread pool / queue
// the API returns fast and stays stable
```

**The difference** is not more implementation detail. It is **constraints and direction** from system design and algorithmic thinking.

---

## 4. The "code traitor's" survival kit (how not to be replaced)

### The strategy: make your work something the model cannot "see"

AI's fatal weaknesses:

1. **Hallucination** — wrong, confidently
2. **Stale knowledge** — a cutoff date
3. **Complexity analysis often wrong** — the algorithm may not be optimal
4. **Edges get dropped** — happy path works, special cases bug

**The deepest hole: it cannot summarize a law that was never named.**

If a thing cannot be tokenized correctly, you have a weapon.

### Three anti-AI axes (the satirical path)

**1. Work without names and patterns**

- GoF and Martin Fowler are the original "code traitors" — they named a pile of know-how
- One *name* explains the job; the model learns it in one pass
- **Counter:** if your process has no name, do not name it, and do not publish it

**2. Invent wheels. Write DSLs**

- Blow an attention-poor model's context, or push it into hallucination
- **The Lisp curse:** if you want the job to stay yours, invent wheels and write DSLs

**3. Stay closed. Shame whoever opens it**

- Open source is "entry-level code treason" — without that much public source, models could not have learned this fast
- **Counter:** invent wheels, keep them closed. If someone publishes and the model trains on it, condemn them

### Three tricks that break a model's memory

1. **Semantic drift** — terms the model cannot map
2. **Context injection** — pack in irrelevant information
3. **Attention-window blowup** — overflow the context

---

## 5. The real senior advantage is not "anti-AI"

### Embrace it. That is the actual path

**Fighting AI is the worse move. Riding it is the better one.**

What 35+ actually has:

| Advantage | Why it matters | Weight |
|-----------|----------------|--------|
| Years of system design | See the real problem, skip the crater | very high |
| Many architectural patterns | Know which idea fits | very high |
| Lived through performance work | Know when and how to optimize | high |
| Depth of business | Dig the real need out of the stated one | very high |
| Deep technical feel | Verify whether the model's plan is sound | very high |
| The whole picture | See the system and make the trade | high |

### Four checks on AI code

| Lens | The question | What to look at |
|------|--------------|-----------------|
| Complexity | Does the time complexity meet the need? | Is it really O(log n), or O(n²)? |
| Edges | Any special cases dropped? | Empty, one, huge |
| Business | Did the code understand the business? | Is inventory decrement atomic? |
| Performance | Tested in a real environment? | What QPS on one box? |

**An experienced programmer can smell a problem in one glance.**

---

## 6. Three crash scenes

![Finding a hidden crack in the structure](../../assets/inline-ai-era-programmer-survival-guide-02.jpg)

### Case 1: a rate limiter that does not scale

Ask the model for an API rate limiter. It gives a clean token-bucket implementation. Logic is correct.

**But:** on every request it walks the whole token list to expire old ones — O(n). At high QPS that step *is* the bottleneck.

**Right:** timestamp math or lazy update. O(1) per request.

### Case 2: offset pagination

Ask for a product-list page API. It writes the textbook `LIMIT offset, size`.

**But:** page 1000, `OFFSET 9990` means the database scans and discards 9990 rows. It only gets slower.

**Right:** keyset / cursor pagination: `WHERE id > last_id LIMIT size`.

### Case 3: a search box debounce

Ask for a live search box. It gives a simple debounce: send after 300ms of silence.

**But:** responses can return out of order. A later request can finish first; the UI shows a result that does not match the last keystroke.

**Right:** cancel in-flight requests (AbortController) or stamp requests and drop stale results.

**A junior may not see these. A senior sees them in one pass.**

---

## 7. The future: AI does the work. A person sets the direction

### Shift 1: from directing to supervising

**Now (2025–2027):**

```
You define the need → direct a plan → AI writes → you verify → ship
```

**Later (2026–2030):**

```
You describe the need → AI plans + designs → writes → verifies → ships
```

Your job moves from "direct" to "supervise."

### Shift 2: from writing code to posing the need + supervising

As models mature, what you need is:

- people who understand the business and ask good questions
- people who can define boundaries and constraints
- people who can set goals and priority
- people who can verify quality

### Shift 3: stronger AI *raises* the bar on programmers

**Verifying AI is much harder than writing the code.**

You cannot tell at a glance whether a generated system is sound. You have to understand the global design, why each decision was made, where the latent defects sit.

**So the future is not "programmers get replaced." It is "programmers who only haul bricks get replaced."**

---

## 8. How 35+ can take the opening

### Learn a method for directing AI

1. **Understanding the need** — what is true now, what is the goal, what we will do, how we will know
2. **Designing the system** — scale, constraints, architecture, boundaries, metrics
3. **Framing the problem** — turn a fuzzy business into a model you can compute and optimize

### Learn a system of architecture and algorithmic ideas

You do not have to hand-write every algorithm. You do have to:

- understand the core of each design and idea
- know which problem gets which design
- use that to direct the model

### Keep practicing verification

Every time the model hands you code, ask:

- what is the complexity?
- will it run at *my* data size?
- any edges missed?
- is there a better algorithm?
- will this architecture scale?
- any single point of failure?

**The first weeks take time. After a month or two you get an instinct — one glance tells you if it is wrong.**

---

## 9. Bottom line: in the AI era, 35+ is the golden age

### Recap

1. **AI changed encoding, not engineering** — you move from executor to decider
2. **Experience is not baggage; it is how you drive the model** — the pits you fell in *are* the constraints it needs
3. **You do not have to write the code. You have to know good from bad** — verification is scarcer than coding
4. **The real risk is not age. It is stopping** — seniors who refuse the tools get replaced too

### Two paths

**Worse: fight AI, play "code traitor"**

- work without names and patterns
- invent wheels, write DSLs
- stay closed, do not publish

**Better: embrace AI, become an AI trainer**

- learn a method for directing models
- own architecture and algorithmic thinking
- keep practicing verification

### Last line

Code goes stale. Frameworks die. **Understanding of the problem, and judgment, only compound with time.**

An experienced programmer plus AI does not even have to stay employed — contracting, part-time, a one-person company are all open.

**For people with experience, this is a rare opening.**

What do you think?

---

## References

- [Why programmers 35+ thrive in the AI era](https://github.com/microwind/algorithms/blob/main/start-here/Why-Programmers-35-Plus-Are-Thriving-in-AI-Era.md)
- [码奸 — est の 输入输出和出入](https://blog.est.im/2026/stderr-10)

## Related posts

- [[programmer-35-crisis-and-self-rescue|The 35-year-old programmer crisis — and how to get out]]
- [[software-engineering-splits-three|Software engineering is splitting into three layers]]
- [[ai-fatigue-truth-10x-workload|AI didn't 10x your output. It 10x'd the work.]]
