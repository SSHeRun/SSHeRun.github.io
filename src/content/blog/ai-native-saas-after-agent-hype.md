---
title: 'Agent 热潮退烧后：传统 SaaS 没戏，牌桌留给 AI-native'
description: 'Atlassian 财报再起软件叙事。「Agent 即员工」撞上企业现实后，SoR、eval、judgment 重新值钱。传统加聊天框没戏；未来是 AI-native 垂类。'
pubDate: '2026-09-07'
heroImage: '../../assets/cover-ai-native-saas-after-agent-hype.jpg'
tags: ['创业', 'Agent', '思考']
lang: zh
---

> 观点整理，并对照 [Atlassian FY26 Q4 股东信](https://www.atlassian.com/blog/announcements/shareholder-letter-q4fy26)、[Anthropic multi-agent 工程文](https://www.anthropic.com/engineering/multi-agent-research-system)、[Agent evals](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)、[METR time horizons](https://metr.org/time-horizons/)。

## 核心观点

SaaS 股疲软大半年后又被讲起来了。看 Atlassian FY26 Q4：总收入同比 +28%，云收入 +31%。但这不是「传统席位软件王者归来」。

更贴近现实的判断是：年初那波 **「Agent 即员工」** 叙事，终于碰到真实企业环境了。账单、等待、重试来了；行业数据和 eval 还得自己做；**system of record 绕不过去**。于是 workflow、上下文、judgment、行业 benchmark 又有价值了。

结论先说清楚：**传统 SaaS 继续按老逻辑做，我不看好。未来属于 AI-native SaaS。** 在旧产品上加一个聊天框，解决不了。

![企业上下文与 Agent 工作流隐喻](../../assets/inline-ai-native-saas-after-agent-hype-01.jpg)

## 软件叙事为什么回来了

资本市场最爱合力炒一个叙事。从需要证明自己 AI-native，到 token 烧了一大堆开始追问效果——世间事分分合合。

Atlassian 股东信里真正用力的，也不是「我们有个聊天框」，而是 **Teamwork Graph / System of Work**：模型可以按 token 雇，上下文雇不来；图上 grounding 能让答案更准、token 更省；人类和 Agent 共用同一套工作系统。这和企业侧正在发生的回摆同向。

年初从 OpenClaw 到 Claude Code，很容易一路外推：大模型可以完成一切任务，自己探索 workflow、tool use、生成界面。那还要这些软件干什么？跑到现在才发现：能跑 task，和能当「员工」，中间隔着一整座企业现实。

## 四条仍成立的判断

4 月份跟团队说过，现在还是这个判断。

### 1. Token cost 会成为最大关注点之一

每百万 token 便宜，不代表把一件事做对的总成本便宜。

Anthropic 在工程文章里披露过（他们当时的系统数据，不是所有 Agent 的固定倍数）：Agent 的 token 用量约为普通对话的 **4 倍**，多 Agent 系统约为 **15 倍**。

还有一种常被漏算的成本：如果你面前开了 10 个 terminal，一整天在 monitor 每个任务，这部分**监督劳动**也得算进去。

### 2. Eval 才是瓶颈

除了 coding，很多公司连自己业务里的 eval 怎么做都还没搞清楚。行业 benchmark 当然已经有了，但「模型在榜单上得了多少分」和「这个决策对我们公司到底对不对」，是两回事。

Coding 的反馈相对明确，也不是测试通过就万事大吉。

### 3. 能跑 task ≠ Agent 员工

后者需要企业上下文，需要可信任、consistent 的判断，需要知道什么能自己决定、什么必须找人。

问题是：企业过去为什么做这个决策，放弃了哪些选项，背后有什么约束，这些东西到底有没有 document？如果没有，接上 CRM 也不会凭空长出来。

还有 long-horizon loops：失败怎么恢复，状态怎么保存，结果怎么验——不能靠一句「让它一直跑」。METR 自己也提醒，**任务跨度不能直接等同真实岗位工作能力**。

### 4. 需要更强的 observability

要看 traces：token 烧到哪里，哪里失败，哪里反复绕圈。哪些经过验证的路径可以固定成 workflow、skill、经验，未来不用每次重新探索？同一个流程，每次都花钱让模型重新摸索一遍，这个成本迟早有人来算。

![Token、Eval 与可观测性](../../assets/inline-ai-native-saas-after-agent-hype-02.jpg)

## AI-native SaaS 长什么样

我认为它至少应该是：

1. **业务数据默认让 Agent 在权限范围内读取和操作。**  
2. **人类要看的界面，每个用户可以自己和 Agent 定制，随时调整。**  
3. **决策、依据和结果，是数据里面最重要的一环。**  
4. **数据、分析、行动一体化。** 比传统 SaaS 更垂直，但更纵深——一个场景的上下游都做进去。  
5. **最后会做自己的行业模型。** 模型＋应用会成为标配；可以微调、蒸馏，不等于每家公司都从零训练基础模型。

所以真正做深的垂类 app，会成为新的 neo labs。真实任务、行业数据、eval、结果反馈都在手上，模型怎么改才有用，它们最清楚。

这和「软件不值钱」并不矛盾：贬值的是人人能 vibe 出来的功能壳；**值钱的迁到 SoR、上下文、判断、行业闭环，以及能反哺模型的垂类深度**。形态上，则必须是 Agent 可读可写、人类界面可塑的那一类——而不是席位订阅加一个对话框。

## 传统厂商为什么危险

Enterprise 当然还需要 copilot、界面、审批，这些需求不会突然消失。但老公司还要保护原来的产品、席位收入和交付方式。我赌它们改不过来，至少没有 AI-native 公司快。

## 两个 meta-takeaways

1. **管他资本在炒什么，真正解决客户问题，你才能留在牌桌上。**  
2. **留在牌桌上，才是最重要的。**

## 相关文章

- [[software-not-valuable-ai-era|AI 时代软件不值钱了？斩杀线以下会，定制也可能跟着贬]]
- [[lovable-future-saas-agent-capabilities|Lovable：未来 SaaS 是 Agent 可调用的 Capabilities]]
- [[muse-fast-code-slow-delivery|AI 写代码飞快，交付却没变快：小红书 Muse 的 Agentic 架构]]
