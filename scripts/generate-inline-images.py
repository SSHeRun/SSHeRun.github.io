#!/usr/bin/env python3
"""Generate atmospheric inline blog images and insert markdown references."""

from __future__ import annotations

import hashlib
import math
import random
import re
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
BLOG_DIR = ROOT / "src" / "content" / "blog"
ASSETS = ROOT / "src" / "assets"
WIDTH, HEIGHT = 1536, 1024

POSTS: dict[str, dict[str, object]] = {
    "deepseek-engram-conditional-memory": {
        "palette": [(8, 18, 42), (0, 180, 220), (120, 60, 220)],
        "captions": {
            "zh": ["稀疏记忆与条件查表", "MoE 与 Engram 双轴架构"],
            "en": ["Sparse memory and conditional lookup", "MoE and Engram dual-axis architecture"],
        },
    },
    "whatnot-cpo-regrets-pm-exists": {
        "palette": [(20, 16, 30), (255, 120, 80), (90, 140, 255)],
        "captions": {
            "zh": ["产品团队与工程师配比", "更少更资深的 PM 配置"],
            "en": ["Product team and engineer ratios", "Fewer, more senior PM staffing"],
        },
    },
    "gpt-56-saul-agent-startup-experiment": {
        "palette": [(12, 10, 24), (255, 90, 120), (0, 220, 180)],
        "captions": {
            "zh": ["24 小时自主经营实验", "Agent 与真实商业摩擦"],
            "en": ["A 24-hour autonomous startup run", "Agent friction with real business"],
        },
    },
    "cloudflare-workers-access-vibe-coded-apps": {
        "palette": [(6, 20, 36), (255, 150, 40), (40, 160, 255)],
        "captions": {
            "zh": ["Workers 应用默认公开的风险", "Access 策略一键加锁"],
            "en": ["Risk of public-by-default Workers apps", "One-click Access policy lockdown"],
        },
    },
    "stack-overflow-ai-context-architecture-build-buy": {
        "palette": [(10, 14, 28), (120, 220, 120), (255, 200, 80)],
        "captions": {
            "zh": ["AI 上下文护栏与信任分", "自建与购买的边界"],
            "en": ["AI context guardrails and trust scores", "Where build ends and buy begins"],
        },
    },
    "ezindie-weekly-153-aceternity-ui-80k-mrr": {
        "palette": [(18, 10, 32), (180, 100, 255), (255, 120, 200)],
        "captions": {
            "zh": ["组件库从爱好到产品", "分发优先于完美"],
            "en": ["From hobby components to product", "Distribution before perfection"],
        },
    },
    "nie-grassroots-logic-skill": {
        "palette": [(24, 18, 12), (220, 160, 80), (80, 120, 90)],
        "captions": {
            "zh": ["基层治理分析框架", "Skill 限定分析边界"],
            "en": ["Grassroots governance frameworks", "Skills that bound analysis"],
        },
    },
    "kdc-knowledge-engineering-not-files": {
        "palette": [(8, 16, 28), (80, 200, 255), (255, 180, 60)],
        "captions": {
            "zh": ["表示不等于知识", "版本与证据链治理"],
            "en": ["Representation is not knowledge", "Versioning and evidence governance"],
        },
    },
    "ringcentral-ai-native-challenge": {
        "palette": [(10, 18, 34), (0, 220, 200), (255, 100, 140)],
        "captions": {
            "zh": ["全员 AI 原生挑战", "非技术岗也能交付软件"],
            "en": ["Company-wide AI-native challenge", "Non-engineers shipping software"],
        },
    },
    "nvidia-risky-business-ai-funding": {
        "palette": [(6, 10, 18), (120, 220, 80), (255, 200, 60)],
        "captions": {
            "zh": ["AI 基建融资链条", "CapEx 与债务风险镜像"],
            "en": ["AI infrastructure funding chain", "CapEx and debt risk mirrors"],
        },
    },
    "openai-daybreak-gpt-56-cyber-defense": {
        "palette": [(4, 8, 16), (255, 60, 80), (60, 140, 255)],
        "captions": {
            "zh": ["网络防御窗口收窄", "攻防分层与硬件密钥"],
            "en": ["A narrowing cyber defense window", "Layered offense-defense and hardware keys"],
        },
    },
    "redis-monitoring-latency-ai-networks": {
        "palette": [(8, 12, 22), (255, 80, 60), (0, 200, 170)],
        "captions": {
            "zh": ["延迟作为正确性信号", "RAG 检索优雅降级"],
            "en": ["Latency as a correctness signal", "Graceful degradation in RAG retrieval"],
        },
    },
    "lenny-founder-archetypes-comms-strategy": {
        "palette": [(16, 12, 28), (255, 140, 100), (120, 180, 255)],
        "captions": {
            "zh": ["创始人直述的力量", "Problem / Insight / Vision 原型"],
            "en": ["The power of founder-led voice", "Problem, Insight, and Vision archetypes"],
        },
    },
}


def seed_for(slug: str, idx: int) -> int:
    h = hashlib.sha256(f"{slug}:{idx}".encode()).hexdigest()
    return int(h[:8], 16)


def lerp(a: float, b: float, t: float) -> float:
    return a + (b - a) * t


def mix(c1: tuple[int, int, int], c2: tuple[int, int, int], t: float) -> tuple[int, int, int]:
    return tuple(int(lerp(c1[i], c2[i], t)) for i in range(3))


