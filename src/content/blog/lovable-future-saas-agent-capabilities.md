---
title: 'Lovable CTO：SaaS 的未来不是更多 Tab，而是 Agent 能调用的 Capabilities'
description: 'Lovable 从 AI 生成 App 转向 MCP Capabilities 平台。CTO Fabian Hedin 谈公司大脑、双接口设计、Connectors 安全，以及为什么 SaaS 要为 AI 提供铲子。'
pubDate: '2026-08-27'
heroImage: '../../assets/cover-lovable-future-saas-agent-capabilities.jpg'
tags: ['Agent', '产品', '创业']
lang: zh
---

Lovable 出名，是因为用自然语言就能生成 Web 应用。

但 CTO Fabian Hedin 最近在 Latent Space 的访谈里讲了一个有点反直觉的方向：**Lovable 正在为一个「越来越少人直接打开传统 App」的世界做准备。**

不是 App 死了，是入口变了。

![AI 与 SaaS 能力网络抽象图](../../assets/inline-lovable-future-saas-agent-capabilities-01.jpg)

## 一个应用，两个接口

Lovable 现在把已发布应用里的选定函数，通过 **托管 MCP Server** 暴露成 tools。

他们叫这种东西 **Capability**——应用里对 Agent 有直接价值、可被直接调用的功能单元。人类不必打开界面，ChatGPT、Claude 等 MCP 客户端就能调用。

结果是经典的双入口设计：

- **人类入口**：传统 UI
- **Agent 入口**：MCP tools

这和 [[dual-entry-human-agent-design|LibTV 的人类画布 + Agent Skills]] 是同一类思路，只是 Lovable 把能力封装在 **MCP** 这一层。

## 三年里用户造了什么

Lovable 从 2023 年的 GPT Engineer 开源项目起步，2024 年底 rebranding 为 Lovable。Hedin 说变化速度来自两层 compound：

1. 应用层每几个月上新能力
2. 底层 LLM 持续变强

用户路径也清晰：

**原型 → MVP → 真实付费产品 → 企业内部运营软件**

后者包括 CRM、Admin Panel、客服台——不只是面向客户的产品，还有 **公司运营背后那一层**。

数字很夸张（2026-08）：ARR run rate 超 **5 亿美元**，6000 万+ 项目，Fortune 500 近 **三分之二** 员工用过平台。Menlo 刚领投 **4 亿美元** Series C，估值 **133 亿**。

## 「公司大脑」：一个入口干所有事

Lovable 的愿景叫 **Digital Brain for Your Team**——团队日常工具的单一入口。

需要两样东西：

1. **尽可能完整的上下文**（你、公司、外部世界）
2. **Capabilities**（通用任务 + 组织专属动作）

Hedin 的原话：**「你构建的一切，都能以 Agentic 方式复用。」**

平台的工作不是让你为每个任务单独造 Agent，而是 **把所有 Capabilities 串进一个 Agent**。

内部例子：支持团队给用户发 credits、管理平台的后台——这些能力已经可以通过 Lovable Agent 内部调用。Agent 还能 **异步调度**自己：比如过一会儿再查部署状态，回到同一会话交结果。

## 竞争：编排容易，连接才难

Vercel 的 `@v`、v0、Cloudflare 的 Agent 工作流——大家都在做「公司大脑」。

Hedin 认为 Lovable 的楔子是：**最好地构建 Agent 需要的 Capabilities**。编排是简单部分；**连对、建对、可靠** 才是难点。

他刻意少用「Agent」这个词——表面像员工执行任务，底层其实是 **Context + Capabilities 的正确连接**。

## 安全：Connectors 与权限图

Agent 直接调 Capability，最大风险是 **越权**。

比如员工用 Lovable 做了连 Slack 的 App，不能把个人私信或机密频道漏进公司大脑。

Lovable 用 **Connectors** 连外部系统，核心是 **App User Connector**：

- 保留每个用户在源系统的身份与权限
- 凭证 **服务端加密**，由 Connector Gateway 管理
- 生成 App 只拿 **短期、绑定用户的 key**，**碰不到原始 credentials**

> 「我们把连外部系统和应用代码分开——App 只跟 Lovable 平台交互。」

这需要维护一种 **permissioning graph**——谁能在什么上下文里调什么 Capability。

![企业软件与 Agent 连接器安全架构](../../assets/inline-lovable-future-saas-agent-capabilities-02.jpg)

## SaaS 会消失吗？

Hedin 的判断很务实：

- 人类开 Tab 的方式会 **收敛**，但 **垂直能力仍然值钱**
- 部分传统 SaaS 会抵抗趋势、死守旧界面
- Lovable 要做 **开放平台**，任何人可连、可用

给 SaaS 的建议一句话：

**「SaaS 公司要更专注为 AI 提供能用的铲子（shovel）。」**

不是做人看的 Dashboard 就够了，要把 **可被 Agent 可靠调用的 Capability** 当成一等公民。

## 对做产品的人意味着什么

1. **Day 1 设计 Agent 接口**——MCP / tools，别等产品成熟再补
2. **能力原子化**——发 credits、查订单、改配置，每个动作应是独立 Capability
3. **凭证与代码分离**——生成 App 不应持有长期 API Key
4. **编排会卷，可靠 Capabilities 才是护城河**

SaaS 的未来，可能不是「再做一个更好看的 Tab」，而是 **让你的垂直能力成为别人公司大脑里的一块乐高**。

---

*来源：[Lovable CTO: The Future of SaaS Is Apps That Agents Can Use](https://www.latent.space/p/lovable-future-of-saas) · Latent Space（2026-08-26）*
