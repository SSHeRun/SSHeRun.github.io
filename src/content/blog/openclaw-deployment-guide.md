---
title: 'OpenClaw 部署完全指南：5种方案任你选'
description: '从本地部署到服务器部署，从 WhatsApp 到飞书集成，5 种部署方案详解。包含一键安装、飞书桥接、Telegram 配置等完整教程，让你的 AI Agent 快速上线。'
pubDate: '2026-03-13'
heroImage: '../../assets/cover-openclaw-deployment-guide.jpg'
tags: ['OpenClaw', '部署教程', '飞书', 'Telegram']
---

OpenClaw 怎么部署？本文整合了 5 篇部署教程，涵盖本地部署、服务器部署、飞书集成、Telegram 配置等完整方案。

## 部署方案对比

### 方案 1：本地部署

**适用场景：** 个人使用、有闲置电脑、需要本地文件访问

**优势：**
- 数据安全
- 完全控制
- 无需服务器费用

**推荐硬件：** Mac mini（最佳）、闲置笔记本、台式机

### 方案 2：服务器部署

**适用场景：** 7x24 小时运行、多人使用、远程访问

**优势：**
- 永远在线
- 稳定可靠
- 随时随地访问

**推荐配置：** 最低配 VPS 即可，建议境外服务器

---

## 快速部署（铁锤人方案）

### 一键安装

**Mac/Linux：**
```bash
curl -fsSL https://clawd.bot/install.sh | bash
```

**Windows（PowerShell）：**
```powershell
iwr -useb https://clawd.bot/install.ps1 | iex
```

### 快速配置

```bash
# 启动快速设置
clawdbot onboard --flow quickstart

# 按提示选择：
# 1. 选择模型（Claude/ChatGPT/Gemini）
# 2. 输入 API Key
# 3. 连接通讯工具（WhatsApp/Telegram/Discord）
# 4. 安装 Skills 和 Hooks
# 5. 完成
```

### ⚠️ 安全警告

**重要：** 这个工具完全放开了本地电脑的权限，打破不同软件之间的生态壁垒。

**建议：**
- 在虚拟机中安装
- 在 VPS 上安装
- 在闲置电脑上安装
- **不要在主力工作机上安装**

---

## 白嫖方案（Clawdbox + Qwen）

### 核心优势

- 使用国产模型 Qwen Code（智谱 GLM）
- 免费且量大
- 7x24 小时在线
- 不需要高性能服务器

### 详细步骤

**Step 1：一键安装**
```bash
curl -fsSL https://clawd.bot/install.sh | bash
```

**Step 2：选择 Qwen 模型**
- 选择 QuickStart
- 从模型列表中选择 Qwen

**Step 3：配置 Telegram**

创建 Bot：
```
1. 打开 Telegram，搜索 "@BotFather"
2. 发送 /newbot
3. 给机器人命名
4. 复制 bot token
5. 粘贴到终端
```

**Step 4：验证启动**
```bash
ss -lntp | grep 18789
# 有输出 = 启动成功
```

**Step 5：配对 Telegram**
```bash
# 1. 给机器人发送 /start
# 2. 获取配对码
# 3. 服务器端批准
clawdbot pairing approve telegram ZEGWXXXX
```

---

## 飞书集成（李岳方案）

### 前置准备

1. **安装 Node.js**（v18 以上）
2. **安装 Git**
3. **安装 Python**
4. **安装 C++ 编译工具**（Windows）

### 获取智谱 GLM API Key

1. 访问智谱 GLM 官网
2. 注册账号
3. 创建 API Key
4. 选择套餐

### 配置飞书

**Step 1：创建企业自应用**
```
1. 打开飞书应用配置页面
2. 点击创建企业自应用
3. 输入应用名称
4. 获取 App ID 和 App Secret
```

**Step 2：添加权限**
```
1. 添加机器人能力
2. 搜索 "receive"
3. 勾选接收消息功能
```

### 安装 OpenClaw

**重要：必须使用管理员权限**

```bash
# 安装
npm install -g openclaw

# 验证
openclaw --version

# 初始化
openclaw init

# 配置模型（选择智谱 GLM，输入 API Key）
# 配置飞书（输入 App ID 和 App Secret）

# 启动网关
openclaw gateway start

# 检查状态
openclaw gateway status
```

