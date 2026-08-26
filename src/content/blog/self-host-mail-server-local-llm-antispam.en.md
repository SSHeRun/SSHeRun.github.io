---
title: 'Self-host your mail server in 2026: docker-mailserver, rspamd, and local LLM spam filtering'
description: '"Don''t self-host email" is outdated. Home vs VPS requirements, SPF/DKIM/DMARC setup, docker-mailserver, and Gmail-class antispam with rspamd plus a local Gemma model.'
pubDate: '2026-08-26'
heroImage: '../../assets/cover-self-host-mail-server-local-llm-antispam-en.jpg'
tags: ['教程', '自建', '邮件']
lang: en
translationKey: 'self-host-mail-server-local-llm-antispam'
---

Spend a week in self-hosting circles and someone will say it: **self-host anything except email.**

Blocklists, spam folders, delivery nightmares — the stories are real. In 2026, though, the last big blocker is mostly solved: **local LLMs + rspamd** can classify spam on par with big providers, without sending your mail to a cloud API.

This walkthrough follows [Christian Haschek](https://blog.haschek.at/2026/you-should-selfhost-your-mail.html), an MSP who migrates companies off Gmail and Microsoft — and moved his own Google Workspace to self-hosted mail.

![Self-hosted mail and data sovereignty](../../assets/inline-self-host-mail-server-local-llm-antispam-01.jpg)

## Can you run it at home?

A VPS is the safe default. **Home works if all of this is true:**

| Requirement | Why |
|-------------|-----|
| **Static IPv4** | Dynamic IPs break MX/PTR; check [blocklists](https://mxtoolbox.com/blacklists.aspx) first |
| **No CGNAT** | Carrier-grade NAT blocks inbound port 25 |
| **Editable PTR** | Reverse DNS must resolve to `mail.yourdomain.com` — ISP ticket required |
| **Open ports** | `25` `143` `465` `587` `993` |

**Will a short outage lose mail?** Usually no. SMTP senders retry. The author’s rule of thumb: **<40% daily downtime still delivers fine.**

## Which mail stack?

| Option | Best for |
|--------|----------|
| **[docker-mailserver](https://docker-mailserver.github.io/)** | **Default pick** — Docker, sane defaults |
| [Stalwart](https://stalw.art/) | Modern Rust stack |
| [Mailcow](https://mailcow.github.io/) | All-in-one with web UI |
| Hand-rolled Postfix+Dovecot | Learning / masochism |

He runs legacy ISPConfig; **greenfield today → docker-mailserver.**

## DNS: miss one record, miss the inbox

### SPF

```txt
v=spf1 mx a ~all
```

### DKIM

Server generates keys; publish the public TXT:

```txt
v=DKIM1; t=s; h=sha256; p=MIGf[...]B;
```

### DMARC

Policy layer on SPF/DKIM — use a [DMARC generator](https://dmarcian.com/dmarc-xml/) if unsure.

### MX + A

1. `mail.yourdomain.com` → A record → server IP  
2. MX priority `10` → `mail.yourdomain.com`

### PTR

**Only your ISP or VPS provider can set this.** The IP must reverse to `mail.yourdomain.com` or major providers bounce you.

![DNS records and deliverability](../../assets/inline-self-host-mail-server-local-llm-antispam-02.jpg)

**Before go-live:** send a test message through [mail-tester.com](https://www.mail-tester.com/) — SPF, DKIM, DMARC, blocklists, content score in one place.

## Antispam: local LLM changed the game

Classic OSS antispam (IP lists, keywords, Spamhaus) was bad enough to drive people back to Gmail. Big tech wins on volume — billions of messages per day.

### Stack: rspamd GPT plugin + local llama.cpp

[rspamd](https://rspamd.com/) already does DNS, Bayes, blacklists. The **GPT plugin** sends headers + subject + body to an LLM and expects JSON:

```json
{
  "probability": 0.85,
  "reason": "unsolicited commercial content with suspicious Punycode URL"
}
```

**Privacy rule:** never ship full mail to OpenAI. Run the model locally.

### Model and install

**Model:** `unsloth/gemma-4-12B-it-qat-GGUF:UD-Q4_K_XL` — ~7GB RAM/VRAM, multilingual.

```bash
curl -LsSf https://llama.app/install.sh | sh

llama serve -hf unsloth/gemma-4-12B-it-qat-GGUF:UD-Q4_K_XL \
  --reasoning off -fa on -c 16000 --temp 0.7
```

Hit `http://localhost:8080` — if the chat UI loads, the API is ready.

### rspamd config

`/etc/rspamd/local.d/gpt.conf`:

```ini
allow_ham = true;
allow_passthrough = true;
enabled = true;

type = "openai";
url = "http://192.168.1.5/v1";
model = "unsloth/gemma-4-12B-it-qat-GGUF:UD-Q4_K_XL";
api_key = "this-is-ignored-on-llama.cpp";

max_tokens = 100;
temperature = 0.1;
timeout = 30.0;
json = true;

prompt = "You are an expert email spam classifier. Analyze the following email headers, subject, and body. Respond with a JSON object containing two keys: 'probability' (a floating point number between 0.0 and 1.0 indicating spam probability) and 'reason' (a short sentence explaining why). Output only the raw JSON object, no markdown code fences.";

context {
  enabled = true;
  level = "user";
  min_messages = 5;
  message_ttl = 1209600;
  ttl = 2592000;
}
```

The `context` block stores per-recipient digests in Redis (14-day window) and injects them after **5+ messages** — classification adapts to your inbox, still 100% local.

![Local LLM mail classification pipeline](../../assets/inline-self-host-mail-server-local-llm-antispam-03.jpg)

**No GPU?** Raise `timeout`; CPU inference is slower but works.

Use rspamd’s web UI to paste messages and see how they would score — essential for tuning prompts and thresholds.

## Clients

Desktop: **[Thunderbird](https://www.thunderbird.net/)** — open source, solid search, Android app. Prefer webmail? Mailcow and similar bundles include a panel.

## Ops: control means responsibility

Modern stacks auto-apply security updates, but **backups and restore drills** are on you:

- Lost mail data = lost business and personal history  
- Run at least one “pretend the disk died” recovery  
- Remote access, key rotation, rspamd updates — put them on a checklist  

![Mail server ops and backups](../../assets/inline-self-host-mail-server-local-llm-antispam-04.jpg)

## Quick decision table

| Situation | Recommendation |
|-----------|----------------|
| Static IP + PTR, privacy-first | Home docker-mailserver + local LLM |
| Shaky home network | VPS + same stack |
| Just want `@mydomain.com`, no MTA | Cloudflare Workers path (e.g. Cloud-Mail) |
| Team + compliance | Mailcow or managed host + strict backups |

## Bottom line

**It works.** Brief downtime rarely loses mail; DNS/PTR and spam — the hard parts — now have mature answers.

If you already run a homelab and a local LLM, wiring rspamd is probably the **highest-leverage next step**: Gmail-class filtering, data never leaves your network.

---

**Source:** [You should self-host your mail server](https://blog.haschek.at/2026/you-should-selfhost-your-mail.html)
