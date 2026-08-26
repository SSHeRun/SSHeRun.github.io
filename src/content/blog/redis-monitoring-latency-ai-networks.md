---
title: '监控看起来正常，答案却在变差：AI 网络里的延迟是正确性问题'
description: '错误率不变、答案变差——RAG 优雅降级与 Agent 超时截断让延迟成为质量信号。TTFT、尾延迟、分阶段检索监控与 SLO 怎么设。'
pubDate: '2026-08-26'
heroImage: '../../assets/cover-redis-monitoring-latency-ai-networks.jpg'
tags: ['Redis', 'AI', 'SRE', 'RAG']
---

你的监控一切正常，但用户觉得 AI 越来越「笨」——这在生产里太常见了。

[Redis 这篇博文](https://redis.io/blog/monitoring-latency-ai-networks/) 讲的核心不是「怎么把 P99 从 200ms 压到 150ms」，而是：**在 AI 网络里，延迟往往是答案质量退化的早期信号。** 检索和服务系统习惯在负载下优雅降级：搜缓存子集、换便宜排序、跳过 rerank。请求仍 200 OK，错误率不动，但模型拿到的上下文已经变薄。

## 延迟是一族指标，不是一个数

![监控正常但答案变差](../../assets/inline-redis-monitoring-latency-ai-networks-01.jpg)

单次 LLM 调用至少拆开看：

| 指标 | 盯什么 |
|------|--------|
| **TTFT**（首 token 时间） | 排队 + prefill + 网络；长 prompt 直接拉长 |
| **ITL**（token 间延迟） | 流式是否卡顿；聊天宜接近阅读速度 |
| **端到端** | prefill + decode + 检索/工具全路径 |
| **P95 / P99** | 最慢用户真实体验 |

Prefill 一次性读完整 prompt；Decode 逐 token 写答案——负载下变慢原因不同，**不能用一个平均数糊弄**。

有研究指出：中位数健康时，仍可能有约 1% 请求首 token 等近 2 秒。常见目标思路：TTFT 压在半秒级、ITL 数十毫秒；**分项设目标，一项回归不能藏在另一项里。**

## 为什么延迟是「正确性」，不只是速度

![RAG 检索优雅降级](../../assets/inline-redis-monitoring-latency-ai-networks-03.jpg)

过载时 AI 系统很少直接 500，而是**悄悄变差**：

- 搜索改搜内存子集，不碰全量索引
- 换更快但更糙的排序
- 重试把过载放大成级联故障

**RAG** 同理：ANN、缓存、轻量 retriever 都能降延迟，但检索精度一掉，模型就在更差的上下文里推理——链路全绿也能答错。

**Agent** 更直观：某自纠错架构在吞吐低于约每天 2.5 万文档时保持优势；超过后**超时截断纠错迭代**，相对简单 pipeline 的优势基本消失——没崩，只是变笨。

所以对齐 SRE 实践：**错过延迟 SLO = 失败请求**，慢答案和错答案进同一个桶。

## 延迟藏在哪三层

### 检索（常被低估）

流水线 characterization 里，检索约占端到端延迟 **41%**：

- Embedding：并发上来先排队
- **Rerank**：最大变量；cross-encoder 成本随候选数、批大小、硬件剧烈变化——必须单独 profile

### 推理与工具

Agent 编码场景里，工具执行可占主导（生成与工具被迫串行）。**单次 API 延迟会骗人**——要测 program / turn 级端到端。

### 跨服务 fan-out

单服务 1% 请求 P99=1s，fan-out 100 个依赖，整请求慢的概率约 **63%**（tail at scale）。Embedding 服务、向量索引、gateway、工具 API 每层都加 RPC 开销。

## 监控清单

![延迟曲线与尾延迟](../../assets/inline-redis-monitoring-latency-ai-networks-02.jpg)

**OpenTelemetry GenAI（实验性）** 可先接：

- `gen_ai.client.operation.duration` — 按模型看 LLM 直方图
- `gen_ai.server.time_per_output_token` — decode 阶段

客户端 TTFT 等仍缺标准，生产一般要自建。

**黄金信号：** 流式场景记得看 **失败请求有多慢**——慢失败比快失败更伤体验。

**百分位 > 平均：** 某 Google 服务平均 50ms，但 5% 请求慢 20 倍，平均曲线纹丝不动。P50 看典型，P95/P99 看最差。

**RAG 必拆：** embedding、search、rerank **分阶段打点**，别让某一环退化藏在端到端里。

## 守住检索预算的两招

1. **语义缓存** — 相似 query 命中则跳过 LLM；FAQ 类命中率高，开放对话低，先测命中率再算 ROI。
2. **低延迟向量检索** — Redis 公开数据：十亿向量、50 并发、top-100 中位约 200ms（含 RTT）；LangCache 场景下命中可达约 15x 加速、推理成本降约 73%。

博文主推 **Redis Iris** 作为托管 context engine（语义缓存 + 向量检索），叠在已有 Redis 上，避免另起一套检索基建——产品向，但「检索别吃掉整条延迟预算」这条工程判断是对的。

## 制度化：SLO 与错误预算

- 分层阈值：宽松覆盖大部分请求 + 严格盯尾部
- 错误预算烧尽可触发 **功能冻结**（只 ship 可靠性修复）
- 告警跟 **预算燃烧率**，不是裸阈值

**GitHub Copilot** 把默认工具从 40 砍到 13，A/B 平均延迟 **-400ms**——砍能力保延迟，是产品决策，根子在可靠性。

## 小结

AI 网络的延迟 = TTFT + ITL + 端到端 + 尾延迟，散落在检索、推理、工具与 fan-out 里。任一环节滑档，系统往往用「更差的答案」换可用性。按阶段、按尾部、绑 SLO 监控，才能在用户吐槽之前抓住质量回归。

**原文：** [Why it's important to monitor latency in AI networks](https://redis.io/blog/monitoring-latency-ai-networks/)
