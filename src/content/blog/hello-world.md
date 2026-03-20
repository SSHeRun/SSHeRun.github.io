---
title: '做一个对 Agent 友好的博客'
description: '在 Agent 时代，个人网站不应只是给人看的页面，更应该是一个机器可读的接口。本文介绍如何让博客同时对人类和 AI Agent 友好。'
pubDate: '2026-03-18'
heroImage: '../../assets/cover-astro-migration.jpg'
tags: ['Agent', 'AI', 'llms.txt']
---

## 为什么需要对 Agent 友好？

传统个人网站的设计逻辑很简单：人来访问，看到漂亮的页面，阅读内容，离开。

但在 2026 年，访问你网站的不只是人类。越来越多的 AI Agent 在替用户浏览网页、收集信息、总结内容。当一个 Agent 访问你的博客时，它面对的是一堆 HTML 标签、CSS 样式和 JavaScript —— 大量对它无用的噪音。

**对 Agent 友好**，意味着让你的内容以机器可高效消费的方式存在，就像你的网站不只有一张脸（HTML），还有一个大脑（结构化数据 + 纯文本接口）。

## 本站的 Agent 友好实践

### 1. llms.txt — 给 LLM 的说明书

[llms.txt](https://llmstxt.org/) 是一个新兴标准，类似 `robots.txt`，但目的不同：它不是告诉爬虫"别来"，而是告诉 LLM"来了看这里"。

本站的 `/llms.txt` 是动态生成的，包含：
- 站点介绍和作者信息
- 所有文章的标题、链接和摘要
- 站点结构导航
- 指向完整内容的链接

Agent 只需读这一个文件，就能理解整个站点。

### 2. llms-full.txt — 完整上下文

对于需要深度理解内容的 Agent，本站提供 `/llms-full.txt`，将所有文章的完整 Markdown 原文聚合在一个文件中。这意味着 Agent 可以一次请求获取全部知识，而不用逐页爬取。

### 3. 纯 Markdown 端点

每篇文章都有对应的 `.md` 端点。例如这篇文章的 Markdown 版本在 `/blog/hello-world.md`。

这遵循了 llms.txt 规范的建议：为每个页面提供纯 Markdown 版本，让机器可以跳过 HTML 解析，直接获取结构化内容。

### 4. JSON-LD 结构化数据

每篇文章的 HTML 页面中嵌入了 Schema.org 的 `BlogPosting` JSON-LD 标记，包含标题、描述、发布时间、作者、语言和关键词。搜索引擎和 AI 爬虫都能精确解析这些元数据。

### 5. 开放的发现协议

- `/robots.txt` — 允许所有爬虫访问
- `/rss.xml` — RSS 订阅
- `/sitemap-index.xml` — 站点地图
- `<link rel="help" href="/llms.txt">` — HTML head 中的发现入口

## 这些端点是动态生成的

以上所有 Agent 友好端点都不是手动维护的静态文件。它们由 Astro 在构建时从内容集合自动生成 —— 新写一篇文章，`llms.txt`、`llms-full.txt`、`.md` 端点全部自动更新。

零维护成本，这才是可持续的做法。

### 6. Obsidian 双向链接

本站的 Markdown 渲染引擎支持 Obsidian 风格的双向链接（wikilinks）语法。这意味着你可以直接从 Obsidian 笔记库发布文章到博客，无需转换链接格式。

支持的语法：
- `[[文章名]]` — 链接到站内文章
- `[[文章名|显示文本]]` — 自定义显示文本
- `[[文章名#标题]]` — 链接到文章内的特定段落
- `![[图片.png]]` — 嵌入图片

例如：想了解更多技术细节？看看 [[winpe-pecmd-commands|WinPE PECMD 命令详解]] 和 [[vs-atl-exe-cannot-generate-dll|VS ATL DLL 问题解决方案]]。

## 下一步

这只是起点。参考[Agent 时代的个人网站终局形态](https://x.com/i/status/2033784623864680927)的思路，未来可以探索：

- **可对话的知识人格** — 训练一个了解你所有内容的 Agent
- **结构化的能力展示** — 不只是文章，还有可交互的 Playground
- **智能的访客接口** — 根据来访者意图提供定制化响应

不要展示自己，部署自己。

## 相关文章

- [[agent-skills-five-design-patterns|Agent Skills 五大设计模式：从工具到队友的进化]]
- [[agent-skills-hub|Agent Skills Hub：发现和管理优质 AI Agent Skills]]
- [[ai-multi-advisor-decision-system|把德鲁克、芒格、乔布斯装进 AI 系统：一套多顾问决策架构]]
- [[dual-entry-human-agent-design|产品的两个入口：为什么 AI 时代要同时为人类和 Agent 设计]]
- [[anthropic-skills-lessons|Anthropic 内部数百个 Skills 的经验：九大类型和写好 Skill 的秘诀]]
