---
title: 'CLI：AI 时代的命令行复兴'
description: 'CLI（命令行界面）正在 AI 时代迎来复兴。飞书、钉钉、企微、谷歌、Stripe 等巨头都开源了 CLI 产品。CLI 是 AI 的母语，比 GUI 更适合 AI Agent 调用。'
pubDate: '2026-04-05'
heroImage: '../../assets/cover-cli-ai-revival.jpg'
tags: ['CLI', 'AI', '开发工具', '自动化', 'MCP']
---

## 核心观点

CLI（命令行界面）正在 AI 时代迎来复兴。飞书、钉钉、企微、谷歌、Stripe 等巨头在近期都开源了自己的 CLI 产品。**CLI 是 AI 的母语**，比 GUI 更适合 AI Agent 调用。

## 为什么 CLI 适合 AI？

### CLI 的天然优势

1. **文本输入/输出** - AI 天生擅长处理文本
2. **结构化输出** - 易于解析和处理
3. **报错清晰** - 错误信息明确，便于调试
4. **易于组合** - 支持管道符，可串联复杂流程
5. **自解释性** - `--help` 让 AI 随时学习用法（渐进式披露，减少 Token）

### 实际案例

```bash
# GUI 方式：导入剪辑软件 → 找时间点 → 切分 → 导出
# CLI 方式：一行命令搞定
ffmpeg -i input.mp4 -t 00:00:5 -c copy part1.mp4
```

## 两个重要开源项目

### 1. CLI Anything

**功能**：一行命令把任意开源软件 CLI 化

**工作流程**（7 步自动化）：
1. 分析源代码，找出 UI 背后的 API 逻辑
2. 规划 CLI 命令分组
3. 设计输入输出
4. 编码实现
5. 编写测试用例
6. 更新文档
7. 发布

**实战案例**：把 draw.io（拖拽式画图工具）CLI 化
- 原本需要在 UI 上拖拽操作
- CLI 化后，AI 可以用命令行绘制流程图、架构图
- 生成的文件仍可在 draw.io 中打开编辑

```bash
# 安装
/plugin marketplace add HKUDS/CLI-Anything
/plugin install cli-anything

# 使用
/cli-anything:cli-anything ./drawio
```

**已测试的软件**：OBS、draw.io 等 11 款

### 2. OpenCLI

**功能**：把任意网站或 Electron 应用转换成 CLI

**安装**：
```bash
npm install -g @jackwener/opencli
```

**使用示例**：
```bash
# 查询 Hacker News 热门话题
opencli hackernews top --limit 5

# 询问 Grok
opencli grok ask "你的问题"

# Boss 直聘搜索职位
opencli boss search --city 青岛 --keyword 软件开发 -f json
```

**特点**：
- 支持几十种网站和工具
- 可二次开发，添加自定义命令
- 自动操作浏览器，抓取结果返回命令行

## CLI vs MCP 对比

### MCP 的劣势

1. **上下文占用高** - 需要将所有工具名、参数、示例全部注入上下文
2. **对人类不友好** - 像黑盒，出错难以调试和复现
3. **不支持管道符** - 无法像 CLI 那样组合命令形成流水线

**Token 消耗对比**（ScaleKit 测试）：
- 使用 GitHub 官方 MCP vs CLI
- CLI 的 Token 消耗成倍小于 MCP

### CLI 的管道符优势

```bash
# 一条命令完成复杂任务
gh issue list --repo openclaw/openclaw | 
  ConvertFrom-Json | 
  Where-Object {$_.title -like "*bug*"} | 
  Sort-Object created_at | 
  Export-Csv bugs.csv
```

如果用 MCP 实现，需要多次反复调用工具，大幅增加 Token 和时间开销。

### MCP 的优势

1. **多租户场景** - 严格权限控制
2. **标准化安装包** - 统一的鉴权规范
3. **云端部署** - 适合 AI Agent 云平台

### 技术融合趋势

- **Claude Code / Codex**：上线 tool search 功能，按需加载 MCP（借鉴 CLI 的渐进式披露）
- **MCPorter**：把 MCP 转换成 CLI 格式供 Agent 调用

## 官方 CLI 工具示例

### GitHub CLI

```bash
# 安装后登录
gh auth login

# 查看 issue
gh issue list --repo openclaw/openclaw

# 创建仓库
gh repo create my-new-repo
```

更多官方 CLI：飞书、钉钉、企微、Stripe 等都有官方 CLI。

## 对我的启发

### 1. 产品设计思路

如果要让软件支持 AI Agent 调用，**优先考虑 CLI 而非 MCP**：
- Token 消耗更低
- 开发成本更低（不需要实现复杂的 MCP 协议）
- 对人类和 AI 都友好（人类可以直接测试和调试）

### 2. CLI Anything 的价值

**补充说明**：后面如果要软件支持 CLI，其实就是让 **CLI Anything 帮你生成一个命令行版本说明书**。

这意味着：
- 不需要手写 CLI 代码
- AI 自动分析源码生成 CLI
- 46 分钟自动完成（以 draw.io 为例）

### 3. 工作流自动化

可以用 CLI 工具 + AI Agent 实现：
- 自动化操作各种软件和网站
- 串联多个工具形成工作流
- 减少重复性手工操作

### 4. 当前可用的工具

- **CLI Anything**：把开源软件 CLI 化
- **OpenCLI**：把网站/Electron 应用 CLI 化
- **官方 CLI**：GitHub、飞书、钉钉等
- **MCPorter**：MCP 转 CLI（OpenClaw 作者开发）

## 行动清单

- [ ] 尝试用 CLI Anything 把常用的开源工具 CLI 化
- [ ] 探索 OpenCLI 支持的网站列表，看有哪些可以自动化
- [ ] 研究如何把自己的产品设计成 CLI 优先
- [ ] 关注 MCP 和 CLI 的融合趋势

## 相关资源

- CLI Anything：https://github.com/HKUDS/CLI-Anything （2.5 万 Star）
- OpenCLI：https://github.com/jackwener/opencli
- 视频版：https://www.bilibili.com/video/BV1G29EBGE8b/
- GitHub CLI：https://cli.github.com/

---

*来源：[V2EX - TechShrimp](https://www.v2ex.com/t/1203629)*
