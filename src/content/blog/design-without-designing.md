---
title: 'Design Without Designing：工程师如何用 AI 交付高质量设计'
description: '工程师不需要成为设计师。通过正确的 harness（工具组合），你可以在三个月内从零到周周交付设计。这是 Neethan Wu 的完整设计系统。'
pubDate: '2026-03-21'
heroImage: '../../assets/cover-design-without-designing.jpg'
tags: ['AI', 'Agent', '设计', '工程师', '工具', '生产力']
---

我是一个工程师，三个月前从未接触过 UI/UX 设计。

现在我能周周交付设计。

这不是因为我突然学会了设计。而是因为我为设计构建了一个 agent harness — 一个三层的工具组合，让我能够端到端地交付设计，而不需要成为设计师。

## Agents 正在改变一个人能覆盖的范围

过去，工程师和设计师是两个不同的角色。工程师写代码，设计师做设计。

但现在，Agents 正在改变这个边界。

我一直在推动自己向广泛的领域发展，拿起我之前做不了的工作。设计是最大的一个。

像素、间距、排版、颜色 — 这些东西让人们在读一个字之前就信任你的产品。

我从来没有这方面的技能。所以我构建了一个 harness：三层，给我真正的设计能力，而不需要我成为设计师。

## 三层设计 Harness

### Layer 1：Skills（专业知识）

Skills 是安装到你的 AI agent 中的指令文件。无论是 Claude Code、Cursor、Codex 还是其他，它们都能工作。

它们把别人的设计专业知识转移到你的工作流中。你基本上是在借用经验丰富的设计师的品味。

#### Impeccable（@pbakaus，jQuery UI 创始人）

这是我最常用的 skill。它有 20+ 命令：/audit、/polish、/animate、/typeset、/arrange。

它捕捉那些让 AI 生成的 UI 看起来明显是 AI 生成的反模式：
- 过度使用字体
- 灰色文字在彩色背景上
- 纯黑色
- 嵌套卡片

我最喜欢的命令是 /delight。我经常用它，每次它都会引入令我惊喜的东西，升级产品的整体感觉。这个命令一夜之间改变了我的输出外观。

#### Emil Kowalski 的 Design Engineer Skill

Emil 是 Linear 的设计工程师，之前在 Vercel，创建了 Sonner 和 Vaul（周下载量 1500 万+）。

他的 skill 编码了他对动画、UI 打磨和细节的思考方式。

我用免费版本来借用 Emil 的思维方式，偶尔将他的思考应用到我的设计工作中。完整版本包含他的 animations.dev 课程。

#### Interface Design（@Dammyjay93）

这个解决了 AI 辅助设计最烦人的问题：你的 agent 在会话间忘记每个设计决策。

这个 skill 将你的规范（间距网格、调色板、深度策略、组件模式）存储在一个持久的 system.md 文件中，自动加载。

#### UI Skills（@ibelick，motion-primitives 创始人）

由 Julien Thibeaut 创建，他也构建了 motion-primitives。

15 个开源 skills 覆盖基础 UI、可访问性、动画性能和元数据。

我不像使用 Impeccable 那样经常使用它，但当我需要时它就在那里。

### Layer 2：Agent Canvas（表面）

我也称这些为 agent shells。它们是没有内置 agent 的设计表面。它们使用你的 agents。Claude Code、Codex，无论你在本地运行什么。

Canvas 是 shell；你的 agent 是 kernel。

#### Paper（@paper）

这是我最近更经常使用的。Canvas 是基于真实 HTML 和 CSS 构建的，不是专有格式。

你设计的就是实际代码。没有翻译层，没有交付。

它暴露 MCP 工具，具有完全的读写访问权限。由于不需要格式转换，它与本地 agents 开箱即用。

大多数时候我用 Paper 来处理设计系统、设计令牌和页面设计迭代，然后将其用作源代码和设计参考，同时构建产品。

Paper 有一个免费层，但 MCP 调用配额有限。

#### Pencil（@tomkrcha）

采用不同的方法。它使用基于 JSON 的 .pen 格式，可以 Git diff，agent 可以通过 MCP 操作。

我的设计文件在我的 repo 中，像代码一样版本控制。

Pencil 还有一个 swarm 模式，我可以同时启动多个 agents（最多 6 个）在我的 canvas 上工作：
- 一个处理排版
- 另一个处理布局
- 第三个传播设计系统

第一次看到 agent swarm 在我的 canvas 上工作时，我被震撼了。

Pencil 目前是免费的，我经常同时使用 Pencil 和 Paper。

### Layer 3：Inspiration and Taste（眼光）

Skills 给我专业知识。Canvases 给我表面。但我仍然需要训练我的眼光，知道什么是好的，然后才能要求 agent 去做。

#### Variant（@variantui）

输入一个想法，滚动浏览无限的非重复设计解释。

突出的功能是 Style Dropper：你指向任何设计，它吸收视觉 DNA（调色板、排版节奏、空间密度），并将其转移到另一个设计上。

我每天花大约 20 分钟滚动它。它已经成为我做任何设计工作前预热眼光的一部分。

但 Variant 对我来说不仅仅是灵感。我从社区中选择我喜欢的东西，提示它生成变体，探索不同的方向，当我找到我喜欢的东西时，我可以复制代码、导出为 React，或复制带有 HTML 参考的提示，直接交给我的 coding agents 实现。

从那里我提取令牌或组件，开始构建更多视图和页面。这是从灵感到实际产品的一个令人惊讶的平稳桥梁。

#### Mobbin（@mobbin）和 Awwwards（@awwwards）

这些在设计世界中已经众所周知很长时间了。我用它们来吸收最好的、最精选的设计工作，从中学习品味。

Mobbin 涵盖移动应用和网站。当我需要看顶级应用如何处理 onboarding、settings 或 checkout 时，那就是我去的地方。

Awwwards 是陪审团评分的，涵盖网络工艺的前沿。他们也运行会议和学院。

#### Cosmos（@thecosmos）

这是我收集所有灵感和想法的地方，也是探索他人集合的地方。

网页设计、室内、排版、摄影、建筑 — 任何吸引我眼球的东西。

我不断通过他们的十六进制颜色搜索或甚至模糊描述发现东西。它以仍然让我惊讶的方式找到我要找的东西。

我用它来构建视觉参考集群，逐渐塑造我对设计的思考方式。

## 模式

三层。Skills 用于专业知识。Canvases 用于 agents 工作。Inspiration 用于训练眼光。

我不是设计师。我没有多年的训练直觉，我的品味仍在发展。我每天都在学习。

但我解锁了自己。我从根本无法做设计，到周周交付设计，对我输出的东西感到满意。三个月前什么都没有。

## 关键启示

**你不需要成为设计师。你需要对的 harness。**

这个 harness 的三层结构可以应用到任何领域：
- 找到专业知识（Skills）
- 找到工作表面（Canvas）
- 训练你的眼光（Inspiration）

然后你就可以在那个领域交付，即使你没有多年的背景。

Agents 正在改变一个人能覆盖的范围。不要被传统的角色边界限制。

---

**原文链接：** https://x.com/i/status/2034786360356204934
