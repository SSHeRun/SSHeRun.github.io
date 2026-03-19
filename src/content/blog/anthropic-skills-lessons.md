---
title: 'Anthropic 内部数百个 Skills 的经验：九大类型和写好 Skill 的秘诀'
description: 'Anthropic 工程师 Thariq 分享了团队在 Claude Code 中使用数百个 Skills 的实战经验。Skill 不只是 Markdown 文件，而是包含脚本、资产和数据的完整能力单元。'
pubDate: '2026-03-20'
heroImage: '../../assets/cover-anthropic-skills-lessons.jpg'
tags: ['AI', 'Agent', 'Skill', 'Claude Code']
---

Anthropic 内部有数百个 Skills 在活跃使用。最近，他们的工程师 Thariq 分享了团队在实际使用中学到的经验。

一个常见误解是 Skills "只是 Markdown 文件"。实际上，最有趣的 Skills 是文件夹——包含脚本、资产、数据，Agent 可以发现、探索和操作它们。

## 九大 Skill 类型

在梳理了所有 Skills 后，Anthropic 发现它们聚集成几个反复出现的类别。最好的 Skill 干净地落入其中一个类别，最让人困惑的则横跨多个。

### 1. Library/SDK — 库和 SDK 使用指南

解释如何正确使用某个库、CLI 或 SDK。包含参考代码片段和 Claude 常犯错误的 gotchas 列表。比如你的内部计费库有哪些边界情况和陷阱，你的内部 CLI 每个子命令什么时候用。

### 2. Verification — 验证技能

描述如何测试或验证代码是否正常工作，通常配合 Playwright、tmux 等外部工具。

Anthropic 认为验证 Skills 极其有用，值得让工程师花一整周专门打磨。技巧包括让 Claude 录制输出视频以便回看测试过程，以及在每一步做程序化断言。

### 3. Data & Monitoring — 数据与监控

连接数据和监控系统，包含凭证、Dashboard ID、常见查询工作流。比如"哪些事件需要 join 才能看到注册→激活→付费的漏斗"。

### 4. Workflow — 工作流自动化

将重复性工作流自动化为一条命令。一个关键技巧：保存历史结果到日志文件，帮助模型在多次执行间保持一致。

### 5. Scaffolding — 脚手架

为代码库中特定功能生成框架样板。特别适合有自然语言需求但纯代码模板无法覆盖的场景。

### 6. Code Quality — 代码质量

强制执行代码质量标准。可以包含确定性脚本，也可以作为 hooks 或 GitHub Action 自动运行。最有意思的例子是 adversarial-review：生成一个全新视角的子 Agent 来批评代码，实施修复，迭代直到发现降级为吹毛求疵。

### 7. CI/CD — 持续集成与部署

帮助获取、推送和部署代码。比如 babysit-pr：监控 PR → 重试不稳定的 CI → 解决合并冲突 → 启用自动合并。

### 8. Debugging — 调试

从症状出发（Slack 线程、告警、错误签名），通过多工具调查，产出结构化报告。

### 9. Maintenance — 维护

执行常规维护和运维操作，包含破坏性操作的护栏。比如发现孤立资源 → 发到 Slack → 等待确认期 → 用户确认 → 级联清理。

## 写好 Skill 的九个秘诀

### 聚焦 Claude 不知道的信息

Claude 已经懂很多编码知识，有很多默认偏好。如果你的 Skill 主要是知识类的，重点写能把 Claude 推出常规思维的信息。

Anthropic 内部的 frontend-design Skill 就是一个好例子——专门避免 Inter 字体和紫色渐变等 Claude 的默认审美偏好。

### Gotchas 是最高信号内容

Skill 中信号最强的部分是 Gotchas 章节。从 Claude 使用 Skill 时的常见失败点积累，随时间持续更新。

### 利用文件夹做渐进式披露

把详细 API 签名放到 `references/api.md`，把模板放到 `assets/`。告诉 Claude 有哪些文件，它会在合适的时机自己去读。整个文件系统就是一种上下文工程和渐进式披露。

### 给灵活性，不要过度具体

Skill 是可复用的，过于具体的指令会限制适用性。给 Claude 需要的信息，但让它有空间适应具体情况。这和之前分析的 YC CEO 的 plan-ceo-review Skill 的理念一致——定义姿态而非内容。

### 用 config.json 存储用户配置

如果 Skill 需要用户上下文（比如 Slack 频道），存到 config.json。配置不存在时让 Agent 询问用户。

### Description 是触发条件，不是摘要

Claude 启动时扫描所有 Skill 的 description 来决定是否触发。所以 description 应该写清楚"什么时候应该触发这个 Skill"，而不是"这个 Skill 是什么"。

### 给 Skill 加记忆

在 Skill 目录中存储数据——日志、JSON、甚至 SQLite。比如 standup-post Skill 保存每次发布的历史，下次运行时 Claude 能看到什么变了。

### 给 Claude 代码而非指令

脚本和库让 Claude 专注于组合和决策，而非重建样板代码。

### 用 Hooks 做安全护栏

比如 `/careful` 阻止 rm -rf、DROP TABLE、force-push；`/freeze` 只允许编辑特定目录。按需启用，不要全局开启。

## 分发：从仓库到市场

小团队可以把 Skills 提交到仓库的 `.claude/skills/` 目录。但随着规模扩大，每个 Skill 都会增加模型上下文，这时需要内部插件市场。

Anthropic 的做法是有机发现：先在 sandbox 文件夹试用，有了 traction 后再正式上架。没有中央团队决定哪些 Skill 上架，但需要策展机制——因为很容易创建低质量或重复的 Skill。

他们还用 PreToolUse hook 追踪 Skill 使用情况，发现热门 Skill 和触发不足的 Skill。

## 和之前几篇文章的关联

这篇文章和我们之前发的几篇形成了一个完整的 Agent Skills 知识体系：

- Google 的五大设计模式定义了 Skill 的架构范式
- YC CEO 的 plan-ceo-review 展示了顶级 Skill 的实战效果
- Anthropic 的这篇则给出了从分类到写作到分发的完整方法论

三篇合在一起，基本覆盖了"什么是好的 Skill、怎么写、怎么用"的全部问题。

## 参考

- [原文推文](https://x.com/i/status/2033949937936085378)
- 作者：Thariq (@trq212)，Anthropic 工程师
- [[agent-skills-five-design-patterns|Agent Skills 五大设计模式]]
- [[top-skill-yc-ceo-review|顶级 Skill 长什么样：YC CEO 的 plan-ceo-review]]
