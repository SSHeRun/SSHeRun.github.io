---
title: 'Only ~25% of ChatGPT’s Cited Sites Sat on Bing Page One'
description: 'A TechSEO test of 38 keywords: 25%/24.5% of cited sites were on Bing/Google page one; 60.5% on neither. Methods, segment splits, and a comment map on indexes, rewrites, denominators, and replications.'
pubDate: '2026-11-15'
heroImage: '../../assets/cover-chatgpt-cite-bing-pageone-overlap-en.jpg'
tags: ['创业', '思考', 'LLM']
lang: en
translationKey: 'chatgpt-cite-bing-pageone-overlap'
---

If ChatGPT retrieval is “basically Bing,” then **Bing rank tracking** should double as **ChatGPT citation tracking**.

[u/raja314 on r/TechSEO](https://www.reddit.com/r/TechSEO/comments/1xv27pf/25_of_the_sites_chatgpt_cited_were_on_bings_first/) stress-tested that hope on 2026-10-19: **~25% of cited sites were on Bing page one, 24.5% on Google’s, and 60.5% on neither.** Bing is not a privileged proxy.

Below: experiment design → numbers → how the thread argued, with factions and magnitudes kept intact.

## 1. Motivation and method

![Atmosphere: AI citations barely overlapping two SERP ladders](../../assets/inline-chatgpt-cite-bing-pageone-overlap-01.jpg)

In September, r/seo argued whether ChatGPT uses Google’s index or Bing’s. If Bing, existing Bing trackers become free ChatGPT monitors. The author (RankControl) measured overlap with real keywords.

| Item | Protocol |
|---|---|
| Date | 2026-10-19 |
| Keywords | 38: software / shopping / how-to / brand |
| SERPs | Same browser, US English UI; Bing + Google page one each |
| ChatGPT | Web app + a data vendor live feed; log every **cited site** |
| Match grain | **Domain-level** (different Forbes URLs still count)—loose, not exact URL |
| Limits | One run per keyword, one day; browser outside the US |

Those limits matter: single-shot variance; domain matching inflates “true” overlap.

## 2. Main results: thin overlap, thick neither

Of 38 keywords, ChatGPT **actually searched the web for 26**; 12 were answered mostly from memory (how-to / what-is). Across 26 searches it cited **147** distinct sites.

| Metric | Value |
|---|---|
| On Bing page one | **25%** |
| On Google page one | **24.5%** |
| On both | **10%** |
| On neither | **60.5%** |
| Pre-cite candidate pool | 220 sites |
| Pool share on Bing page one | **18.6%** |
| Pool share on Google page one | **10%** |

Reading:

- Bing ≈ Google as “was the cited site already on page one for the seed keyword”—**no Bing proxy privilege**.  
- The pool leans Bing-er (18.6% vs 10%), which some read as retrieval feed bias, yet **final cites still miss page one massively**.  
- **60.5%** is the headline: most cited sites aren’t on either page one for the tracked keyword.

### By segment

| Segment | Example | Bing overlap | Google overlap |
|---|---|---|---|
| Brand (best) | asana vs monday | ~37% | ~33% |
| Software (worst) | help desk software | ~17% | ~20% |

Brand queries vary less; vendor sites often appear in both SERP and cites. Broad software terms get shredded by expansion.

## 3. Mechanism: it doesn’t search your tracked string

![Atmosphere: a short seed fanning into long rewritten searches](../../assets/inline-chatgpt-cite-bing-pageone-overlap-02.jpg)

Rewrite sample from the OP:

- Tracked: `best crm for small business`  
- ChatGPT searched: `best CRM software for small businesses 2026 pricing features comparisons`  
- Outcome: **1 of 9** cited sites sat on Bing page one for the original keyword.

OP follow-up on 14 keywords:

| Comparison | Site overlap |
|---|---|
| Seed Bing page1 vs rewrite Bing page1 | only **23%** the same |
| Cited sites on rewrite Bing page1 | **19%** (vs 24% for the seed on the same 14) |

Chasing the rewritten SERP did **not** improve citation prediction here.

**Payroll counterexample (names beat seed rank):** after the rewrite named Gusto / QuickBooks Payroll / OnPay / ADP and asked for official pricing, **5 of 7** cited sites were on that rewrite’s Bing page one—**zero** for the original keyword’s page one.

## 4. Comment map

### A. Separate index + lag (top comment ↑3)

**tamtamdanseren:** don’t assume live SERP access; maybe a separate index; test delays over time.

**OP:** OpenAI docs say queries may be rewritten and sent to search providers (Microsoft privacy link) → Bing is one feed; **Labrador** research claimed ~**1.5%** overlap with Bing top20; Cloudflare×OpenAI crawler pilot (Oct 15); next idea: last month’s Bing page one → this month’s cites.

### B. Brand vs broad

**Sakshambaranwal25:** ~37% fits low-variation brand queries; ~17% shows expansion damage on software heads.

**OP:** brand sites often co-occur; for big categories, making the **known-name list** may matter more than seed rank.

### C. Replication + page types (Ishan_GS / Growthspree)

| Evidence | Number |
|---|---|
| 400 B2B buyer questions | ~**21%** of ChatGPT links on Google page1 |
| 200 topics: short vs long (median 6 vs 22 words) | only **24%** page1 sites in common |
| Link destinations | **98%** company sites; ~**50%** homepages, ~**23%** pricing |

Rank trackers keyed to “help desk software” won’t see homepage/pricing cites. They track citations directly (Salient).

![Atmosphere: vendor doors lit, review stalls dim](../../assets/inline-chatgpt-cite-bing-pageone-overlap-03.jpg)

**OP:** September 12 buyer questions → 94 cited pages; only one roundup—pricing/help/product dominate misses.

### D. Three-layer model (Upstairs_Control_611)

```text
tracked keyword → AI-rewritten search / fan-out → final cited source set
```

Shared upstream retrieval ≠ seed page-1 predicts final cites. The **60.5% neither** is the tell. Rankings are supporting context only.

**brilliantzen** adds log/referral angles (and product pitch): crawler fetch ≠ being written into an answer.

### E. Bing feeds retrieval; model picks wider (romerogers)

25% barely above 24.5% → a Bing tracker still misses ~**3/4** cites. Pool 18.6% vs 10% can mean Bing helps retrieval while selection stays wide. Log rewrites. OP: rewrite SERPs didn’t unlock cites; 60% neither not bucketed by type here.

### F. Stability (FailonOB_SEO ↔ OP)

One-shot days wobble. Same-day mini-test: 5 questions × 3 runs → 22/28 named products always appeared, but top pick flipped on **2/5** (names, not URLs—citations may move more). Plan: same keywords across days.

### G. Denominator critique (ArfadiaOfficial)—the methodology core

![Atmosphere: ranked-only / cited-only / overlap light zones](../../assets/inline-chatgpt-cite-bing-pageone-overlap-04.jpg)

**“Share of cited sites that also rank page one” ≠ “chance a page-one site gets cited.”** The first starts from citations and ignores ranked-but-never-cited.

To test rank tracking as a **predictor**, build a **per-query** table:

| Cell | Meaning |
|---|---|
| ranked ∩ cited | true overlap |
| ranked only | ranked, never cited |
| cited only | cited, not on the SERP you watched |

Same run/location; compare within query before pooling; record pool size; split **domain vs page** overlap.

**OP agrees** on directionality. Weak reverse signal only:

| Engine | Keywords where #1 site was cited |
|---|---|
| Bing | **7 / 26** |
| Google | **11 / 26** |

Matches were domain-level—next version should be page-level.

## 5. Takeaways

1. **Don’t proxy ChatGPT citations with Bing (or Google) page-one ranks.**  
2. **Run prompts and log citations** directly; optional multi-engine panels.  
3. **Log rewrites**; for broad terms, candidate/brand-list membership can beat seed rank.  
4. Next experiments: same run/location, page-level, per-query confusion matrices, multi-day lag, pool denominators, homepage/pricing buckets.

Related: [[geo-vs-seo-same-or-separate|Is GEO the same as SEO?]]—shared base, forked exits; **citation ≠ ranking**.

## Related posts

- [[geo-vs-seo-same-or-separate|Is GEO actually separate from SEO? Three Reddit threads]]
- [[china-ml-research-volume-reddit|China ML research volume on Reddit]]
- [[overseas-product-zero-cost-cold-start|Low-cost overseas cold start]]
