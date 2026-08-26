---
title: 'Software Is Not Files: KDC on Finding Materials ≠ Having Knowledge'
description: 'vivo Xiao Bo’s KDC series part 2: Representation is not Knowledge. A high-scoring RAG hit on an outdated refund policy produced a confident wrong answer — governance beats retrieval tuning.'
pubDate: '2026-08-26'
heroImage: '../../assets/cover-kdc-knowledge-engineering-not-files-en.jpg'
tags: ['AI', 'RAG', 'Knowledge Engineering']
lang: en
translationKey: 'kdc-knowledge-engineering-not-files'
---
In many enterprise AI projects, “building a knowledge base” means this pipeline:

Upload files → parse → chunk → embed → similarity search → inject context → generate.

When the chain runs green, the team declares the knowledge base done. [Part two of vivo’s Xiao Bo’s KDC series on InfoQ](https://www.infoq.cn/article/N43yEF08JflwxI0S0Uec) uses a support scenario to show a sharper distinction: **materials can be found, but that is not the same as the system knowing something.**

## Counterexample: RAG succeeded, the answer failed

![Stack of outdated policy docs](../../assets/inline-kdc-knowledge-engineering-not-files-01.jpg)

A user asks a support agent:

> I bought during a promotion and the item hasn’t shipped. Will I be charged a fee if I cancel?

The system retrieves a highly relevant refund policy — promotional orders incur a service fee on cancellation. Retrieval scores are high, the cited span fits the question, and the model faithfully answers from context.

**The answer is wrong.**

What was retrieved is a **six-month-old policy**. The new policy removed that fee, but the old PDF still lives in the shared folder and the vector index. Titles are similar; the old text even matches the user’s question more closely in embedding space.

From a RAG lens, nothing obviously broke: parsing, chunking, embedding, retrieval, and generation all worked. The system found relevant **material**, not **knowledge usable for the current decision**.


![Knowledge objects and maturity stages](../../assets/inline-kdc-knowledge-engineering-not-files-03.jpg)

## “Knowledge base” hides different problems

File systems handle storage and access control. Search helps users find material. Vector retrieval finds semantically similar chunks. RAG puts material into model context. All of these participate in a knowledge system, yet none alone answers:

- Who is the source?
- Is this still valid?
- What validation happened?
- Does it conflict with other sources?
- Which objects, times, and business conditions does it apply to?
- Can it be used for this judgment — especially high-impact ones?

When the old policy is retrieved, recall did its job. What’s missing is **version judgment, validity checks, conflict handling, and applicability boundaries**. Blaming “RAG is inaccurate” hides governance responsibilities.


![RAG as a local mechanism](../../assets/inline-kdc-knowledge-engineering-not-files-04.jpg)

## Representation ≠ Knowledge

KDC continues the chain from part one:

```
Reality → reality model → representation
```

Databases, documents, APIs, events, logs, vectors, graphs, and model context are all **representations**. They can carry knowledge, but **representation is not automatically knowledge**.

Common traps:

| Often mistaken for knowledge | What it actually is |
|------------------------------|---------------------|
| PDF | A document format — policy, expired rule, draft, or noise |
| DB row | A fact record; without version and scope, `refund_fee=0` may not apply to this order |
| Vectors / embeddings | Similarity encoding — not authority, validity, or conflict state |
| RAG chunk | Context for this retrieval — “possibly relevant,” not “verified” |
| Knowledge graph | Structured relations without provenance are still data |
| Memory | Historical signal; “used to prefer small phones” may not be current preference |

File → text → vector → context is only changing representation shape. **Format change does not create a cognitive artifact.**


![Starting with a Knowledge Card](../../assets/inline-kdc-knowledge-engineering-not-files-05.jpg)

## How KDC defines knowledge

KDC’s operational definition:

> **Knowledge** is a **cognitive artifact** that has been validated, is reusable, and reduces uncertainty in prediction, reasoning, decision, or action.

Four non-optional parts:

1. **Cognitive artifact** — grasp of facts, rules, methods, experience, constraints, relations; not raw data
2. **Validation** — supported by evidence, practice, rules, consensus, or human confirmation; fluency, high similarity, or virality are not validation
3. **Reusability** — can be referenced again under explicit conditions; “knowledge” without boundaries gets reused in the wrong scene
4. **Uncertainty reduction** — future judgments become less guessy; content that cannot support any judgment is weak engineering value

## Knowledge maturity: not just yes/no

![Knowledge versioning and governance](../../assets/inline-kdc-knowledge-engineering-not-files-02.jpg)

Models keep producing summaries and guesses; business reality keeps changing. Demanding final truth before ingest is unrealistic; writing model output straight into a knowledge base is dangerous.

KDC uses **knowledge maturity**:

```
Hypothesis → Candidate Knowledge → Verified Knowledge → Canonical Knowledge
```

This chain **can regress**: new evidence overturns verified knowledge; reality changes expire content; conflicts block use temporarily.

In the opening case, the old policy did not vanish — it remains historical material for past orders. For **current refund judgment**, it should be marked expired or superseded, not enter context with the same weight as the live policy.

Maturity changes behavior: Hypothesis triggers search and validation; Candidate enters low-risk reasoning; Verified supports stable decisions; high-risk actions may need stronger evidence and human sign-off.

## Knowledge objects: govern what enters software

After defining knowledge, engineering must handle identity, reference, traceability, and evolution.

KDC expresses this as a **knowledge object** — a bundle of responsibilities that should not stay implicit:

- Identity, source, semantics, context, evidence, version, maturity
- Conflict state, lifecycle, ownership, and permissions

For refunds, don’t store only the text “promotional orders incur a service fee.” Also track which version, who published it, effective dates, which promotions it covers, which new policy conflicts, and whether it still applies.

Objectization is not about wrapping policy text in heavy JSON. It lets the runtime answer: **what we know, why we believe it, and whether it applies to this task.**

## Where RAG belongs

Clarifying knowledge boundaries does not weaken RAG — it helps you deploy it correctly.

RAG excels at: recalling relevant material from large corpora, assembling private or fresh content into context, surfacing citable spans, and reducing reliance on parametric memory alone.

A full knowledge system still needs: source trust, version validity, conflict resolution, maturity tiers, permission boundaries, reasoning trace (“which conclusions used this?”), and feedback that validates or overturns content.

In KDC, RAG is a **local mechanism in the knowledge flow or knowledge runtime** — recall and context assembly alongside search, graphs, rules, document management, and human review. It should **not own the entire knowledge lifecycle alone**.

The opening failure is more precisely: similarity-only recall without version, validity, conflict, and applicability filters before and after retrieval. Fixes are not only chunk size and thresholds — add identity, version lineage, authority, effective status, and validation workflows.

## Practical start: one Knowledge Card

You don’t need a full knowledge platform first, and you shouldn’t “knowledge-ify” all data. Start with one piece of content that is reused often, shapes important judgments, or hurts when wrong — refund rules, approval criteria, contract risk, project lessons, or customer preference.

Ask six questions:

1. Is source and owner clear?
2. What evidence, rules, practice, or feedback supports it?
3. What scenarios apply, and where does it not?
4. Current maturity: Hypothesis, Candidate, Verified, or Canonical?
5. Version, expiry, and conflict handling in place?
6. Will it be reused and reduce uncertainty?

Then choose: **objectize** (high value/risk → lifecycle), **keep as source** (valuable material, not stable cognition yet), or **exclude for now** (governance cost exceeds reuse).

The Knowledge Card’s value is rewriting “we have this file” into “the system knows X, believes it for reason Y, and may use it when Z.”

## What this means for you

Enterprise AI still needs files, databases, vector search, graphs, and RAG. The question is never whether to use them — it’s whether to **expand a local mechanism into a full knowledge architecture**.

```
Found material ≠ acquired knowledge
Relevant chunk ≠ reliable basis
In context ≠ safe to act on
```

KDC is not about making everything complex. It asks high-value, high-reuse, high-risk cognition to carry minimal source, evidence, version, maturity, and lifecycle — so the system knows **what it currently knows**, and what **must not be treated as knowledge yet**.

Once knowledge can be referenced, the next question is judgment and action governance — how tool calls become explainable, auditable business capabilities. That’s part three of the series.

---

**Source:** [InfoQ — Software Is Not Files: KDC’s Knowledge Engineering Thesis](https://www.infoq.cn/article/N43yEF08JflwxI0S0Uec)
