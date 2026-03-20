---
title: 'gstack：YC CEO 用来日产 2 万行代码的 Claude Code 软件工厂'
description: 'Garry Tan 开源了他的 Claude Code 工具集 gstack，15 个 Skill 把 AI 变成一个虚拟工程团队。他用它在 60 天内写了 60 万行生产代码，同时还在做 YC CEO。'
pubDate: '2026-03-20'
heroImage: '../../assets/cover-gstack-yc-ceo-factory.jpg'
tags: ['AI', 'Claude Code', '开发效率', '工具']
---

Garry Tan 是 Y Combinator 的 CEO。在过去 60 天里，他写了超过 60 万行生产代码，35% 是测试，每天 1 到 2 万行可用代码。同时他还在全职做 YC CEO 的工作。

这不是靠加班，是靠工具。他把自己的整套 Claude Code 工具集开源了，叫 gstack，一周拿了 26900 个 Star。

## gstack 是什么

一句话：把 Claude Code 变成一个你实际管理的虚拟工程团队。

- CEO 重新思考产品方向
- 工程经理锁定架构
- 设计师捕捉 AI 审美问题
- 偏执的审查者找生产 bug
- QA 打开真实浏览器点击测试
- 发布工程师提交 PR

15 个专业角色，6 个安全工具，全部是 Markdown 文件和 slash 命令，MIT 协议，免费。

## 安装只要 30 秒

需要 Claude Code、Git、Bun v1.0+：

```bash
git clone https://github.com/garrytan/gstack.git ~/.claude/skills/gstack
cd ~/.claude/skills/gstack && ./setup
```

前 10 分钟体验路径：`/office-hours` → `/plan-ceo-review` → `/review` → `/qa`。

## 15 个 Skill 覆盖完整开发流程

### 思考阶段

`/office-hours` 是起点。两种模式：创业模式用 6 个强制问题暴露需求真相（你的用户是谁？现状是什么？最窄的切入点是什么？），构建者模式用设计思维做头脑风暴。它会重新定义你的问题——你说"我要做一个日历简报 App"，它会说"你描述的其实是一个 AI 私人参谋长"。

`/plan-ceo-review` 是之前我们详细分析过的那个 600 行 Skill。四种模式：范围扩张（建造大教堂）、选择性扩张、保持范围（让计划防弹）、范围缩减（外科手术式裁剪）。

`/plan-eng-review` 是工程经理视角：锁定架构、数据流、图表、边界情况、测试覆盖、性能。

`/plan-design-review` 和 `/design-consultation` 覆盖设计审查和实时设计咨询。

### 审查阶段

`/review` 是全面代码审查，覆盖安全、性能、设计、测试。`/design-review` 打开浏览器审查 UI，专门捕捉 AI 生成代码常见的审美问题。

### 测试阶段

`/qa` 是最硬核的——它打开一个真实浏览器，像用户一样点击你的应用，生成 QA 报告。不是模拟，是真的在浏览器里操作。

### 发布阶段

`/ship` 创建 PR、写变更日志、处理合并。`/document-release` 生成发布文档。`/retro` 给你过去 7 天的开发统计。

### 安全护栏

`/careful` 在执行 rm -rf、DROP TABLE、force-push 前警告。`/freeze` 锁定编辑到特定目录——调试时防止 Claude 误改其他代码。`/guard` 同时激活两者。按需启用，不影响正常开发。

## 推荐工作流

```
/office-hours    → 定义问题
/plan-ceo-review → CEO 审查范围
/plan-eng-review → 工程经理锁定架构
[编码实现]
/review          → 代码审查
/qa              → 浏览器 QA
/ship            → 发布
```

每个阶段有对应的 Skill，Agent 知道该做什么、什么时候停。这就是 gstack 的核心设计：流程而非混沌。

## 10-15 个并行 Sprint

gstack 单个 Sprint 就很强，但真正的变革是并行。配合 Conductor 可以同时运行 10-15 个 Claude Code 会话，每个在独立工作区。一个做 office-hours，一个做 review，一个实现功能，一个做 QA。你像 CEO 管理团队一样管理它们：只关注需要决策的节点，其余让它们自己跑。

## 为什么 gstack 有效

回到之前分析的三个洞察：

第一，角色而非提示词。每个 Skill 是一个有明确职责边界的角色，比空白提示词更有结构。

第二，姿态而非知识。plan-ceo-review 不教 Claude 商业知识，它给 Claude 一个严厉的审查姿态和不可跳过的流程。这就是为什么一个工程 Skill 能审查商业计划。

第三，流程而非混沌。Think → Plan → Build → Review → Test → Ship，每个阶段有对应工具。没有流程，十个 Agent 就是十个混乱源。有了流程，每个 Agent 都知道自己该做什么。

## 和我们之前的文章的关联

这是 Agent Skills 系列的第四篇，也是最实战的一篇：

- Google 的五大设计模式 — 理论框架
- Anthropic 的 Skills 经验 — 官方方法论
- dontbesilent 的 plan-ceo-review 分析 — 单个 Skill 的深度解剖
- gstack 完整教程 — 一整套工具的实战指南

四篇合在一起，从理论到实践，覆盖了 Agent Skills 的全部知识。

## 参考

- [gstack GitHub](https://github.com/garrytan/gstack)（MIT License）
- [Garry Tan](https://x.com/garrytan)，Y Combinator CEO
- [Conductor](https://conductor.build)，并行 Sprint 工具
- [[top-skill-yc-ceo-review|顶级 Skill 长什么样]]
- [[anthropic-skills-lessons|Anthropic 内部 Skills 经验]]
- [[agent-skills-five-design-patterns|Agent Skills 五大设计模式]]

## 相关文章

- [[ai-customer-service-revenue|客服不是成本中心：AI 正在重写企业和用户之间的关系结构]]
- [[gstack-yc-ceo-factory|gstack：YC CEO 用来日产 2 万行代码的 Claude Code 软件工厂]]
- [[taste-at-speed-pm-skill|Taste at Speed：当构建成本趋近于零，PM 的核心技能变了]]
- [[software-engineering-splits-three|软件工程正在分裂为三层：你在哪一层？]]
- [[first-principles-startup-review|用 AI 做第一性原理审查：一个创业计划被推翻的 48 小时]]
- [[top-skill-yc-ceo-review|顶级 Skill 长什么样：YC CEO 的 600 行提示词为什么能审查一切]]
