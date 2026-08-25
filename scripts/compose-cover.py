#!/usr/bin/env python3
"""Compose a 2:1 blog cover: generated scene + site typography."""

from __future__ import annotations

import argparse
import glob
import re
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
BLOG_DIR = ROOT / "src" / "content" / "blog"
ASSETS = ROOT / "src" / "assets"
WIDTH, HEIGHT = 1600, 800
WATERMARK = "ssherun.github.io"

LATIN_KEEP = {
    "Agent",
    "Agents",
    "AI",
    "CLI",
    "CPO",
    "DeepSeek",
    "Engram",
    "OpenClaw",
    "Clawdbot",
    "Claude",
    "Skills",
    "Skill",
    "DESIGN.md",
    "Stitch",
    "Google",
    "Whatnot",
    "YouMind",
    "AutoClip",
    "Cloud-Mail",
    "Lovable",
    "Windows",
    "WinPE",
    "PECMD",
    "VS",
    "ATL",
    "DLL",
    "PM",
    "YC",
    "CEO",
    "LLM",
    "MoE",
    "UI",
    "EPD",
    "PRD",
}


def find_pingfang() -> tuple[str, int, int]:
    hits = sorted(glob.glob("/System/Library/AssetsV2/**/PingFang.ttc", recursive=True))
    if hits:
        return hits[0], 11, 7  # SC Semibold, SC Medium
    return "/System/Library/Fonts/Hiragino Sans GB.ttc", 2, 0


def load_font(path: str, size: int, index: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size=size, index=index)


def parse_frontmatter(slug: str, en: bool = False) -> dict[str, object]:
    path = BLOG_DIR / (f"{slug}.en.md" if en else f"{slug}.md")
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---"):
        raise SystemExit(f"no frontmatter in {path}")
    _, raw, _ = text.split("---", 2)
    data: dict[str, object] = {}
    for line in raw.splitlines():
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        data[key.strip()] = value.strip().strip("'\"")
    tags_match = re.search(r"tags:\s*\[(.*?)\]", raw, re.S)
    if tags_match:
        data["tags"] = [item.strip().strip("'\"") for item in tags_match.group(1).split(",") if item.strip()]
    else:
        data["tags"] = []
    return data


def tokenize(title: str) -> list[str]:
    tokens: list[str] = []
    buf = ""
    i = 0
    while i < len(title):
        ch = title[i]
        if ch.isspace():
            if buf:
                tokens.append(buf)
                buf = ""
            tokens.append(" ")
            i += 1
            continue
        if re.match(r"[A-Za-z0-9]", ch):
            j = i
            while j < len(title) and re.match(r"[A-Za-z0-9_\-.]", title[j]):
                j += 1
            word = title[i:j]
            if buf:
                tokens.append(buf)
                buf = ""
            tokens.append(word)
            i = j
            continue
        if buf:
            tokens.append(buf)
            buf = ""
        tokens.append(ch)
        i += 1
    if buf:
        tokens.append(buf)
    return tokens


def text_width(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.FreeTypeFont) -> float:
    return draw.textlength(text, font=font)


def wrap_tokens(draw: ImageDraw.ImageDraw, title: str, font: ImageFont.FreeTypeFont, max_width: int) -> list[str]:
    tokens = tokenize(title)
    lines: list[str] = []
    current = ""
    for token in tokens:
        trial = current + token
        if current and text_width(draw, trial, font) > max_width:
            lines.append(current.strip())
            current = token.lstrip()
        else:
            current = trial
    if current.strip():
        lines.append(current.strip())
    return lines or [title]


def wrap_title(draw: ImageDraw.ImageDraw, title: str, font: ImageFont.FreeTypeFont, max_width: int) -> list[str]:
    for sep in ("：", ":", "——", " — ", "？"):
        if sep in title:
            left, right = title.split(sep, 1)
            head = (left + ("" if sep.startswith(" ") else sep)).strip()
            tail = right.strip()
            lines = [head, *wrap_tokens(draw, tail, font, max_width)]
            if 2 <= len(lines) <= 3 and all(text_width(draw, line, font) <= max_width for line in lines):
                return lines
    return wrap_tokens(draw, title, font, max_width)


def fit_title(
    draw: ImageDraw.ImageDraw, title: str, font_path: str, font_index: int, max_width: int
) -> tuple[ImageFont.FreeTypeFont, list[str], int]:
    for size in range(74, 39, -2):
        font = load_font(font_path, size, font_index)
        lines = wrap_title(draw, title, font, max_width)
        if len(lines) <= 3 and all(text_width(draw, line, font) <= max_width for line in lines):
            return font, lines, size
    font = load_font(font_path, 40, font_index)
    return font, wrap_title(draw, title, font, max_width), 40


def draw_corner(draw: ImageDraw.ImageDraw, x: int, y: int, dx: int, dy: int, length: int = 36) -> None:
    color = (226, 244, 255, 170)
    width = 2
    draw.line([(x, y), (x + dx * length, y)], fill=color, width=width)
    draw.line([(x, y), (x, y + dy * length)], fill=color, width=width)


