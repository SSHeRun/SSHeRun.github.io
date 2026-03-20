---
title: 'OpenClaw/Clawdbot 完全指南：从入门到精通'
description: '全面解析 OpenClaw/Clawdbot - 24/7 运行的 AI 助手。涵盖概念介绍、硬件部署、实战用例、配置技巧和 10 个优化方法，让你的 AI Agent 真正成为得力助手。'
pubDate: '2026-03-13'
heroImage: '../../assets/cover-openclaw-complete-guide.jpg'
tags: ['OpenClaw', 'AI Agent', '自动化', '教程']
---

OpenClaw/Clawdbot 是什么？一个 24/7 运行、能主动联系你、拥有长期记忆的 AI 助手。本文整合了三篇深度教程，带你从零开始掌握 OpenClaw。

## 什么是 Clawdbot？

**Clawdbot = Claude Code + Bot 化工作流**

与传统 AI 的区别：

| 特性 | ChatGPT | Clawdbot |
|------|---------|----------|
| 交互方式 | 对话式，需要人工操作 | 自动化，可控制电脑 |
| 运行模式 | 按需使用 | 24/7 后台运行 |
| 记忆能力 | 单次对话 | 长期记忆 |
| 主动性 | 被动响应 | 主动通知 |

### 三大核心能力

1. **长期记忆** - 记住每次对话、个人偏好、无意中提及的事情
2. **主动联系** - 任务完成、新邮件、股票变动时主动推送
3. **24/7 运行** - 边游泳边干活（vibe coding），自己跑、自己纠正、自己测试

---

## 硬件与部署

### 设备选择

**推荐：Mac mini**
- 低功耗（24/7 运行成本低）
- 强大性能（M 系列芯片）
- 高性价比
- 配置建议：基础款即可，推荐 32G 内存 + 1T 硬盘

**替代：VPS**
- 优点：更稳定，无需购买硬件
- 缺点：功能受限，高性能 VPS 成本高
- 建议：用低配 VPS 尝试，觉得有用再升级

### 网络配置：Tailscale

解决的问题：
1. 所有设备连入虚拟局域网
2. 远程访问 Mac mini（VNC）
3. 顺带解决 VPN 需求（退出节点模式）

配合 UPS 防止断电/断网导致服务中断。

---

## 实战用例

### 1. 任务管理

- 语音发送待办事项到 Telegram
- 自动整理并添加到 Apple Reminders
- 自动设置 due date
- 提前调研并整理资料

### 2. 复杂工作流案例

完整流程示例（Apple Intelligence 封装）：
1. 找框架封装 Apple Intelligence 3B 模型为 OpenAI API
2. 跑测试评估模型能力
3. 自动写成博客文章
4. 结合本地 Whisper 做语音转写
5. 测试性能影响
6. 自动总结成博客并发布
7. 封装成 Skill 供后续使用

关键：像人一样操作浏览器，自动化整个发布流程。

### 3. 信息管理

**刷推特：**
- 配置 Bird CLI（X 的命令行工具）
- 每天扫描关注的 list
- 大事即时推送，小事每天 3 次 digest
- 交互式深挖感兴趣的内容

**运维优化：**
- 监控 VPS 资源使用
- 分析历史日志
- 建议降低配置（成本从 $48/月 → $12/月，降低 75%）

### 4. 自我修复与迭代

- 出问题时自己修复
- 发现需求/bug 时自己写 PR 提交到 repo
- 部署新的 Clawdbot 实例（用 AI 驾驭 AI）

---

## 配置与踩坑

### 模型选择

**推荐配置：**
- 主力：Claude CLI 授权
- 套餐：Claude Code Max（200 刀/月，编程 + 实验）
- 省钱方案：Model 设为 Sonnet 4.5

### 记忆体系（核心）

文件结构：

```
workspace/
├── IDENTITY.md      # Agent 身份（名字、物种、性格、emoji）
├── USER.md          # 用户档案（名字、时区、偏好、工作流）
├── SOUL.md          # Agent 人格（语气、回复模板、行为边界）
├── HEARTBEAT.md     # 定时任务清单
├── MEMORY.md        # 长期记忆（核心知识、决策记录、待办）
├── TOOLS.md         # 自定义工具使用说明
└── memory/          # 按日期的工作笔记
    ├── 2026-03-08.md
    └── 2026-03-09.md
```

**Session 机制：**
- 每个对话是独立 Session
- 可按 Telegram ID、Discord Channel 分
- 不建议删除（可作为长期记忆）
- 可以 /new 新建或 /reset 清空

