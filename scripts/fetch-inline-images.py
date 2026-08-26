#!/usr/bin/env python3
"""Fetch Pexels photos and insert inline images into blog posts."""

from __future__ import annotations

import json
import os
import re
import sys
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BLOG_DIR = ROOT / "src" / "content" / "blog"
ASSETS = ROOT / "src" / "assets"
ENV_FILE = Path("/Users/ssherun/.openclaw/workspace/.env.local")

POSTS: dict[str, dict] = {
    "deepseek-engram-conditional-memory": {
        "queries": ["neural network architecture abstract", "computer memory chip technology"],
        "zh": ["MoE 与条件记忆架构", "N-gram 查表与稀疏计算"],
        "en": ["MoE and conditional memory architecture", "N-gram lookup and sparse compute"],
    },
    "whatnot-cpo-regrets-pm-exists": {
        "queries": ["startup team meeting office", "engineer working laptop focused"],
        "zh": ["产品编制与团队结构", "资深 IC 直接对接工程"],
        "en": ["Product org structure debate", "Senior IC working with engineers"],
    },
    "gpt-56-saul-agent-startup-experiment": {
        "queries": ["artificial intelligence robot office", "empty revenue chart startup"],
        "zh": ["AI Agent 24 小时创业实验", "营收为零的仪表盘"],
        "en": ["AI agent startup experiment", "Empty revenue dashboard"],
    },
    "cloudflare-workers-access-vibe-coded-apps": {
        "queries": ["cyber security lock digital", "cloud server network edge"],
        "zh": ["内部应用一键加锁", "边缘 Worker 与身份验证"],
        "en": ["Locking internal apps", "Edge workers and identity"],
    },
    "stack-overflow-ai-context-architecture-build-buy": {
        "queries": ["software architecture diagram", "business decision fork road"],
        "zh": ["Agent 上下文护栏架构", "自建与采购的分岔路"],
        "en": ["Agent context guardrails", "Build vs buy crossroads"],
    },
    "ezindie-weekly-153-aceternity-ui-80k-mrr": {
        "queries": ["ui design components screen", "product hunt launch celebration"],
        "zh": ["独立开发者组件库起量", "Product Hunt 发布起量"],
        "en": ["Indie UI component library growth", "Product Hunt launch momentum"],
    },
    "nie-grassroots-logic-skill": {
        "queries": ["china city map aerial", "government policy documents desk"],
        "zh": ["基层治理框架分析", "县域决策与政策脉络"],
        "en": ["Grassroots governance framework", "County-level policy decisions"],
    },
    "kdc-knowledge-engineering-not-files": {
        "queries": ["outdated documents stack office", "knowledge graph data network"],
        "zh": ["旧版政策文档堆叠", "知识版本与治理"],
        "en": ["Stack of outdated policy docs", "Knowledge versioning and governance"],
    },
    "ringcentral-ai-native-challenge": {
        "queries": ["corporate hackathon team collaboration", "employee using ai laptop"],
        "zh": ["全员 AI 创新挑战", "非技术岗也在交付软件"],
        "en": ["Company-wide AI challenge", "Non-engineers shipping software"],
    },
    "nvidia-risky-business-ai-funding": {
        "queries": ["stock market finance chart", "data center gpu servers"],
        "zh": ["AI 基建资本堆叠", "债务与股权融资链条"],
        "en": ["AI infrastructure capital stack", "Debt and equity funding chain"],
    },
    "openai-daybreak-gpt-56-cyber-defense": {
        "queries": ["cybersecurity operations center", "hacker defense shield digital"],
        "zh": ["网络安全攻防演练", "防御窗口正在收窄"],
        "en": ["Cyber defense operations", "Narrowing defense window"],
    },
    "redis-monitoring-latency-ai-networks": {
        "queries": ["server monitoring dashboard dark", "network latency graph screen"],
        "zh": ["监控正常但答案变差", "延迟曲线与尾延迟"],
        "en": ["Monitoring looks fine but answers degrade", "Latency curves and tail latency"],
    },
    "lenny-founder-archetypes-comms-strategy": {
        "queries": ["founder talking customer coffee", "three paths crossroads startup"],
        "zh": ["创始人与用户对谈", "三种传播原型分岔"],
        "en": ["Founder talking with users", "Three founder archetype paths"],
    },
}


def load_pexels_key() -> str:
    if not ENV_FILE.exists():
        raise SystemExit(f"missing env file: {ENV_FILE}")
    for line in ENV_FILE.read_text(encoding="utf-8").splitlines():
        if line.startswith("PEXELS_API_KEY="):
            return line.split("=", 1)[1].strip().strip('"').strip("'")
    raise SystemExit("PEXELS_API_KEY not found")


