---
title: 'OpenClaw / Clawdbot complete guide'
description: 'A 24/7 AI assistant that can reach you first and remember you. Concepts, hardware, real workflows, config, and ten optimizations — so the agent becomes a real deputy, not a chat window.'
pubDate: '2026-03-13'
heroImage: '../../assets/cover-openclaw-complete-guide-en.jpg'
tags: ['OpenClaw', 'Agent', '教程']
lang: en
translationKey: 'openclaw-complete-guide'
---

What is OpenClaw / Clawdbot? A 24/7 AI assistant that can contact you first and keep long-term memory. This piece merges three deep tutorials so you can run it from zero.

![A host that stays on at night](../../assets/inline-openclaw-complete-guide-01.jpg)

## What is Clawdbot?

**Clawdbot = Claude Code + a bot-shaped workflow**

Versus a normal chat model:

| Trait | ChatGPT | Clawdbot |
|-------|---------|----------|
| Interaction | conversational, you drive | automated, can drive the machine |
| Runtime | on demand | 24/7 in the background |
| Memory | one conversation | long-term |
| Initiative | waits | notifies you |

### Three core abilities

1. **Long-term memory** — every conversation, your preferences, things you mentioned in passing
2. **It reaches you** — task done, new mail, a stock move
3. **24/7** — vibe-code while you swim: it runs, corrects, tests on its own

---

## Hardware and deploy

### What to run it on

**Recommended: Mac mini**

- low power (cheap to leave on)
- real performance (Apple silicon)
- good value
- a base model is enough; 32 GB RAM + 1 TB disk is comfortable

**Alternative: a VPS**

- plus: more stable, no hardware to buy
- minus: fewer local capabilities; a fast VPS is expensive
- try a cheap VPS first; upgrade if it earns its keep

### Network: Tailscale

What it solves:

1. every device on one virtual LAN
2. remote access to the Mac mini (VNC)
3. a VPN if you need an exit node

Pair it with a UPS so a power or network blip does not kill the service.

---

## Real workflows

### 1. Task management

- voice a todo into Telegram
- it files it into Apple Reminders
- sets a due date
- researches and packs a brief ahead of time

### 2. A full workflow (wrapping Apple Intelligence)

1. find a framework that wraps the Apple Intelligence 3B model as an OpenAI-compatible API
2. run tests and score the model
3. write it up as a blog post automatically
4. pair local Whisper for speech-to-text
5. measure the performance hit
6. summarize into a post and publish
7. package it as a Skill for next time

The key: it uses a browser the way a person would, and automates the whole publish path.

### 3. Information

**X / Twitter:**

