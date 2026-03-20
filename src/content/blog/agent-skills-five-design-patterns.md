---
title: 'Agent Skills 五大设计模式：从工具到队友的进化'
description: 'Google Cloud 发布 Agent Skills 五大设计模式，定义了 AI Agent 技能的内容组织方式。从 Tool Wrapper 到 Pipeline，每种模式解决不同场景的问题。'
pubDate: '2026-03-19'
heroImage: '../../assets/cover-agent-skills-five-design-patterns.jpg'
tags: ['AI', 'Agent', '设计模式']
---

Google Cloud Tech 在 "Advent of Agents Season 2" 系列中发布了一个重要内容：Agent Skills 的五大设计模式。

Agent Skills 规范（agentskills.io）定义了技能的打包格式——SKILL.md 加上 references/、assets/、scripts/ 目录。但格式只是容器，真正的问题是：里面应该放什么？

五种设计模式回答了这个问题。

## 什么是 Agent Skill？

先厘清一个常见混淆：Tool 和 Skill 不是一回事。

Tool 是一个函数：`readFile()`、`calculator()`、`gitCommit()`。无状态，确定性，被告知做什么就做什么。

Skill 是一种认知模式。它包含判断、记忆和自我纠正的能力。一个 Skill 知道什么时候该问问题，什么时候该停下来，什么时候该从缓存里读取而不是重新计算。

## 五大设计模式

### 1. Tool Wrapper（工具包装器）

最简单也最广泛采用的模式。

将一个库或框架的约定打包为按需知识。指令说明遵循什么规则，`references/` 存放详细文档。没有模板，没有脚本。

Google 的 ADK Core Skills、Vercel 的 React 最佳实践、Supabase 的 Postgres 指南都是这个模式。

适用场景：你只需要让 Agent 了解某个工具的正确用法。

### 2. Generator（生成器）

通过填充 `assets/` 中的可复用模板生成结构化输出，`references/` 存放质量规则。

每次相同结构，不同内容。技术报告、API 文档、commit 消息——这些重复性的结构化输出都适合用 Generator。

适用场景：你需要 Agent 按固定格式生成内容。

### 3. Reviewer（审查器）

根据 `references/` 中的检查清单评估代码，按严重程度分组输出发现。

关键设计：分离"检查什么"（清单文件）和"如何检查"（审查协议）。换一份清单，就能从同一个 skill 得到完全不同的审查结果。

一个实际案例：Giorgio Crivellari 用 ADK 治理 skill 将代码质量从 29% 提升到 99%。

适用场景：你需要 Agent 按标准评估代码或内容质量。

### 4. Inversion（反转模式）

Skill 在行动前先采访你。

通过定义的阶段进行结构化提问，设置一个硬门控："在所有阶段完成之前不要开始构建。"

这个模式解决了一个常见问题：Agent 太急于行动，基于假设而非真实需求生成大量输出。Inversion 强制它先问清楚再动手。

适用场景：复杂任务，需要先收集完整需求。

### 5. Pipeline（管道模式）

带有显式门控条件的顺序步骤。"在用户确认之前不要进入步骤 3。"

最复杂的模式，但也是唯一能防止 Agent 跳过验证步骤的模式。

适用场景：多步骤流程，每一步都需要确认才能继续。

## 模式可以组合

这五种模式不是互斥的。一个 Pipeline 可以包含 Reviewer 步骤。一个 Generator 可以用 Inversion 收集输入。

根据一篇 arXiv 论文的数据，生产系统中每个 skill 平均使用 2 种模式。

## 三种认知模式

Google Cloud Community 的 Shuva Jyoti Kar 进一步将 Skills 映射为三种认知模式，用具体场景说明了 Skill 和 Tool 的本质区别：

### The Scout（侦察兵）

问题：开发者让 Agent "映射代码库"，Agent 执行 `ls -R`，5000 个文件路径涌入，上下文溢出，开始幻觉。

解决：渐进式披露。Agent 先展示顶层目录，问"要深入哪个？"，逐层探索。如果新层输出与上一层相同，自动停止——已经到底了。

Agent 不再是在读文件，而是在导航。

### The Resilient Patcher（弹性修补器）

问题：配置文件有语法错误，工具直接崩溃。

解决：Skill 不拒绝错误输入，而是修复它。先尝试严格 JSON 解析，失败后用宽松解析器修复常见错误（单引号、尾逗号等）。

用户甚至不会注意到有问题。这就是"能力"的体现。

### The Librarian（图书管理员）

问题：分析 500MB 的 CSV 文件需要 30 秒。用户问第二个问题，Agent 又读了一遍。

解决：维护本地缓存。检查文件哈希，如果已分析过，直接从缓存读取。从 30 秒降到 0 秒。

Agent 可以回答"你知道什么？"——展示它的长期记忆。

## 选择模式的决策树

简单来说：

- 只需要传递知识/约定？→ Tool Wrapper
- 需要生成结构化输出？→ Generator
- 需要评估/审查代码？→ Reviewer
- 需要先收集需求再行动？→ Inversion
- 需要多步骤带验证？→ Pipeline

## 为什么这很重要

Agent Skills 正在成为一个跨平台标准。agentskills.io 上的规范已被 26+ 平台采用，包括 Claude Code、OpenAI Codex、Gemini CLI、GitHub Copilot、Cursor 等。

Google 官方的 ADK Skills 可以一行命令安装：

```bash
npx skills add google/adk-docs -y -g
```

当我们把 Agent 从"更快的 CLI"升级为"有认知能力的队友"，设计模式就是那个关键的中间层。它告诉你：不是写更多代码，而是设计更好的模式，让 Agent 像高级工程师一样行动——先看再跳，自己修错，从经验中学习。

## 参考资源

- [Google Cloud Tech 推文](https://x.com/GoogleCloudTech/status/2033953579824758855)
- [认知模式实现 - Google Cloud Community](https://medium.com/google-cloud/beyond-tool-use-implementing-cognitive-patterns-with-google-antigravity-skills-c0eea90fa430)
- [Reddit 讨论](https://www.reddit.com/r/agentdevelopmentkit/comments/1rqq414/5_design_patterns_for_structuring_agent_skills/)
- [Agent Skills 规范](https://agentskills.io)
- [代码仓库](https://github.com/shuvajyotikar13/agent-design-patterns)

## 相关文章

- [[agent-skills-hub|Agent Skills Hub：发现和管理优质 AI Agent Skills]]
- [[ai-multi-advisor-decision-system|把德鲁克、芒格、乔布斯装进 AI 系统：一套多顾问决策架构]]
- [[dual-entry-human-agent-design|产品的两个入口：为什么 AI 时代要同时为人类和 Agent 设计]]
- [[anthropic-skills-lessons|Anthropic 内部数百个 Skills 的经验：九大类型和写好 Skill 的秘诀]]
- [[hello-world|做一个对 Agent 友好的博客]]