def pexels_search(api_key: str, query: str, page: int = 1) -> dict:
    url = "https://api.pexels.com/v1/search?" + urllib.parse.urlencode(
        {"query": query, "per_page": 15, "page": page, "orientation": "landscape"}
    )
    req = urllib.request.Request(
        url,
        headers={"Authorization": api_key, "User-Agent": "SSHeRun-blog/1.0"},
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


def download(url: str, dest: Path) -> None:
    req = urllib.request.Request(url, headers={"User-Agent": "SSHeRun-blog/1.0"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = resp.read()
    dest.write_bytes(data)


def pick_photo(api_key: str, query: str, used_ids: set[int]) -> tuple[int, str]:
    for page in (1, 2, 3):
        payload = pexels_search(api_key, query, page=page)
        for photo in payload.get("photos", []):
            pid = int(photo["id"])
            if pid in used_ids:
                continue
            src = photo.get("src", {})
            url = src.get("large2x") or src.get("large") or src.get("original")
            if url:
                used_ids.add(pid)
                return pid, url
    raise RuntimeError(f"no photo found for query: {query}")


def section_positions(text: str) -> list[tuple[int, str]]:
    positions: list[tuple[int, str]] = []
    for match in re.finditer(r"^## .+$", text, flags=re.M):
        positions.append((match.start(), match.group(0)))
    return positions


def insert_images(text: str, slug: str, captions: list[str]) -> str:
    if "inline-" in text:
        return text

    positions = section_positions(text)
    if len(positions) < 2:
        # fallback: after frontmatter and near end
        parts = text.split("---", 2)
        if len(parts) < 3:
            return text
        body = parts[2]
        img1 = f"\n\n![{captions[0]}](../../assets/inline-{slug}-01.jpg)\n"
        img2 = f"\n\n![{captions[1]}](../../assets/inline-{slug}-02.jpg)\n"
        return "---".join(parts[:2]) + body[:200] + img1 + body[200 : len(body) // 2] + img2 + body[len(body) // 2 :]

    # image 1 after first ## heading line
    p1_start, p1_line = positions[0]
    p1_end = text.find("\n", p1_start)
    insert1 = p1_end + 1
    img1 = f"\n![{captions[0]}](../../assets/inline-{slug}-01.jpg)\n"

    # image 2 after mid ## heading (prefer ~halfway through sections)
    mid_idx = min(len(positions) - 1, max(1, len(positions) // 2))
    p2_start, _ = positions[mid_idx]
    p2_end = text.find("\n", p2_start)
    insert2 = p2_end + 1
    img2 = f"\n![{captions[1]}](../../assets/inline-{slug}-02.jpg)\n"

    # apply from back to front
    out = text
    out = out[:insert2] + img2 + out[insert2:]
  # recompute insert1 because length changed - actually insert2 > insert1 always if mid_idx >= 1
    out = out[:insert1] + img1 + out[insert1:]
    return out


def process_slug(api_key: str, slug: str, used_ids: set[int], dry_run: bool = False) -> None:
    meta = POSTS[slug]
    for idx, query in enumerate(meta["queries"], start=1):
        dest = ASSETS / f"inline-{slug}-0{idx}.jpg"
        if dest.exists() and dest.stat().st_size > 10000:
            print(f"skip existing {dest.name}")
            continue
        pid, url = pick_photo(api_key, query, used_ids)
        print(f"fetch {dest.name} <- pexels:{pid} ({query})")
        if not dry_run:
            download(url, dest)

    zh_path = BLOG_DIR / f"{slug}.md"
    en_path = BLOG_DIR / f"{slug}.en.md"
    for path, lang in ((zh_path, "zh"), (en_path, "en")):
        if not path.exists():
            print(f"warn: missing {path.name}")
            continue
        text = path.read_text(encoding="utf-8")
        if "inline-" in text:
            print(f"skip markdown already has inline images: {path.name}")
            continue
        updated = insert_images(text, slug, meta[lang])
        if updated != text:
            print(f"update {path.name}")
            if not dry_run:
                path.write_text(updated, encoding="utf-8")


def main() -> None:
    dry_run = "--dry-run" in sys.argv
    slugs = [s for s in sys.argv[1:] if not s.startswith("-")]
    if not slugs:
        slugs = list(POSTS.keys())

    api_key = load_pexels_key()
    used_ids: set[int] = set()
    for slug in slugs:
        if slug not in POSTS:
            print(f"warn: unknown slug {slug}")
            continue
        process_slug(api_key, slug, used_ids, dry_run=dry_run)

    print("done")


if __name__ == "__main__":
    main()