def draw_atmosphere(slug: str, idx: int, palette: list[tuple[int, int, int]]) -> Image.Image:
    rng = random.Random(seed_for(slug, idx))
    base, accent_a, accent_b = palette
    img = Image.new("RGB", (WIDTH, HEIGHT), base)
    draw = ImageDraw.Draw(img)

    for y in range(HEIGHT):
        t = y / HEIGHT
        c = mix(base, accent_a, t * 0.55)
        c = mix(c, accent_b, (1 - abs(t - 0.35) * 1.4) * 0.25)
        draw.line([(0, y), (WIDTH, y)], fill=c)

    overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    for _ in range(5):
        cx = rng.randint(-200, WIDTH + 200)
        cy = rng.randint(-100, HEIGHT + 100)
        rx = rng.randint(180, 520)
        ry = rng.randint(120, 420)
        color = accent_a if rng.random() > 0.5 else accent_b
        alpha = rng.randint(18, 42)
        od.ellipse((cx - rx, cy - ry, cx + rx, cy + ry), fill=(*color, alpha))

    overlay = overlay.filter(ImageFilter.GaussianBlur(radius=48))
    img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")
    draw = ImageDraw.Draw(img)

    grid = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    gd = ImageDraw.Draw(grid)
    step = 56
    for x in range(0, WIDTH, step):
        gd.line([(x, 0), (x, HEIGHT)], fill=(255, 255, 255, 10), width=1)
    for y in range(0, HEIGHT, step):
        gd.line([(0, y), (WIDTH, y)], fill=(255, 255, 255, 10), width=1)
    img = Image.alpha_composite(img.convert("RGBA"), grid).convert("RGB")
    draw = ImageDraw.Draw(img)

    for i in range(3):
        x1 = rng.randint(80, WIDTH - 80)
        y1 = rng.randint(80, HEIGHT - 80)
        size = rng.randint(40, 140)
        color = accent_b if i % 2 else accent_a
        draw.rectangle(
            (x1, y1, x1 + size, y1 + size),
            outline=(*color,),
            width=2,
        )

    sweep = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    sd = ImageDraw.Draw(sweep)
    for angle in range(0, 360, 18):
        rad = math.radians(angle + idx * 17)
        x2 = int(WIDTH / 2 + math.cos(rad) * WIDTH)
        y2 = int(HEIGHT / 2 + math.sin(rad) * HEIGHT)
        sd.line([(WIDTH // 2, HEIGHT // 2), (x2, y2)], fill=(*accent_a, 8), width=2)
    img = Image.alpha_composite(img.convert("RGBA"), sweep).convert("RGB")

    vignette = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    vd = ImageDraw.Draw(vignette)
    for r in range(min(WIDTH, HEIGHT) // 2, 0, -12):
        alpha = int(90 * (1 - r / (min(WIDTH, HEIGHT) / 2)) ** 1.6)
        vd.ellipse(
            (WIDTH // 2 - r, HEIGHT // 2 - int(r * 0.72), WIDTH // 2 + r, HEIGHT // 2 + int(r * 0.72)),
            outline=(0, 0, 0, alpha),
            width=14,
        )
    img = Image.alpha_composite(img.convert("RGBA"), vignette).convert("RGB")
    return img


def generate_assets(slug: str, meta: dict[str, object]) -> list[Path]:
    palette = meta["palette"]  # type: ignore[assignment]
    paths: list[Path] = []
    for idx in (1, 2):
        out = ASSETS / f"inline-{slug}-{idx:02d}.jpg"
        if not out.exists():
            img = draw_atmosphere(slug, idx, palette)
            out.parent.mkdir(parents=True, exist_ok=True)
            img.save(out, "JPEG", quality=90, optimize=True)
            print(f"generated {out.name}")
        else:
            print(f"exists {out.name}")
        paths.append(out)
    return paths


def split_body(text: str) -> tuple[str, str]:
    if not text.startswith("---"):
        raise ValueError("missing frontmatter")
    _, fm, body = text.split("---", 2)
    return f"---{fm}---", body.lstrip("\n")


def find_insert_points(body: str) -> tuple[int, int]:
    lines = body.splitlines(keepends=True)
    h2_idxs = [i for i, line in enumerate(lines) if line.startswith("## ")]
    if len(h2_idxs) >= 2:
        first_h2 = h2_idxs[0]
        second_h2 = h2_idxs[1]
        return first_h2, second_h2
    if len(h2_idxs) == 1:
        mid = max(1, len(lines) // 2)
        return min(3, len(lines)), h2_idxs[0]
    # fallback
    mid = max(1, len(lines) // 2)
    return min(3, len(lines)), mid


def has_inline_images(body: str, slug: str) -> bool:
    return f"inline-{slug}-01.jpg" in body and f"inline-{slug}-02.jpg" in body


def insert_images(body: str, slug: str, captions: list[str]) -> str:
    if has_inline_images(body, slug):
        return body
    lines = body.splitlines(keepends=True)
    p1, p2 = find_insert_points(body)
    img1 = f"\n![{captions[0]}](../../assets/inline-{slug}-01.jpg)\n\n"
    img2 = f"\n![{captions[1]}](../../assets/inline-{slug}-02.jpg)\n\n"
    lines.insert(p2, img2)
    lines.insert(p1, img1)
    return "".join(lines)


def process_slug(slug: str) -> None:
    meta = POSTS[slug]
    generate_assets(slug, meta)
    captions = meta["captions"]  # type: ignore[assignment]
    for lang, suffix in (("zh", ".md"), ("en", ".en.md")):
        path = BLOG_DIR / f"{slug}{suffix}"
        if not path.exists():
            print(f"skip missing {path.name}")
            continue
        text = path.read_text(encoding="utf-8")
        fm, body = split_body(text)
        new_body = insert_images(body, slug, captions[lang])
        if new_body != body:
            path.write_text(fm + "\n" + new_body, encoding="utf-8")
            print(f"updated {path.name}")


def main() -> None:
    for slug in POSTS:
        process_slug(slug)


if __name__ == "__main__":
    main()