def compose(bg_path: Path, title: str, tags: list[str], out_path: Path) -> None:
    bg = Image.open(bg_path).convert("RGB")
    bg_ratio = bg.width / bg.height
    target_ratio = WIDTH / HEIGHT
    if bg_ratio > target_ratio:
        new_w = int(bg.height * target_ratio)
        left = (bg.width - new_w) // 2
        bg = bg.crop((left, 0, left + new_w, bg.height))
    else:
        new_h = int(bg.width / target_ratio)
        top = (bg.height - new_h) // 2
        bg = bg.crop((0, top, bg.width, top + new_h))
    canvas = bg.resize((WIDTH, HEIGHT), Image.Resampling.LANCZOS)

    overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    shade = Image.new("RGBA", (WIDTH, HEIGHT), (6, 10, 22, 0))
    shade_draw = ImageDraw.Draw(shade)
    for y in range(HEIGHT):
        t = abs((y - HEIGHT / 2) / (HEIGHT / 2))
        alpha = int(120 + 85 * (1 - t**0.65))
        shade_draw.line([(0, y), (WIDTH, y)], fill=(6, 10, 22, alpha))
    overlay = Image.alpha_composite(overlay, shade)

    glow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.ellipse((80, 90, 620, 620), fill=(0, 240, 255, 28))
    glow_draw.ellipse((980, 140, 1580, 700), fill=(168, 85, 247, 24))
    overlay = Image.alpha_composite(overlay, glow.filter(ImageFilter.GaussianBlur(42)))

    frame = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    frame_draw = ImageDraw.Draw(frame)
    draw_corner(frame_draw, 42, 42, 1, 1)
    draw_corner(frame_draw, WIDTH - 42, HEIGHT - 42, -1, -1)
    overlay = Image.alpha_composite(overlay, frame)

    composed = Image.alpha_composite(canvas.convert("RGBA"), overlay)
    draw = ImageDraw.Draw(composed)

    font_path, title_index, tag_index = find_pingfang()
    max_text_width = 1280
    title_font, lines, title_size = fit_title(draw, title, font_path, title_index, max_text_width)
    line_gap = int(title_size * 0.28)
    tag_font = load_font(font_path, 24, tag_index)
    mark_font = load_font(font_path, 20, tag_index)

    tag_h = 44
    tag_gap = 14
    tag_pad_x = 18
    tag_boxes = []
    for tag in tags[:4]:
        w = int(text_width(draw, tag, tag_font)) + tag_pad_x * 2
        tag_boxes.append((tag, w))
    tags_width = sum(w for _, w in tag_boxes) + tag_gap * max(0, len(tag_boxes) - 1)

    title_block_h = len(lines) * title_size + max(0, len(lines) - 1) * line_gap
    block_h = title_block_h + (36 + tag_h if tag_boxes else 0)
    y = (HEIGHT - block_h) // 2 - 8

    for line in lines:
        w = text_width(draw, line, title_font)
        x = (WIDTH - w) / 2
        draw.text((x + 1, y + 2), line, font=title_font, fill=(0, 0, 0, 90))
        draw.text((x, y), line, font=title_font, fill=(248, 251, 255, 245))
        y += title_size + line_gap

    if tag_boxes:
        y += 8
        x = (WIDTH - tags_width) / 2
        for tag, w in tag_boxes:
            box = (x, y, x + w, y + tag_h)
            draw.rounded_rectangle(box, radius=22, fill=(8, 18, 32, 120), outline=(140, 230, 255, 200), width=2)
            tw = text_width(draw, tag, tag_font)
            draw.text((x + (w - tw) / 2, y + 8), tag, font=tag_font, fill=(186, 240, 255, 235))
            x += w + tag_gap

    mw = text_width(draw, WATERMARK, mark_font)
    draw.text((WIDTH - 48 - mw, HEIGHT - 44), WATERMARK, font=mark_font, fill=(220, 232, 245, 160))

    out_path.parent.mkdir(parents=True, exist_ok=True)
    composed.convert("RGB").save(out_path, "JPEG", quality=90, optimize=True)
    print(f"wrote {out_path}")


def default_out(slug: str, hero_image: str, en: bool = False) -> Path:
    if en:
        return ASSETS / f"cover-{slug}-en.jpg"
    name = Path(str(hero_image)).name
    return ASSETS / name if name else ASSETS / f"cover-{slug}.jpg"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--slug", required=True)
    parser.add_argument("--bg", required=True)
    parser.add_argument("--out")
    parser.add_argument("--en", action="store_true")
    args = parser.parse_args()
    meta = parse_frontmatter(args.slug, en=args.en)
    title = str(meta.get("title", args.slug))
    tags = list(meta.get("tags") or [])
    out = Path(args.out) if args.out else default_out(args.slug, str(meta.get("heroImage", "")), en=args.en)
    compose(Path(args.bg), title, tags, out)


if __name__ == "__main__":
    main()
