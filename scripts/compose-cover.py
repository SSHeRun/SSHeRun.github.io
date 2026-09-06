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
UI_TS = ROOT / "src" / "i18n" / "ui.ts"
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


def en_tag_labels() -> dict[str, str]:
    """从 src/i18n/ui.ts 的 en 段读出 tag_* 词条。

    frontmatter 里的 tags 是受控中文词表（CANONICAL_TAGS），站点靠
    i18n 的 tagLabel() 在英文页显示成 Engineering / Startup 等。
    封面此前不走这层，于是英文封面上印着中文标签。这里复用同一份词条，
    避免另立一套映射跑偏。
    """
    try:
        text = UI_TS.read_text(encoding="utf-8")
    except OSError:
        return {}
    _, _, after_en = text.partition("en:")
    mapping: dict[str, str] = {}
    for m in re.finditer(r"tag_([^:\s]+):\s*'([^']*)'", after_en):
        mapping[m.group(1).replace("_", " ")] = m.group(2)
    return mapping


def unquote_scalar(value: str) -> str:
    """还原 YAML 标量：单引号串里的 '' 是一个字面单引号。

    不处理会让 `title: 'YC''s CEO'` 原样画到封面上（曾影响 10 篇英文封面）。
    """
    if len(value) >= 2 and value[0] == value[-1] == "'":
        return value[1:-1].replace("''", "'")
    if len(value) >= 2 and value[0] == value[-1] == '"':
        return value[1:-1]
    return value


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
        data[key.strip()] = unquote_scalar(value.strip())
    tags_match = re.search(r"tags:\s*\[(.*?)\]", raw, re.S)
    if tags_match:
        tags = [unquote_scalar(item.strip()) for item in tags_match.group(1).split(",") if item.strip()]
    else:
        tags = []
    if en:
        labels = en_tag_labels()
        tags = [labels.get(tag, tag) for tag in tags]
    data["tags"] = tags
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

    # 只在标题带上压暗，强度按该区域实际亮度自适应。
    # 旧版是整幅 (6,10,22) alpha 120~205 的蓝黑蒙版 + 固定青紫光晕，
    # 等于给每张封面强行套一层赛博朋克，背景再不同也会被抹平。
    band_top, band_bottom = int(HEIGHT * 0.26), int(HEIGHT * 0.74)
    band = canvas.crop((0, band_top, WIDTH, band_bottom)).resize((64, 24))
    px = list(band.getdata())
    luma = sum(0.299 * r + 0.587 * g + 0.114 * b for r, g, b in px) / len(px)
    # 亮背景多压一点、暗背景少压；上限刻意留低，靠标题的模糊光晕补对比
    peak = int(max(60, min(150, 48 + luma * 0.52)))

    shade = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    shade_draw = ImageDraw.Draw(shade)
    for y in range(HEIGHT):
        t = abs((y - HEIGHT / 2) / (HEIGHT / 2))
        falloff = max(0.0, 1 - t**1.5)
        alpha = int(peak * falloff * 0.92 + 26)
        shade_draw.line([(0, y), (WIDTH, y)], fill=(10, 12, 18, alpha))
    overlay = Image.alpha_composite(overlay, shade.filter(ImageFilter.GaussianBlur(8)))

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

    # 标题阴影单独一层做高斯模糊：有了这层柔光，压暗蒙版可以轻很多，
    # 背景的固有色才留得住（否则每张封面都会被压成同一种暗蓝）。
    halo = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    halo_draw = ImageDraw.Draw(halo)
    hy = y
    for line in lines:
        w = text_width(draw, line, title_font)
        halo_draw.text(((WIDTH - w) / 2, hy + 3), line, font=title_font, fill=(0, 0, 0, 190))
        hy += title_size + line_gap
    composed.alpha_composite(halo.filter(ImageFilter.GaussianBlur(14)))
    draw = ImageDraw.Draw(composed)

    for line in lines:
        w = text_width(draw, line, title_font)
        x = (WIDTH - w) / 2
        draw.text((x + 1, y + 2), line, font=title_font, fill=(0, 0, 0, 80))
        draw.text((x, y), line, font=title_font, fill=(248, 251, 255, 248))
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
    parser.add_argument("--slug")
    parser.add_argument("--bg", required=True)
    parser.add_argument("--out")
    parser.add_argument("--en", action="store_true")
    parser.add_argument("--title", help="绕过 frontmatter 直接给标题，用于站点 OG 图这类没有文章的封面")
    parser.add_argument("--tags", help="逗号分隔，仅在 --title 模式下生效")
    args = parser.parse_args()

    if args.title:
        if not args.out:
            parser.error("--title 模式没有 slug 可推导文件名，必须显式给 --out")
        title = args.title
        tags = [tag.strip() for tag in (args.tags or "").split(",") if tag.strip()]
        out = Path(args.out)
    else:
        if not args.slug:
            parser.error("需要 --slug（读文章 frontmatter）或 --title（直接指定）")
        meta = parse_frontmatter(args.slug, en=args.en)
        title = str(meta.get("title", args.slug))
        tags = list(meta.get("tags") or [])
        out = Path(args.out) if args.out else default_out(args.slug, str(meta.get("heroImage", "")), en=args.en)

    compose(Path(args.bg), title, tags, out)


if __name__ == "__main__":
    main()
