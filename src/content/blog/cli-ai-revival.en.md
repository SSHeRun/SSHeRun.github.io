---
title: 'CLI: the command-line revival in the AI era'
description: 'The command line is coming back. Feishu, DingTalk, WeCom, Google, Stripe and others have all open-sourced CLIs. A CLI is an AI''s native language — much easier for an agent to call than a GUI.'
pubDate: '2026-04-05'
heroImage: '../../assets/cover-cli-ai-revival-en.jpg'
tags: ['工程', 'Agent', '工具']
lang: en
translationKey: 'cli-ai-revival'
---

## The claim

The command line is having an AI-era revival. Feishu, DingTalk, WeCom, Google, Stripe and others have all recently open-sourced CLI products. **A CLI is an AI's native language** — much easier for an agent to call than a GUI.

![A curved terminal console](../../assets/inline-cli-ai-revival-01.jpg)

## Why CLIs fit AI

### Natural advantages

1. **Text in / text out** — models are native text machines
2. **Structured output** — easy to parse
3. **Clear errors** — failure messages you can debug
4. **Composable** — pipes let you chain a real workflow
5. **Self-explaining** — `--help` is progressive disclosure and saves tokens

### A concrete case

```bash
# GUI: import into an editor → find the cut → split → export
# CLI: one command
ffmpeg -i input.mp4 -t 00:00:5 -c copy part1.mp4
```

## Two projects worth knowing

### 1. CLI Anything

**What it does:** turn any open-source app into a CLI, in one command.

**The automated loop (7 steps):**

1. Read the source and find the API behind the UI
2. Plan command groups
3. Design inputs and outputs
4. Implement
5. Write tests
6. Update docs
7. Publish

**In the wild:** they CLI-ized draw.io (a drag-and-drop diagram tool).

- Before: drag boxes in a UI
- After: an agent can draw flowcharts and architecture diagrams from the command line
- The files still open in draw.io

```bash
# Install
/plugin marketplace add HKUDS/CLI-Anything
/plugin install cli-anything

# Use
/cli-anything:cli-anything ./drawio
```

**Software they have tested:** OBS, draw.io, and nine others — 11 in total.

### 2. OpenCLI

**What it does:** turn a website or Electron app into a CLI.

**Install:**

```bash
npm install -g @jackwener/opencli
```

**Examples:**

```bash
# Hacker News top stories
opencli hackernews top --limit 5

# Ask Grok
opencli grok ask "your question"

# Search jobs on BOSS Zhipin
opencli boss search --city Qingdao --keyword "software engineer" -f json
```

**Traits:**

- dozens of sites and tools
- you can add custom commands
- it drives a browser and returns results to the terminal

## CLI vs MCP

### Where MCP is weaker

1. **Context cost** — you inject every tool name, parameter, and example
2. **Hostile to humans** — a black box; failures are hard to debug and reproduce
3. **No pipes** — you cannot compose a pipeline the way you can with a CLI

**Token comparison** (ScaleKit):

- Official GitHub MCP vs CLI
- CLI used a multiple fewer tokens than MCP

### The pipe advantage

```bash
# One pipeline for a real job
gh issue list --repo openclaw/openclaw |
  ConvertFrom-Json |
  Where-Object {$_.title -like "*bug*"} |
  Sort-Object created_at |
  Export-Csv bugs.csv
```

Doing the same over MCP means many tool calls, more tokens, more wall time.

### Where MCP is stronger

1. **Multi-tenant** — strict permissioning
2. **Standard install packages** — a shared auth story
3. **Cloud deploy** — fits agent platforms in the cloud

### The two are starting to meet

- **Claude Code / Codex**: tool search — load MCP on demand (borrowing CLI-style progressive disclosure)
- **MCPorter**: turn an MCP into a CLI an agent can call

![Data flowing through glass pipes](../../assets/inline-cli-ai-revival-02.jpg)

## Official CLIs

### GitHub CLI

```bash
# Sign in after install
gh auth login

# List issues
gh issue list --repo openclaw/openclaw

# Create a repo
gh repo create my-new-repo
```

More official CLIs: Feishu, DingTalk, WeCom, Stripe, and others.

## What I take from this

### 1. Product design

If you want software an AI agent can call, **prefer a CLI over MCP first**:

- fewer tokens
- cheaper to build (no full MCP protocol)
- friendly to humans *and* models (you can test and debug it yourself)

### 2. What CLI Anything is really for

If your software later needs a CLI, CLI Anything is basically **an auto-generated command-line spec**.

That means:

- you do not hand-write CLI code
- the AI reads the source and generates the CLI
- about 46 minutes end-to-end on draw.io

### 3. Workflow automation

CLI tools + an AI agent can:

- drive software and websites
- chain tools into a workflow
- cut repetitive hand work

### 4. What you can use today

- **CLI Anything**: CLI-ize open-source software
- **OpenCLI**: CLI-ize websites / Electron apps
- **Official CLIs**: GitHub, Feishu, DingTalk, …
- **MCPorter**: MCP → CLI (from the OpenClaw author)

## Action list

- [ ] Try CLI Anything on an open-source tool you already use
- [ ] Browse the sites OpenCLI supports and pick one to automate
- [ ] Think about designing your own product CLI-first
- [ ] Watch the MCP / CLI merge

## Links

- CLI Anything: https://github.com/HKUDS/CLI-Anything (25k stars)
- OpenCLI: https://github.com/jackwener/opencli
- Video: https://www.bilibili.com/video/BV1G29EBGE8b/
- GitHub CLI: https://cli.github.com/

---

*Source: [V2EX — TechShrimp](https://www.v2ex.com/t/1203629)*

## Related posts

- [[hello-world|An agent-friendly blog]]
- [[openclaw-complete-guide|OpenClaw / Clawdbot complete guide]]
- [[learn-by-scraping|When I learn a new field, I scrape it first]]
