---
title: 'ChatGPT 引用里只有约 25% 在 Bing 首页：一场 38 词对照实验'
description: 'r/TechSEO 实验：147 个被引站与 Bing/Google 首页重叠约 25%/24.5%，60.5% 两边都不在。详述方法、分类型结果，并拆解评论里的索引延迟、query rewrite、分母批评与复现证据。'
pubDate: '2026-11-15'
heroImage: '../../assets/cover-chatgpt-cite-bing-pageone-overlap.jpg'
tags: ['创业', '思考', 'LLM']
lang: zh
---

有人想用 **Bing 排名追踪** 顺便当 **ChatGPT 引用追踪**——逻辑是：若 ChatGPT 检索吃的是 Bing，那 page one 应该能预测它引谁。

[u/raja314 在 r/TechSEO](https://www.reddit.com/r/TechSEO/comments/1xv27pf/25_of_the_sites_chatgpt_cited_were_on_bings_first/) 用 2026-10-19 的对照实验把这句话测穿了：**被引站点里约 25% 落在 Bing 首页、24.5% 落在 Google 首页，60.5% 两边都不在。** Bing 几乎不比 Google 更能当代理。

下面按「实验怎么做 → 数字 → 楼里怎么吵」展开；评论观点按派系归类，并保留关键原声量级。

## 1. 实验动机与设计

![ChatGPT 引用与搜索首页几乎错位的氛围](../../assets/inline-chatgpt-cite-bing-pageone-overlap-01.jpg)

9 月 r/seo 吵过：ChatGPT 用的是 Google 索引还是 Bing？若答案是 Bing，SEO 团队已有的 Bing rank tracker 就能「一份数据两头用」。作者（RankControl 团队）决定用真词测「重叠有多大」。

| 项 | 做法 |
|---|---|
| 日期 | 2026-10-19 |
| 词表 | 38 个：软件 / 购物 / how-to / 品牌搜索 |
| SERP | 同一浏览器、界面设为 US English；每个词查 Bing 与 Google 的 page one |
| ChatGPT | 网页端 + 数据商 live feed；记录每一次引用的**站点** |
| 匹配粒度 | **域名级**（Forbes 不同文也算同站命中）——偏松，不是 URL 精确匹配 |
| 限制 | 每词只跑 1 次、单日；浏览器物理位置在美国外 |

作者自己点名的限制很重要：单次方差大；域名匹配会高估「真重叠」。

## 2. 主结果：重叠薄，空白厚

38 词里，ChatGPT **真正联网搜索 26 次**；另外 12 次多靠记忆（how-to / what is 居多）。26 次共引用 **147** 个不同站点。

| 指标 | 数值 |
|---|---|
| 落在 Bing page one | **25%** |
| 落在 Google page one | **24.5%** |
| 两边都有 | **10%** |
| 两边都没有 | **60.5%** |
| 搜索候选池（cite 前） | 220 站 |
| 候选池里在 Bing 首页 | **18.6%** |
| 候选池里在 Google 首页 | **10%** |

读法：

- Bing 与 Google 作为「被引站是否已在原词首页」几乎打平——**没有「Bing 代理特权」。**  
- 候选池里 Bing 占比高于 Google（18.6% vs 10%），楼里有人解读为检索侧更偏 Bing feed，但**最终 cite 仍大量落在池外/首页外**。  
- **60.5%** 才是刺眼数字：多数被引站，按你追踪的原词去看两边首页，根本不在。

### 分类型

| 类型 | 例 | Bing 重叠 | Google 重叠 |
|---|---|---|---|
| 品牌搜索（最好） | asana vs monday | ~37% | ~33% |
| 软件类（最差） | help desk software | ~17% | ~20% |

品牌词变体少、官网常同时出现在 SERP 与引用；宽软件词被 query expansion 打散，重叠塌缩。

## 3. 关键机制：它不搜你追踪的那个词

![短词种子扇出成长查询再选源的氛围](../../assets/inline-chatgpt-cite-bing-pageone-overlap-02.jpg)

主帖给了一个 rewrite 样本：

- 你追踪：`best crm for small business`  
- ChatGPT 实际搜：`best CRM software for small businesses 2026 pricing features comparisons`  
- 结果：9 个被引站里，**只有 1 个**在原词的 Bing 首页上。

楼里 OP 补充（14 个词子集）：

| 对照 | 站点重叠 |
|---|---|
| 原词 Bing page1 vs rewrite 的 Bing page1 | 仅 **23%** 相同 |
| 被引站落在 rewrite 的 Bing page1 | **19%**（同子集上原词是 24%） |

也就是说：就算你去追 rewrite 后的 SERP，也**未必**更能预测最终 citation——至少在这个子集上没有变好。

**Payroll 反例（说明「名单」有时比原词排名要紧）：**  
原词几乎对不上；rewrite 主动点名 Gusto / QuickBooks Payroll / OnPay / ADP 并要 official pricing 后，7 个被引站里 **5 个**落在该 rewrite 的 Bing 首页，**原词首页为 0**。

## 4. 评论观点拆解

### A. 独立索引与延迟（最高赞顶楼 ↑3）

**tamtamdanseren**：别默认直连 live search；可能是独立索引；应做跨时间延迟测试。

**OP 回应要点：**

- OpenAI 文档：有时会改写查询并提交给 search providers，并链到 Microsoft 隐私声明 → Bing 是 feed 之一，不是唯一。  
- 网络流量里被称为 **Labrador** 的自有索引研究：其返回与 Bing top20 仅约 **1.5%** 重叠。  
- Cloudflare 2026-10-15 宣布与 OpenAI 的爬虫发现/再访试点。  
- 下次实验想法：用「上月 Bing 首页」预测「本月引用」。

### B. 品牌词 vs 宽词

**Sakshambaranwal25**：37% 对品牌合理；17% 对 help desk 类证明 expansion 杀伤力。

**OP**：品牌站常「两边都有」；大切口上可能更重要的是进模型/检索的**已知名单**，而不是你那条 seed keyword 的名次。

### C. 外部复现 + 页面类型（Ishan_GS / Growthspree）

| 他们的证据 | 数字 |
|---|---|
| 400 个 B2B 买家问题 | ChatGPT 链接落在 Google page1 ≈ **21%**（与本帖 24.5% 同量级） |
| 200 题：短关键词 vs 长问（中位 6 vs 22 词） | 两边 page1 站点重叠仅 **24%** |
| 链接落点 | **98%** 公司站；约 **50%** 首页、**23%** 定价页 |

结论：rank tracker 按「help desk software」这类词理解的排名，天然对不上「被引的是首页/定价页」。他们主张直接 track citations（产品：Salient）。

![被引更多是官网与定价页的氛围](../../assets/inline-chatgpt-cite-bing-pageone-overlap-03.jpg)

**OP 附和**：9 月 12 个买家问、94 个被引页——仅 1 个 roundup，其余多为 pricing / help / product；漏检主因更像「页面类型」，不一定是「哪个索引」。

### D. 三层模型（Upstairs_Control_611）

把链路写成：

```text
tracked keyword → AI-rewritten search / fan-out → final cited source set
```

即使上游共享部分检索基建，**原词 page-1 也不能预测最终 cite**。60.5%「两边都不在」支持：塑造引用的是 rewrite + 源选择，不是你看板里的那条 SERP。排名只配当 supporting context。

**brilliantzen** 补充观测面：服务器日志里的 AI crawler UA、chatgpt.com / perplexity 推荐流量；并夹带自家 CMS 宣传——有用的是「抓取 ≠ 被写进答案」这句。

### E. 「Bing 喂检索、模型从更大集合挑」（romerogers）

25% 只略高于 24.5% → Bing tracker 仍漏约 **3/4** 被引站。候选池 18.6% vs 10% 可读成 Bing 更参与 retrieval，但最终挑选远宽于 page one。建议 log rewrite；并问 60%「都不在」是否多为 listicle——OP 称本帖未分桶，另测里更偏 vendor 页。

### F. 稳定性（FailonOB_SEO ↔ OP）

单次单日会晃。OP 同日另测：5 个买家问 × 3 跑——28 个被点名产品里 22 次次出现，但 **2/5** 题的 top pick 变了（这是**名字**，不是 URL；citation 可能抖得更凶）。下次计划：同词多日。

### G. 分母与预测方向（ArfadiaOfficial）——方法论核心批评

![ranked-only / cited-only / 重叠三分区的氛围](../../assets/inline-chatgpt-cite-bing-pageone-overlap-04.jpg)

关键点：**「被引站中有多少也在首页」≠「在首页则有多大概率被引」。**  
前者从 citation 出发，说不清「排上了但从未被引」的那些站。

正确测「rank tracking 是否可预测」应做 **per-query** 表：

| 格子 | 含义 |
|---|---|
| ranked ∩ cited | 真重叠 |
| ranked only | 排上了但没被引 |
| cited only | 被引了但不在你看的首页 |

并要求：同分同地；先按 query 内比较再汇总；记录候选池大小；拆开 **domain 重叠 vs page 重叠**。

**OP 承认方向**：本实验是 citation→rank 方向。仅有的「反过来」线索：

| 引擎 | #1 站被 ChatGPT 引用的词数 |
|---|---|
| Bing | **7 / 26** |
| Google | **11 / 26** |

也确认匹配是站点级，Forbes 不同文也会算命中——下一版应改 page-level。

## 5. 可带走的结论

1. **不要用 Bing（或 Google）首页排名代理 ChatGPT 引用。** 25%≈24.5%，且 60.5% 两边都不在。  
2. **直接跑 prompt、记录 citation**；需要的话再并排对照多引擎。  
3. **记录 rewrite 查询**；宽词上「进入候选/品牌名单」有时比 seed keyword 名次更关键。  
4. 下一代实验清单：同跑同地、page-level、per-query 混淆矩阵、跨日延迟、候选池分母、首页/定价页分桶。

相关阅读：本站 [[geo-vs-seo-same-or-separate|GEO 和 SEO 是一回事吗]]——底座可共享，出口已经分叉；**引用 ≠ 排名**。

飞书细表：[实验与评论拆解](https://ucnmc9l8zk8f.feishu.cn/docx/G7f0dEQGpouX3TxnXdCcJeZCnbg)。

## 相关文章

- [[geo-vs-seo-same-or-separate|GEO 和 SEO 是一回事吗？Reddit 三帖把话说穿了]]
- [[china-ml-research-volume-reddit|中国机器学习研究体量讨论]]
- [[overseas-product-zero-cost-cold-start|出海产品低成本冷启动]]