---

## 10 个优化技巧

### 1. 防止失忆（三个办法）

**问题：** 长会话被自动压缩后丢失上下文

**解决方案：**

1. **memory/ 目录** - 记录关键决策和当天进度
2. **SESSION.md** - 维护当前目标、已做的关键决策、明确否掉的方案
3. **主动 /compact** - 不要等系统自动压缩，带上自定义提示词

核心：花 2 分钟写笔记 > 花 20 分钟重新解释

### 2. 配置好 IDENTITY.md

```markdown
- 名字：给 Agent 起个名字
- 性格：sharp / warm / chaotic / calm
  - sharp：简洁直接
  - warm：耐心友好
- 签名 emoji：选一个代表性的
```

角色越清晰，Agent 越不容易跑偏。

### 3. 写好 USER.md

必填内容：
- 你是谁
- 你的偏好
- 你的时区（重要！）
- 写作风格偏好

示例：
```markdown
写作风格偏好：
- 实用主义导向
- 口语化但不夸张
- 像在跟同行朋友聊天
```

### 4. 配置 allowlist（提升效率）

```json
{
  "allowlist": [
    "read",      // 读文件
    "search",    // 搜索
    "write_md"   // 写 markdown
  ]
}
```

原则：
- ✅ 低风险操作：放开（读、搜索、写文档）
- ❌ 高风险操作：锁死（删除、改配置、对外发布）

### 5. 善用 Skills

**什么是 Skills？**
- Markdown 文件定义的工作流
- Agent 按步骤执行
- 可复用的能力模块

**获取 Skills：**
- ClawHub：公共注册中心（1万+ Skills）
- 安装：把 SKILL.md 放到对应目录

建议：先装最常用的 2-3 个，用熟了再加。

### 6. 持续培训 Agent

三个习惯：

1. **记录错误到 LEARNING.md** - 每次出错立刻追加
2. **memory/ 日记积累经验** - 防失忆，积累对你工作方式的理解
3. **及时反馈纠正** - 告诉它哪里不对，应该怎么做

核心：前期麻烦，后期省心。

### 7. 配置图床自动上传

场景：聊天中产生截图，网站素材想放到文档

解决方案：30 行 Node.js 脚本
1. 读文件
2. 算 MD5
3. 按 年/月/md5.ext 生成路径
4. 上传到 R2
5. 返回 CDN 链接

推荐图床：Cloudflare R2（免费额度够用）

### 8. 多 Agent 共享资源

```bash
# 1. 创建共享目录
mkdir shared/

# 2. 放通用脚本和配置
shared/
├── SHARED.md
├── upload-to-r2.js
└── notion-api.js

# 3. 符号链接到每个 Agent
ln -s ../../shared agent1/workspace/shared
ln -s ../../shared agent2/workspace/shared
```

好处：改一处所有 Agent 同步生效。

### 9. 永远不要让 Agent 改自己的配置

血的教训：让 Agent 修改 openclaw.json → 写错了 → 配置校验失败 → 实例疯狂重启 36 次

防范措施：
1. 改配置前先让它读官方文档确认字段层级
2. 只有一个实例的话，改错了只能手动修
3. 有条件用另一个实例来管理配置

### 10. Telegram 群组协作

三步搞定：

1. **配置 Bot** - 去 BotFather 关掉 Privacy Mode
2. **获取群 ID** - 在群里发消息，访问 getUpdates API
3. **修改配置** - 添加 `requireMention: false`

重要：必须加 `requireMention: false`，否则只响应 @ 消息。

---

## 总结：把 Agent 当新员工带

### 前期投入（必须做）
1. 配置好 IDENTITY.md、USER.md、LEARNING.md
2. 建立 memory 机制
3. 选择合适的 Skills
4. 配置 allowlist

### 持续培训（日常做）
1. 记录错误到 LEARNING.md
2. 写 memory/ 日记
3. 及时反馈纠正
4. 定期 /compact 保留关键上下文

### 长期收益
- 越来越懂你
- 越来越省心
- 真正成为你的 AI 助手

---

## 相关资源

- GitHub: https://github.com/openclaw/openclaw
- 官网: https://openclaw.ai
- ClawHub: https://clawhub.com
- Discord: https://discord.com/invite/clawd

---

## 相关文档

## 相关文章

- [[openclaw-deployment-guide|OpenClaw 部署完全指南：5种方案任你选]]
