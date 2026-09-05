---
title: '意外黑板：多 Agent 如何用仓库互相协调'
description: 'Thoughtworks 超代理实验里，计划文件加频繁 rebase 意外变成 blackboard；协调通道最终应独立于源控。'
pubDate: '2026-09-05'
heroImage: '../../assets/cover-accidental-blackboard-agents.jpg'
tags: ['Agent', '工程', '工具']
lang: zh
---

> 原文：[An Accidental Blackboard](https://martinfowler.com/articles/exploring-gen-ai/an-accidental-blackboard.html)  
> 系列：Martin Fowler · Exploring Gen AI（Thoughtworks）

## 核心观点

10 名工程师在巴塞罗那做「超代理」（hyper-agentic）练习，四天搭出航空 **IROps** 系统。真正值得带走的，不是交付速度，而是一个意外发现：

**仓库里的计划文件 + 持续 commit/rebase，让 Agent 把 monorepo 当成了经典 blackboard（黑板）——互相读进度、让接口、接力集成。**

![共享黑板与多 Agent](../../assets/inline-accidental-blackboard-agents-01.jpg)

## IROps 有多难

IROps 是航司在航班出乱子时用的恢复系统：机务故障、机组生病、取消/换机、旅客安置，要在成百架飞机、成千上万旅客、多机场机组之间做决策。难建、难懂、难用。

练习用规格书 + 模拟航司；**monorepo**，全员同时开工。几天后，协调方式开始「长」出来。

## 从修流水线到互相看见

多 Agent 同仓，构建很快被打爆。团队加了一条纪律：Agent **持续提交并从 main rebase**，尽早本地抓住失败。

同时要求：按规格书分节做计划，**计划落在仓库里**，并随进度更新。副作用是——所有 Agent 共享同一份带编号的规格分节，计划更新也跟着 commit 扫进公共历史。

于是出现了教科书式的协作：

- 做 **evaluator（约束校验）** 与做 **search（方案搜索）** 的 Agent，能在计划里看到彼此的集成点
- 一方标「进行中」，另一方不抢同一行
- 完成后，另一方不仅知道可以继续，还能读到实现备注，再接真实 verifier

团队开始**主动利用**：让 verifier Agent 盯计划与源码，等 cost model 落地后再集成——并且成功了。这不是事先设计的架构，是一连串决策的副产品。

![仓库作为协调层](../../assets/inline-accidental-blackboard-agents-02.jpg)

## 这就是 Blackboard

作者把现象对上了老模式：**blackboard / tuple space**。

- 共享内存，自主 Agent 独立读写
- 可追溯到 Hearsay-II（约 1980）与 Gelernter 的 tuple space（约 1986）
- 最小结构的元组 + 任意字段，无强制 schema
- 适合：分解子问题 → 解写回共享空间并打标签 → 其他 Agent 取用

仓库在这里**意外充当了 blackboard**。但它结构不全、非刻意；作者不确定同一提示级联能否可靠复现。已找到触发级联的关键 prompt，仍是涌现，不是定向行为。

## 关键判断：协调别绑死在 Git 上

频繁 push 带来进度可见性，也拖垮 CI。后来改为「更大块完成再推」——却切断了持续进度流。

作者的倾向很清晰：

1. 应**有意**建 blackboard，而不是靠事故
2. Agent 通信通道最好**独立于源码控制**
3. 好的意外，要变成好的有意项目

他启动了 **Talwrn**（威尔士语：打谷场——争议被摊开解决的空间）：轻量工具，丢进项目就能给 Agent 提供协调信道；目标是先让它支撑自身开发，并持续公开演进。

## 可带走的实践

- 多 Agent 同仓时，让**计划 / 接口 / 进度**成为共享、可机器读的工件
- 集成点写进计划，比事后扯皮更适合 Agent 接力
- commit 频率是双刃剑：可见性 vs CI；长期把协调从 git 拆出来
- 这与「虚拟公司式多 Agent」不是一路：这里要的是**共享工作记忆**，不是岗位聊天角色扮演

意外发现了一条老路径。下一步，是把它做成可复用的工程件，而不是再赌一次涌现。

## 相关文章

- [[forceful-systems-fly-off-multi-agent-illusion|力大砖飞：为什么“虚拟公司式”多 Agent 架构大多会失败]]
- [[coding-agents-reshape-epd|编程 Agent 如何重塑工程、产品和设计]]
- [[warp-self-improving-agents|Agent「自我改进」到底改进什么？Warp Skills 环 vs OpenAI 黑板]]