- configure Bird CLI (X's command-line tool)
- scan the lists you follow every day
- big news immediately; small stuff as a digest three times a day
- interactive deep-dives when something is interesting

**Ops:**

- watch VPS usage
- read historical logs
- recommend a smaller box ($48/month → $12/month, −75%)

### 4. Self-repair and iteration

- when it breaks, it fixes itself
- when it finds a need or a bug, it opens a PR
- it can stand up a new Clawdbot instance (AI driving AI)

---

## Config and the holes people fall in

### Models

**A sane setup:**

- main line: Claude CLI auth
- plan: Claude Code Max ($200/month, coding + experiments)
- cheaper: set the model to Sonnet 4.5

### Memory (this is the core)

```
workspace/
├── IDENTITY.md      # who the agent is (name, species, tone, emoji)
├── USER.md          # who you are (name, timezone, preferences, workflows)
├── SOUL.md          # persona (voice, reply templates, boundaries)
├── HEARTBEAT.md     # scheduled jobs
├── MEMORY.md        # long-term memory (core facts, decisions, todos)
├── TOOLS.md         # how to use your custom tools
└── memory/          # dated work notes
    ├── 2026-03-08.md
    └── 2026-03-09.md
```

**Sessions:**

- each conversation is its own session
- you can split by Telegram ID or Discord channel
- do not delete them (they become long-term memory)
- `/new` starts fresh; `/reset` clears

---

![A layered memory archive](../../assets/inline-openclaw-complete-guide-02.jpg)

## Ten optimizations

### 1. Don't let it forget (three methods)

**Problem:** long sessions get compacted and lose context.

**Fixes:**

1. **`memory/`** — write down key decisions and today's progress
2. **`SESSION.md`** — current goal, decisions already made, ideas you explicitly killed
3. **`/compact` yourself** — do not wait for auto-compact; pass a custom prompt

Two minutes of notes beats twenty minutes of re-explaining.

### 2. Write `IDENTITY.md`

```markdown
- Name: give the agent a name
- Tone: sharp / warm / chaotic / calm
  - sharp: short and direct
  - warm: patient and friendly
- Signature emoji: one that represents it
```

The clearer the role, the less it drifts.

### 3. Write `USER.md`

Must include:

- who you are
- what you prefer
- your timezone (this matters)
- how you like to write

```markdown
Writing:
- pragmatic
- spoken, not theatrical
- like talking to a peer
```

### 4. Configure an allowlist (this is efficiency)

```json
{
  "allowlist": [
    "read",
    "search",
    "write_md"
  ]
}
```

Rules:

- ✅ low-risk: open (read, search, write docs)
- ❌ high-risk: lock (delete, change config, publish)

### 5. Use Skills

**What they are:**

- workflows defined in Markdown
- the agent walks the steps
- reusable capability modules

**Where to get them:**

- ClawHub: public registry (10,000+ Skills)
- install: drop `SKILL.md` in the right directory

Start with the two or three you will actually use. Add more after they are habit.

### 6. Keep training the agent

Three habits:

1. **Append mistakes to `LEARNING.md`** — the moment it fails
2. **Daily notes in `memory/`** — anti-amnesia, and a model of *how you work*
3. **Correct it live** — say what was wrong and what to do instead

Painful early. Cheap later.

### 7. Auto-upload images

Scene: a screenshot in chat, or an asset you want in a doc.

A ~30-line Node script:

1. read the file
2. MD5
3. path as `year/month/md5.ext`
4. upload to R2
5. return the CDN URL

Cloudflare R2's free tier is enough for this.

### 8. Share resources across agents

```bash
# 1. a shared directory
mkdir shared/

# 2. common scripts and config
shared/
├── SHARED.md
├── upload-to-r2.js
└── notion-api.js

# 3. symlink into each agent
ln -s ../../shared agent1/workspace/shared
ln -s ../../shared agent2/workspace/shared
```

Change once; every agent picks it up.

### 9. Never let the agent edit its own config

Hard lesson: asked it to edit `openclaw.json` → wrote it wrong → validation failed → the instance restarted 36 times in a frenzy.

Guards:

1. make it read the official docs and confirm field nesting *before* it edits
2. if you only have one instance, a bad edit is a manual repair
3. if you can, let a second instance manage config

### 10. Collaborate in a Telegram group

Three steps:

1. **Bot:** in BotFather, turn Privacy Mode off
2. **Group ID:** send a message in the group, hit the getUpdates API
3. **Config:** set `requireMention: false`

You *must* set `requireMention: false` or it only answers @mentions.

---

## Treat the agent like a new hire

### Up-front (required)

1. write `IDENTITY.md`, `USER.md`, `LEARNING.md`
2. stand up a memory mechanism
3. pick the right Skills
4. configure the allowlist

### Ongoing (daily)

1. log mistakes to `LEARNING.md`
2. write `memory/` notes
3. correct it when it drifts
4. `/compact` on a cadence and keep the important context

### The long return

- it knows you better
- it costs less attention
- it becomes an actual assistant

---

## Links

- GitHub: https://github.com/openclaw/openclaw
- Site: https://openclaw.ai
- ClawHub: https://clawhub.com
- Discord: https://discord.com/invite/clawd

---

## Related posts

- [[openclaw-deployment-guide|OpenClaw deployment guide: five setups]]
- [[cli-ai-revival|CLI: the command-line revival in the AI era]]
- [[agent-skills-hub|Agent Skills Hub: finding and managing good Skills]]
- [[hello-world|An agent-friendly blog]]
