---
title: 'Agent 敢放手的前提：Stack Overflow 谈 AI 上下文架构'
description: '上下文架构不是 RAG 管道，而是护栏、Scope、信任分与人机回环。Stack 工程与产品负责人拆解基础设施/架构/工程三分法，以及自建时常被低估的冲突消解与可预期性。'
pubDate: '2026-08-26'
heroImage: '../../assets/cover-stack-overflow-ai-context-architecture-build-buy.jpg'
tags: ['AI', 'Agent', 'RAG']
---

RAG 搭好了，Agent 还是乱答、乱翻 Slack、把「创新脑暴频道」里的未上线想法当事实？问题往往不在模型，而在**上下文架构**——Stack Overflow 这篇 [No Dumb Questions 访谈](https://stackoverflow.blog/2026/08/14/ndq-ai-context-architecture-build-buy/) 把这件事讲得很直白。

## 三个词别混用

| 概念 | 干什么 |
|------|--------|
| **上下文基础设施** | 存什么、怎么检索、怎么喂给模型（向量库、索引、规则 Markdown） |
| **上下文架构** | 为什么这样设计——边界、协议、信任模型（MCP 选型、Scope、HITL） |
| **上下文工程** | 具体实现——用什么语言写 RAG、怎么重排序 |

文中的汽车类比：造汽车还是船是**架构**；选型号发动机是**工程**；零件供应链是**基础设施**。MCP 偏架构；RAG 三者都沾。

## 架构在解决什么

**1. 检索边界**  
让 Agent 查「轮胎」，图书馆会返回飞机、自行车、手推车的书——都对，但你只要跑车胎。靠 prompt 说「只看跑车」不够；要**限制它能碰的知识集合**。

**2. Agent 记忆**  
任务 refined 成「跑车」后，跨会话仍应记得进度。10 个、100 个 Agent 并行时，状态管理是硬需求。

**3. 护栏**  
- 信任分：高/中/低，中低不直接行动  
- 人机回环：知识不完整时走 SME 校验，不让 Agent 瞎猜  
- 目标：输出**可预期**，才敢委派

**4. 权限两层**  
- 继承用户源权限（进不了的频道 Agent 也不进）  
- **Scope** 再收窄：「我能看全公司，Agent 只准用我的产品域」  
写入也要控：产出是否进团队知识池。

## 技术流程：撒网再挑鱼

Stack Internal 的做法是多步过滤：按问题选检索策略 → 关联映射 / 表格式取用 → 信任分 → **重排序**。Doug 的比喻：先广撒网，再扔牡蛎、留对的鱼、再按尺寸筛——好架构还应**补盲区**（例如根据车型给正确胎压），且**不绑死单一模型**。

Ash 强调另一维度：**一致性与可预测性**。同问题多人问，答案应稳定——这是 Agent 从「玩具」变「同事」的前提。顺带还有 **Token 成本**：上下文越窄，遍历越便宜——build vs buy 讨论里常被忽略。

## 自建 vs 购买：难的不只是代码

技术侧 RAG 都能写。Ash 认为真正贵的是：

- Slack、Drive、Confluence、Jira… 汇入后的**冲突、残缺、错误**怎么识别与消解  
- **信任**：老手靠「是否符合我对这份报告的预期」判断；vibe coding 新手没有这种校准  
- 把排序、过滤、信任做成**系统化产品**，需要大量哲学对话，不只是 embedding + CRUD

购买方案（他们推 Stack Internal）的卖点是：常见边缘场景已归类（约二十类），客户不必从零踩坑。

## 对你意味着什么

1. **Harness 设计**和模型选型一样重要——见 Saul Agent 24 小时创业实验的反面教材  
2. Scope、信任、HITL 应是一等公民，不是上线后补丁  
3. 评估自建时多问三句：冲突怎么办？谁为脏数据负责？无经验用户凭什么信输出？  
4. 收窄上下文既是**质量**也是**成本**杠杆

---

**原文：** [What is AI context architecture? Why not just build your own?](https://stackoverflow.blog/2026/08/14/ndq-ai-context-architecture-build-buy/)
