---
title: 'OpenClaw deployment guide: five setups'
description: 'Local or server, WhatsApp or Feishu — five ways to put OpenClaw online. One-command install, a Feishu bridge, Telegram pairing, and a developer path so the agent is actually reachable.'
pubDate: '2026-03-13'
heroImage: '../../assets/cover-openclaw-deployment-guide-en.jpg'
tags: ['OpenClaw', '教程']
lang: en
translationKey: 'openclaw-deployment-guide'
---

How do you deploy OpenClaw? This piece merges five deployment write-ups: local, server, Feishu, Telegram, and a developer path.

![A local machine bridged to a rack](../../assets/inline-openclaw-deployment-guide-01.jpg)

## The two shapes

### Setup 1: local

**When:** personal use, a spare machine, you need local files

**Why:**

- data stays with you
- full control
- no server bill

**Hardware:** Mac mini (best), a spare laptop, a desktop

### Setup 2: a server

**When:** 24/7, more than one person, remote access

**Why:**

- always on
- stable
- reachable from anywhere

**Box:** the cheapest VPS is enough; an offshore server is usually easier

---

## Fast path (the "iron hammer" setup)

### One-command install

**Mac / Linux:**

```bash
curl -fsSL https://clawd.bot/install.sh | bash
```

**Windows (PowerShell):**

```powershell
iwr -useb https://clawd.bot/install.ps1 | iex
```

### Quick config

```bash
# start quick setup
clawdbot onboard --flow quickstart

# then pick:
# 1. model (Claude / ChatGPT / Gemini)
# 2. API key
# 3. a messenger (WhatsApp / Telegram / Discord)
# 4. Skills and hooks
# 5. done
```

### Security warning

**This tool fully opens the local machine.** It punches through the walls between apps.

**Do:**

- install in a VM
- install on a VPS
- install on a spare machine
- **do not install on your daily work machine**

---

## Cheap path (Clawdbox + Qwen)

### Why people use it

- domestic model: Qwen Code (Zhipu GLM)
- free, and the quota is large
- 24/7
- no fat server required

### Steps

**1. Install**

```bash
curl -fsSL https://clawd.bot/install.sh | bash
```

**2. Pick Qwen**

- choose QuickStart
- pick Qwen from the model list

**3. Configure Telegram**

Create a bot:

```
1. Open Telegram, search @BotFather
2. Send /newbot
3. Name it
4. Copy the bot token
5. Paste it into the terminal
```

**4. Confirm it is up**

```bash
ss -lntp | grep 18789
# any output = it started
```

**5. Pair Telegram**

```bash
# 1. send /start to the bot
# 2. get the pairing code
# 3. approve on the server
clawdbot pairing approve telegram ZEGWXXXX
```

---

## Feishu integration (Li Yue's path)

### Prerequisites

1. **Node.js** 18+
2. **Git**
3. **Python**
4. **C++ build tools** (Windows)

### Get a Zhipu GLM API key

1. open the Zhipu GLM site
2. register
3. create an API key
4. pick a plan

### Configure Feishu

**1. Create an enterprise custom app**

```
1. Open Feishu app config
2. Create an enterprise custom app
3. Name it
4. Copy App ID and App Secret
```

**2. Add permissions**

```
1. Enable bot capability
2. Search "receive"
3. Check receive-message
```

### Install OpenClaw

**Use an admin / elevated shell.**

```bash
# install
npm install -g openclaw

# check
openclaw --version

# init
openclaw init

# configure the model (Zhipu GLM + API key)
# configure Feishu (App ID + App Secret)

# start the gateway
openclaw gateway start

# status
openclaw gateway status
```

### Publish the Feishu bot

```
1. Create a version
2. Version number + notes
3. Save
4. Test in Feishu (talk to the bot)
```

### Daily commands

```bash
openclaw gateway restart    # restart the gateway
openclaw gateway status     # status
openclaw update --channel stable  # update
openclaw doctor            # diagnose
openclaw uninstall         # uninstall
```

---

## Feishu bridge (WY's path)

### What it is

**The problem:** official Clawdbot does not speak domestic messengers.

**Traits:**

- written in Go
- you run a compiled binary
- no heavy toolchain

### Steps

**1. Create a Feishu bot**

```
1. Feishu developer console
2. Create an app
3. Follow the wizard to a bot
4. Copy App ID and App Secret
```

**2. Download the bridge**

Grab the build for your OS from the GitHub Releases page.

**3. Start it**

**Mac / Linux:**

```bash
./clawdbot-bridge start fs_app_id=cli_xxx fs_app_secret=yyy
```

**Windows:**

```bash
./clawdbot-bridge.exe start fs_app_id=cli_xxx fs_app_secret=yyy
```

**"Started" means it is up.**

### Management

```bash
./clawdbot-bridge start     # background
./clawdbot-bridge stop
./clawdbot-bridge restart
./clawdbot-bridge status
./clawdbot-bridge run       # foreground (easier to debug)
```

---

## Developer path (Claude-to-IM)

### Two editions

**1. Skills edition (friendlier)**

- three IMs: Telegram, Discord, Feishu
- interactive setup wizard
- permissions (tool calls need approval)
- streaming preview
- no code

Install:

```bash
npx skills add op7418/Claude-to-IM-skill
```

Use:

```bash
/claude-to-im setup
```

**2. Core-library edition (for developers)**

When:

- your product is built on an Agent SDK
- you want remote control from several IMs quickly

What you get:

- multi-platform adapters
- streaming preview
- permissioning
- session binding
- Markdown render
- reliable delivery
- safety hooks
- host-agnostic

---

![A gateway and message channels](../../assets/inline-openclaw-deployment-guide-02.jpg)

## Which setup to pick

### Individuals

| Need | Setup |
|------|-------|
| Try it today | Iron-hammer (one-command install) |
| Spend nothing | Clawdbox + Qwen (free) |
| Full features | Li Yue's OpenClaw path |

### Developers

| Need | Setup |
|------|-------|
| Deep customization | Claude-to-IM core library |
| Basics | the bridge, or the Skills edition |

### Teams

| Need | Setup |
|------|-------|
| Stability | server |
| Collaboration | Feishu |
| Safety | real permission controls |

---

## What to keep in mind

### Deploy

1. **Local vs server**
   - local: safer data, full control
   - server: always on, reachable

2. **Models**
   - Claude: best quality, you pay
   - Qwen: free and plentiful, China-friendly

3. **Messengers**
   - WhatsApp: simplest (scan a code)
   - Telegram: richest features
   - Feishu: China-friendly, good for teams

### Safety

1. **Permissions matter**
   - not on your daily machine
   - VM or spare hardware
   - an approval gate on tools

2. **Data**
   - store keys safely
   - redact logs
   - access control

3. **Network**
   - HTTPS
   - a firewall
   - restrict source IPs

---

## Links

- GitHub: https://github.com/openclaw/openclaw
- Site: https://openclaw.ai
- ClawHub: https://clawhub.com
- Discord: https://discord.com/invite/clawd

---

## Related posts

- [[openclaw-complete-guide|OpenClaw / Clawdbot complete guide]]
- [[cli-ai-revival|CLI: the command-line revival in the AI era]]
- [[agent-skills-hub|Agent Skills Hub: finding and managing good Skills]]