### 发布飞书机器人

```
1. 创建版本
2. 输入版本号和说明
3. 保存
4. 测试（打开飞书应用，与机器人对话）
```

### 日常使用命令

```bash
openclaw gateway restart    # 重启网关服务
openclaw gateway status     # 检查服务状态
openclaw update --channel stable  # 更新
openclaw doctor            # 诊断问题
openclaw uninstall         # 卸载
```

---

## 飞书桥接工具（WY 方案）

### 工具介绍

**解决的问题：** Clawdbot 官方不支持国内通讯软件

**特点：**
- 使用 Go 语言编写
- 直接使用编译后的二进制文件
- 不依赖复杂的开发环境

### 配置步骤

**Step 1：创建飞书机器人**
```
1. 进入飞书开发者后台
2. 点击创建应用
3. 按照引导创建机器人
4. 获取 App ID 和 App Secret
```

**Step 2：下载桥接工具**

从 GitHub Release 页面下载对应系统的版本。

**Step 3：启动桥接工具**

**Mac/Linux：**
```bash
./clawdbot-bridge start fs_app_id=cli_xxx fs_app_secret=yyy
```

**Windows：**
```bash
./clawdbot-bridge.exe start fs_app_id=cli_xxx fs_app_secret=yyy
```

**出现 "Started" = 启动成功**

### 管理命令

```bash
./clawdbot-bridge start     # 后台启动
./clawdbot-bridge stop      # 停止
./clawdbot-bridge restart   # 重启
./clawdbot-bridge status    # 查看状态
./clawdbot-bridge run       # 前台运行（方便调试）
```

---

## 开发者方案（Claude-to-IM）

### 两个版本

**1. Skills 版本（用户友好）**

特点：
- 三大 IM 平台（Telegram、Discord、飞书）
- 交互式配置（引导式向导）
- 权限控制（工具调用需要批准）
- 流式预览（实时查看输出）
- 无需编写代码

安装：
```bash
npx skills add op7418/Claude-to-IM-skill
```

使用：
```bash
/claude-to-im setup
```

**2. 核心库版本（开发者）**

适用场景：
- 你的产品基于 Agent SDK 开发
- 想要快速接入多个 IM 远程控制

主要特点：
- 多平台适配器
- 流式预览
- 权限管理
- 会话绑定
- Markdown 渲染
- 可靠投递
- 安全机制
- 宿主无关

---

## 方案选择建议

### 个人用户

| 需求 | 推荐方案 |
|------|---------|
| 快速体验 | 铁锤人方案（一键安装） |
| 省钱 | Clawdbox + Qwen（免费） |
| 功能完整 | 李岳方案（OpenClaw） |

### 开发者

| 需求 | 推荐方案 |
|------|---------|
| 深度定制 | Claude-to-IM 核心库 |
| 基本功能 | 桥接工具或 Skills 版本 |

### 企业用户

| 需求 | 推荐方案 |
|------|---------|
| 稳定性 | 服务器部署 |
| 团队协作 | 飞书集成 |
| 安全性 | 完整的权限控制 |

---

## 核心洞察

### 关于部署

1. **本地 vs 服务器**
   - 本地：数据安全，完全控制
   - 服务器：永远在线，随时访问

2. **模型选择**
   - Claude：效果最好，需要付费
   - Qwen：免费量大，国产友好

3. **通讯工具**
   - WhatsApp：最简单（扫码即可）
   - Telegram：功能丰富
   - 飞书：国内友好，团队协作

### 关于安全

1. **权限控制很重要**
   - 不要在主力机上安装
   - 使用虚拟机或闲置设备
   - 配置权限审批机制

2. **数据安全**
   - 密钥安全存储
   - 日志脱敏
   - 访问控制

3. **网络安全**
   - 使用 HTTPS
   - 配置防火墙
   - 限制访问 IP

---

## 相关资源

- GitHub: https://github.com/openclaw/openclaw
- 官网: https://openclaw.ai
- ClawHub: https://clawhub.com
- Discord: https://discord.com/invite/clawd

---

## 相关文档

## 相关文章

- [[openclaw-complete-guide|OpenClaw/Clawdbot 完全指南：从入门到精通]]
