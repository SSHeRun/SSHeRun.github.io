---
title: '2026 自建邮件服务器教程：docker-mailserver + rspamd + 本地 LLM 反垃圾'
description: '「邮件不能自建」是过时说法。本文拆解家里/VPS 部署条件、SPF/DKIM/DMARC 配置、docker-mailserver 选型，以及用 rspamd 接本地 Gemma 实现 Gmail 级反垃圾的完整路径。'
pubDate: '2026-08-26'
heroImage: '../../assets/cover-self-host-mail-server-local-llm-antispam.jpg'
tags: ['教程', '工具', '开源']
---

在自建社区里，有一句老生常谈：**「什么都能自建，就是别碰邮件服务器。」**

黑名单、进不了收件箱、反垃圾形同虚设——这些 horror story 不假。但 2026 年情况变了：**本地 LLM + rspamd** 把最后一道坎（垃圾邮件）基本填平了。如果你在意数据主权，这篇值得认真看。

原文来自 MSP 从业者 [Christian Haschek](https://blog.haschek.at/2026/you-should-selfhost-your-mail.html)，他自己帮企业从 Gmail / Microsoft 迁出，也把自己的 Google Workspace 换成了自托管。

![自建邮件与数据主权](../../assets/inline-self-host-mail-server-local-llm-antispam-01.jpg)

## 先回答：家里能跑吗？

通常建议 VPS，但**家里网络满足下面全部条件时，100% 可以**：

| 条件 | 为什么重要 |
|------|-----------|
| **静态 IPv4** | 动态 IP 会让 MX/PTR 失效；先查 [黑名单](https://mxtoolbox.com/blacklists.aspx) |
| **非 CGNAT** | 运营商大内网 NAT 下，外网连不进 25 端口 |
| **PTR 可改** | 反向 DNS 必须解析到 `mail.yourdomain.com`，只能找 ISP 开 |
| **端口开放** | `25` `143` `465` `587` `993` |

**断网会丢信吗？** 一般不会。SMTP 发件方会重试；作者的经验是**每天断网 <40% 仍正常**。早期互联网 outages 多，协议就是为这个设计的。

## 选什么邮件软件？

| 方案 | 适合谁 |
|------|--------|
| **[docker-mailserver](https://docker-mailserver.github.io/)** | **从零开始首选**，Docker 一键、默认合理 |
| [Stalwart](https://stalw.art/) | 现代 Rust 栈，性能党 |
| [Mailcow](https://mailcow.github.io/) | 要 Web 管理面板的一体化方案 |
| 纯手工 Postfix+Dovecot | 极客/学习用，维护成本高 |

作者因历史原因用 ISPConfig；**今天新开我会选 docker-mailserver**。

## DNS：不配齐 = 进不了收件箱

邮件软件通常会引导你，但核心就这几条：

### SPF（谁有资格代你发信）

```txt
v=spf1 mx a ~all
```

### DKIM（每封邮件的加密签名）

服务器生成密钥对，把公钥写进 DNS TXT，形如：

```txt
v=DKIM1; t=s; h=sha256; p=MIGf[...]B;
```

### DMARC（防域名伪造）

SPF/DKIM 的「政策层」，不确定就用 [DMARC 生成器](https://dmarcian.com/dmarc-xml/)。

### MX + A 记录

1. `mail.yourdomain.com` → A 记录指向服务器 IP
2. MX 记录：优先级 `10`，值 `mail.yourdomain.com`

### PTR（反向 DNS）

**只能 ISP 或 VPS 商设置。** 你的 IP 反向解析必须回到 `mail.yourdomain.com`，否则大厂邮箱直接拒收。

![DNS 记录与邮件可达性](../../assets/inline-self-host-mail-server-local-llm-antispam-02.jpg)

**上线前必做：** 去 [mail-tester.com](https://www.mail-tester.com/) 发一封测试信，看 SPF/DKIM/DMARC/黑名单/内容评分——作者说这条工具救过他很多次。

## 反垃圾：本地 LLM 改变了游戏规则

传统开源反垃圾靠 IP 黑名单、关键词、Spamhaus——**效果差到逼人回流 Gmail**。大厂的优势是「每天处理几亿封邮件」的集体智能。

### 方案：rspamd + GPT 插件 + 本地 llama.cpp

[rspamd](https://rspamd.com/) 本身有黑名单、DNS、贝叶斯；真正质变的是 **GPT 插件**——把邮件 headers + subject + body 丢给 LLM，让它返回 JSON：

```json
{
  "probability": 0.85,
  "reason": "unsolicited commercial content with suspicious Punycode URL"
}
```

**隐私前提：** 邮件是高敏数据，**不能**把全文发给 OpenAI API。答案是用**本地模型**。

### 推荐模型与安装

**模型：** `unsloth/gemma-4-12B-it-qat-GGUF:UD-Q4_K_XL` — 约 7GB RAM/VRAM，多语言，分类够用。

```bash
# macOS / Linux
curl -LsSf https://llama.app/install.sh | sh

# 启动 OpenAI 兼容 API
llama serve -hf unsloth/gemma-4-12B-it-qat-GGUF:UD-Q4_K_XL \
  --reasoning off -fa on -c 16000 --temp 0.7
```

浏览器打开 `http://localhost:8080` 能聊天，说明服务 OK。

### rspamd 配置示例

`/etc/rspamd/local.d/gpt.conf`：

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

`context` 块会在 Redis 里存收件人近期邮件摘要（14 天 digest），**5 封以上**后开始注入 prompt——分类会越来越「懂你的收件习惯」，且全程本地。

![本地 LLM 邮件分类流水线](../../assets/inline-self-host-mail-server-local-llm-antispam-03.jpg)

**无 GPU？** 把 `timeout` 调大；CPU 推理慢但能跑。

rspamd 自带 Web UI，可以粘贴任意邮件看「如果当时会怎么判」——调 prompt 和阈值时很有用。

## 客户端用什么？

作者桌面用 **[Thunderbird](https://www.thunderbird.net/)**——开源、搜索够用、Android 也有。Webmail 党可以选 Mailcow 等套件自带面板。

## 运维：你掌控一切，也负责一切

docker-mailserver 等现代方案支持自动安全更新，但**备份和恢复演练**是你自己的活：

- 邮件数据丢了 = 业务/个人通信全灭
- 至少做一次「假装硬盘坏了」的恢复测试
- 远程访问、密钥轮换、rspamd 规则更新——纳入常规 checklist

![邮件服务器运维与备份](../../assets/inline-self-host-mail-server-local-llm-antispam-04.jpg)

## 快速决策表

| 你的情况 | 建议 |
|---------|------|
| 有静态 IP + PTR，在意隐私 | 家里 docker-mailserver + 本地 LLM |
| 网络条件一般 | VPS（Hetzner / 等）+ 同样栈 |
| 只要 `@mydomain.com` 收发，不想养 MTA | 看 Cloudflare Workers 路线（如 Cloud-Mail） |
| 企业合规、多人协作 | Mailcow / 托管 + 严格备份策略 |

## 结论

**能建、能用、垃圾邮件可控。** 短时间的 server down 不会丢信；真正卡住人的 DNS/PTR 和反垃圾，现在都有成熟解。

如果你已经在跑 homelab、本地 LLM，把 rspamd 接上可能是**性价比最高的下一步**——Gmail 级的本地收件箱，数据不出家门。

---

**参考原文：** [You should self-host your mail server](https://blog.haschek.at/2026/you-should-selfhost-your-mail.html)

## 相关文章

- [[x-3-open-source-tools-autoclip-cloud-mail-open-lovable|X 上三款开源神器]]
- [[windows-c-drive-cleanup-guide|Windows C盘清理完全指南]]
- [[openclaw-deployment-guide|OpenClaw 部署完全指南]]
- [[cloudflare-workers-access-vibe-coded-apps|Cloudflare Workers Access]]
