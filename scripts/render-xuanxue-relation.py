#!/usr/bin/env python3
"""Render Baoyu-style cyclic knowledge maps for xuanxue notes."""

from __future__ import annotations

import argparse
import glob
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "public" / "notes-media"
WIDTH, HEIGHT = 1600, 1280

PAPER = (247, 241, 227)
INK = (32, 28, 26)
MUTED = (90, 82, 74)
PASTELS = [
    (196, 224, 242),  # blue
    (196, 228, 196),  # green
    (244, 198, 176),  # peach
    (214, 198, 232),  # purple
    (244, 206, 214),  # pink
    (248, 226, 170),  # gold
]


def pingfang() -> tuple[str, int, int]:
    hits = sorted(glob.glob("/System/Library/AssetsV2/**/PingFang.ttc", recursive=True))
    if hits:
        return hits[0], 11, 7
    return "/System/Library/Fonts/Hiragino Sans GB.ttc", 2, 0


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    path, semi, med = pingfang()
    return ImageFont.truetype(path, size=size, index=semi if bold else med)


def wrap(draw: ImageDraw.ImageDraw, text: str, fnt: ImageFont.FreeTypeFont, max_w: int) -> list[str]:
    lines: list[str] = []
    for raw in text.split("\n"):
        cur = ""
        for ch in raw:
            trial = cur + ch
            if draw.textlength(trial, font=fnt) <= max_w:
                cur = trial
            else:
                if cur:
                    lines.append(cur)
                cur = ch
        if cur:
            lines.append(cur)
    return lines or [""]


def rounded(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], fill, outline, width=3, radius=28):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def arrow(draw: ImageDraw.ImageDraw, p0, p1, p2, color=INK, width=5):
    pts = []
    for i in range(25):
        t = i / 24
        x = (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t**2 * p2[0]
        y = (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t**2 * p2[1]
        pts.append((x, y))
    draw.line(pts, fill=color, width=width, joint="curve")
    x0, y0 = pts[-2]
    x1, y1 = pts[-1]
    ang = math.atan2(y1 - y0, x1 - x0)
    s = 16
    left = (x1 - s * math.cos(ang - 0.45), y1 - s * math.sin(ang - 0.45))
    right = (x1 - s * math.cos(ang + 0.45), y1 - s * math.sin(ang + 0.45))
    draw.polygon([pts[-1], left, right], fill=color)


def node_centers(n: int, cx: float, cy: float, rx: float, ry: float) -> list[tuple[float, float]]:
    # start at top, clockwise
    pts = []
    for i in range(n):
        ang = -math.pi / 2 + i * 2 * math.pi / n
        pts.append((cx + rx * math.cos(ang), cy + ry * math.sin(ang)))
    return pts


def draw_refresh(draw: ImageDraw.ImageDraw, cx: int, cy: int):
    r = 36
    draw.arc((cx - r, cy - r, cx + r, cy + r), start=40, end=300, fill=INK, width=6)
    draw.arc((cx - r + 10, cy - r + 10, cx + r - 10, cy + r - 10), start=220, end=480, fill=INK, width=5)
    draw.polygon([(cx + r - 2, cy - 8), (cx + r + 14, cy + 8), (cx + r - 16, cy + 10)], fill=INK)


def render(spec: dict, dest: Path) -> Path:
    img = Image.new("RGB", (WIDTH, HEIGHT), PAPER)
    # paper grain
    noise = Image.effect_noise((WIDTH, HEIGHT), 12).convert("L")
    paper = Image.blend(img, Image.merge("RGB", (noise, noise, noise)), 0.08)
    img = paper
    draw = ImageDraw.Draw(img)

    title_f = font(36, bold=True)
    body_f = font(28, bold=True)
    sub_f = font(22, bold=False)
    banner_f = font(30, bold=True)
    num_f = font(22, bold=True)
    cap_f = font(20, bold=False)

    nodes = spec["nodes"]
    n = len(nodes)
    cx, cy = WIDTH // 2, 560
    rx, ry = 430, 340
    centers = node_centers(n, cx, cy, rx, ry)
    box_w, box_h = 340, 168

    # arrows first
    for i, (x, y) in enumerate(centers):
        nx, ny = centers[(i + 1) % n]
        mx, my = (x + nx) / 2, (y + ny) / 2
        # pull control point outward
        vx, vy = mx - cx, my - cy
        mag = math.hypot(vx, vy) or 1
        ctrl = (mx + vx / mag * 70, my + vy / mag * 70)
        # start/end slightly outside boxes toward neighbor
        def edge(a, b):
            dx, dy = b[0] - a[0], b[1] - a[1]
            m = math.hypot(dx, dy) or 1
            return (a[0] + dx / m * 175, a[1] + dy / m * 88)

        arrow(draw, edge((x, y), (nx, ny)), ctrl, edge((nx, ny), (x, y)))

    draw_refresh(draw, int(cx), int(cy))

    for i, ((x, y), node) in enumerate(zip(centers, nodes)):
        fill = PASTELS[i % len(PASTELS)]
        left, top = int(x - box_w / 2), int(y - box_h / 2)
        box = (left, top, left + box_w, top + box_h)
        # slight drop via darker rim
        rounded(draw, (left + 3, top + 5, left + box_w + 3, top + box_h + 5), (220, 210, 196), (220, 210, 196), width=1, radius=30)
        rounded(draw, box, fill, INK, width=3, radius=30)

        badge_r = 18
        bx, by = left + 28, top + 28
        draw.ellipse((bx - badge_r, by - badge_r, bx + badge_r, by + badge_r), fill=INK)
        num = str(i + 1)
        tw = draw.textlength(num, font=num_f)
        draw.text((bx - tw / 2, by - 14), num, font=num_f, fill=(255, 255, 255))

        title = node["title"]
        subtitle = node.get("sub", "")
        tlines = wrap(draw, title, body_f, box_w - 70)
        slines = wrap(draw, subtitle, sub_f, box_w - 48) if subtitle else []
        ty = top + 24
        for line in tlines[:2]:
            draw.text((left + 54, ty), line, font=body_f, fill=INK)
            ty += 36
        ty += 4
        for line in slines[:2]:
            draw.text((left + 24, ty), line, font=sub_f, fill=MUTED)
            ty += 28

    # top chapter label
    ch = spec.get("chapter_label", "")
    if ch:
        draw.text((48, 28), ch, font=title_f, fill=INK)

    # banner
    banner = spec["banner"]
    bw = int(draw.textlength(banner, font=banner_f)) + 80
    bh = 64
    bx0 = (WIDTH - bw) // 2
    by0 = HEIGHT - 110
    # ribbon notches
    pts = [
        (bx0 + 18, by0),
        (bx0 + bw - 18, by0),
        (bx0 + bw, by0 + bh / 2),
        (bx0 + bw - 18, by0 + bh),
        (bx0 + 18, by0 + bh),
        (bx0, by0 + bh / 2),
    ]
    draw.polygon(pts, fill=(36, 32, 30), outline=INK)
    draw.text((bx0 + 40, by0 + 14), banner, font=banner_f, fill=(252, 248, 236))

    cap = spec.get("caption")
    if cap:
        draw.text((48, HEIGHT - 36), cap, font=cap_f, fill=MUTED)

    dest.parent.mkdir(parents=True, exist_ok=True)
    rgb = img.convert("RGB")
    rgb.save(dest, "JPEG", quality=90, optimize=True)
    return dest


SPECS: dict[str, dict] = {
    "renwuzhi-01-jiuzheng": {
        "chapter_label": "人物志 · 九征 · 体别",
        "banner": "观人先察平淡，再求聪明",
        "caption": "对应：情性玄而有形质可求；九征皆至为纯粹，否则偏材 / 依似 / 间杂。",
        "nodes": [
            {"title": "观人察质", "sub": "有形质即可回推情性"},
            {"title": "先察平淡", "sub": "五味都能调，不是没味道"},
            {"title": "再求聪明", "sub": "阴阳清和才能两遂"},
            {"title": "九征尽至", "sub": "神精筋骨 · 气色仪容言"},
            {"title": "纯粹或偏杂", "sub": "中庸 / 依似 / 间杂；进德更偏"},
        ],
    },
    "renwuzhi-02-caili": {
        "chapter_label": "人物志 · 流业 · 材理",
        "banner": "人君主德平淡，达众材而不自任",
        "caption": "对应：十二流业以德法术为干；听言看七似六构，只会用自家尺度攻人即偏。",
        "nodes": [
            {"title": "三材主干", "sub": "德 / 法 / 术，不是道德排名"},
            {"title": "十二流业", "sub": "国体器能，再流臧否伎俩智意"},
            {"title": "人君平淡", "sub": "达众材而不自己揽事"},
            {"title": "四部四家", "sub": "道理义情叠九偏，各以心情为理"},
            {"title": "七似六构", "sub": "装懂与吵崩；通材兼八能"},
        ],
    },
    "renwuzhi-03-caineng": {
        "chapter_label": "人物志 · 材能 · 英雄",
        "banner": "能各有所宜；英分雄分相济",
        "caption": "对应：能大不能小是错名；兼材起名目，偏材只想被夸；一身兼有才能役英与雄。",
        "nodes": [
            {"title": "各有所宜", "sub": "宽弘宜郡国，急小宜百里"},
            {"title": "量能授官", "sub": "治反面会残、会暴、会空"},
            {"title": "君臣之能", "sub": "臣自任；君用人能听赏罚"},
            {"title": "接识同体", "sub": "自以为知人，其实只识同类"},
            {"title": "英分雄分", "sub": "互取一分，才能役英与雄"},
        ],
    },
    "renwuzhi-04-baguan": {
        "chapter_label": "人物志 · 八观",
        "banner": "先夺救，再感变，最后才给名号",
        "caption": "对应：八条可复查手续，不靠骨相。短是长的征；依似要问所由。",
        "nodes": [
            {"title": "夺救看间杂", "sub": "一种品质被夺、被救"},
            {"title": "感变看常度", "sub": "辞色是否跟得上话"},
            {"title": "志质看名号", "sub": "所至之质叠出名称"},
            {"title": "所由辨依似", "sub": "讦像直，宕像通，要问为什么"},
            {"title": "所短见所长", "sub": "有长必带那一短，有短未必有长"},
        ],
    },
    "renwuzhi-05-qimiu": {
        "chapter_label": "人物志 · 七缪",
        "banner": "知人者以目正耳，不知人者以耳败目",
        "caption": "对应：八观的七个坑。三周、心小志大、二尤最实用。",
        "nodes": [
            {"title": "以目正耳", "sub": "名声爱憎都会把眼睛带偏"},
            {"title": "三周肩称", "sub": "援、推、交游都能称，才算正直之交"},
            {"title": "心小志大", "sub": "小心防悔，志大任事，勿只壮志"},
            {"title": "同体相誉", "sub": "性同材倾则相援，势均则相害"},
            {"title": "二尤核实", "sub": "尤妙含于内，尤虚硕言瑰姿"},
        ],
    },
    "renwuzhi-06-shizheng": {
        "chapter_label": "人物志 · 效难 · 释争",
        "banner": "人难知；知了也难用上",
        "caption": "对应：效难二层收全书；释争以不伐、能让、急己宽人收束。",
        "nodes": [
            {"title": "难知之难", "sub": "草创信形，居止变化"},
            {"title": "得效之难", "sub": "不遇 / 不位 / 能识不肯荐"},
            {"title": "已试五视", "sub": "安、举、与、为、取，不是第一眼"},
            {"title": "争途不可由", "sub": "好胜把让当成辱"},
            {"title": "三等收束", "sub": "不伐、能让、急己宽人"},
        ],
    },
    "bingjian": {
        "chapter_label": "冰鉴 · 曾国藩",
        "banner": "文人先观神骨，口诀只是总诀",
        "caption": "对应：先神骨，再刚柔，然后容貌情态须眉声音气色。术数文献，不是医学。",
        "nodes": [
            {"title": "口诀总纲", "sub": "邪正耳鼻，真假嘴唇，条理在语言"},
            {"title": "第一神骨", "sub": "神聚两目，骨聚面部；清浊易、邪正难"},
            {"title": "第二刚柔", "sub": "先天种子：外五行，内喜怒跳伏"},
            {"title": "容貌与情态", "sub": "容贵整；情态是神之余"},
            {"title": "须眉声气色", "sub": "眉早成须晚运；气色如运"},
        ],
    },
    "mayi-01-shiguan": {
        "chapter_label": "麻衣神相 · 相说与十观",
        "banner": "先骨格，次五行，再按十观总断",
        "caption": "对应：十观是分论。术数文献，不是医学，不能当诊断。",
        "nodes": [
            {"title": "先观骨格", "sub": "部位流年而推的底子"},
            {"title": "次看五行", "sub": "形局正局，合则富贵反则薄"},
            {"title": "威仪精神", "sub": "不怒而威；久坐不昧"},
            {"title": "清浊头面", "sub": "清贵浊厚；头为一身之主"},
            {"title": "官成府就", "sub": "五官六府腰背手足声音心田"},
        ],
    },
    "mayi-02-qianliugong": {
        "chapter_label": "麻衣神相 · 前六宫",
        "banner": "十二宫先走前六：命迁官财福夫",
        "caption": "对应：五法气色之后入宫位。后六宫另章。术数文献，不是医学。",
        "nodes": [
            {"title": "五法切相", "sub": "看神看气看色，再入宫位"},
            {"title": "命宫印堂", "sub": "一部之主，宜明润"},
            {"title": "迁移官禄", "sub": "边地山林；正面官禄"},
            {"title": "财帛福德", "sub": "鼻为财帛；眉尾上方福德"},
            {"title": "夫妻宫", "sub": "前六宫收束，后六宫另章"},
        ],
    },
    "mayi-03-houliugong": {
        "chapter_label": "麻衣神相 · 后六宫",
        "banner": "后六宫：兄弟子女交友田宅父母疾厄",
        "caption": "对应：前六宫已见上章。命宫迁移重出只作异文附录。术数文献，不是医学。",
        "nodes": [
            {"title": "兄弟宫", "sub": "在两眉"},
            {"title": "子女交友", "sub": "泪堂卧蚕；两腮交友"},
            {"title": "田宅宫", "sub": "上眼睑"},
            {"title": "父母宫", "sub": "日月角"},
            {"title": "疾厄宫", "sub": "山根；异文附录勿混正稿"},
        ],
    },
    "yuancai": {
        "chapter_label": "原才 · 曾国藩",
        "banner": "风俗起于一二人之心向",
        "caption": "对应：向义则赴义，向利则赴利；人才从习尚里蒸出来。不是相面。",
        "nodes": [
            {"title": "一二人心向", "sub": "向义或向利"},
            {"title": "口说声气", "sub": "腾为议论，播为声气"},
            {"title": "习尚风俗", "sub": "始微终不可御"},
            {"title": "徒党人才", "sub": "死生以之，从习尚里蒸出"},
            {"title": "在位者职责", "sub": "转移习俗，陶铸一世；勿曰无才"},
        ],
    },
    "taiqing-01-xu-gejue": {
        "chapter_label": "太清神鉴 · 序与卷一歌诀",
        "banner": "说歌总纲：造化 → 骨格 → 气色五行 → 清浊",
        "caption": "对应：形→性→心→道。术数文献，不是医学。",
        "nodes": [
            {"title": "序：形性心道", "sub": "观形则善恶分，识性则吉凶显"},
            {"title": "说歌总纲", "sub": "五岳四渎、五行、气色、清浊三停"},
            {"title": "又歌散条", "sub": "骨肉清浊，部位吉凶口诀"},
            {"title": "神秘论次第", "sub": "神气形骨色，油清灯明"},
            {"title": "成和子", "sub": "五来、三主、十二宫，探到卷二"},
        ],
    },
    "taiqing-02-zhongyang": {
        "chapter_label": "太清神鉴 · 中央直下十三位",
        "banner": "大贵先看声神气，再走中央十三位",
        "caption": "对应：气色是枝叶，形体身骨是根本。术数文献，不是医学。",
        "nodes": [
            {"title": "声神气为先", "sub": "形骨其次；气色是枝叶"},
            {"title": "一百二十部", "sub": "一张脸先立总盘"},
            {"title": "上停初年", "sub": "天中天庭司空中正印堂"},
            {"title": "中停中年", "sub": "山根年上寿上准头"},
            {"title": "下停晚年", "sub": "人中正口承浆地阁"},
        ],
    },
    "taiqing-03-henglie-shang": {
        "chapter_label": "太清神鉴 · 天中至印堂横列",
        "banner": "中线上半向两边展开",
        "caption": "对应：天中、天庭、司空、中正、印堂各一横列。术数文献，不是医学。",
        "nodes": [
            {"title": "天中横列", "sub": "八位，骨起平满缺陷"},
            {"title": "天庭横列", "sub": "八位，官禄刑厄"},
            {"title": "司空横列", "sub": "八位，色泽黑痣"},
            {"title": "中正横列", "sub": "九位，父母交友"},
            {"title": "印堂横列", "sub": "八位，下接山根横列"},
        ],
    },
    "taiqing-04-henglie-xia": {
        "chapter_label": "太清神鉴 · 山根至地角横列",
        "banner": "面中以下八条横列按部位摊开",
        "caption": "对应：山根年上寿上准头人中正口承浆地角。术数文献，不是医学。",
        "nodes": [
            {"title": "山根年上", "sub": "十位 + 十位"},
            {"title": "寿上准头", "sub": "十位 + 八位"},
            {"title": "人中正口", "sub": "各八位"},
            {"title": "承浆地角", "sub": "六位 + 七位"},
            {"title": "先位后色", "sub": "平满缺陷骨起，再看气色黑痣"},
        ],
    },
    "taiqing-05-wuyue-xuetang": {
        "chapter_label": "太清神鉴 · 五岳四渎学堂",
        "banner": "横列点收成总法：二仪五岳四渎五官六府",
        "caption": "对应：再配五行生克，落到四堂学位与三辅学堂。术数文献，不是医学。",
        "nodes": [
            {"title": "二仪", "sub": "头天颏地，天庭地角相朝"},
            {"title": "五岳四渎", "sub": "额衡颏恒鼻嵩；耳江目淮口河鼻济"},
            {"title": "五官六府", "sub": "官成府就"},
            {"title": "五行生克", "sub": "五脏所出，比和则吉"},
            {"title": "学堂三辅", "sub": "四堂学位，上中下三辅"},
        ],
    },
    "taiqing-06-shenqi": {
        "chapter_label": "太清神鉴 · 心术神气",
        "banner": "德在形先；神见于眉目，气发颜表",
        "caption": "对应：心术七取七不取。死生论借神昏乱浮杂，不是寿命预测。术数文献，不是医学。",
        "nodes": [
            {"title": "心术七取", "sub": "七可取、七不可取"},
            {"title": "德在形先", "sub": "先论心术，再论形貌"},
            {"title": "神见于眉目", "sub": "古清藏媚；神有余 / 不足"},
            {"title": "气发颜表", "sub": "气充形，形安气"},
            {"title": "六气歌诀", "sub": "青龙朱雀勾陈螣蛇白虎玄武"},
        ],
    },
    "taiqing-07-qise": {
        "chapter_label": "太清神鉴 · 气色吉凶",
        "banner": "侵晨帷幄看本脏清气，浮暴之气不算",
        "caption": "对应：五色正者如瓜蜡火脂漆。术数文献，不是医学。",
        "nodes": [
            {"title": "气色法诀", "sub": "侵晨看，酒怒汗后不算"},
            {"title": "五色形状", "sub": "肾黑心赤肝青肺白脾黄"},
            {"title": "六神气色", "sub": "龙雀蛇陈虎武"},
            {"title": "四时出没", "sub": "青黄赤白黑紫依部应期"},
            {"title": "吉凶歌诀", "sub": "各色歌与十天罗"},
        ],
    },
    "taiqing-08-xingshen": {
        "chapter_label": "太清神鉴 · 形神体象",
        "banner": "宁可神足形不足，不可形足神不足",
        "caption": "对应：神须形安，形须神运。术数文献，不是医学。",
        "nodes": [
            {"title": "形神相资", "sub": "神须形才能安，形须神才能运"},
            {"title": "五行正类", "sub": "阴阳刚柔，木金水火土"},
            {"title": "禽兽诸形", "sub": "类物性，不是动物学"},
            {"title": "五短五长", "sub": "头面身手足是否一齐"},
            {"title": "声行坐卧", "sub": "再辅以饮食起居"},
        ],
    },
    "taiqing-09-guti": {
        "chapter_label": "太清神鉴 · 额眉眼骨肉",
        "banner": "肉要坚实，骨要直耸；眼为木星所以生神",
        "caption": "对应：卷五从骨肉到额枕三停眉眼腰背手足。术数文献，不是医学。",
        "nodes": [
            {"title": "骨肉总法", "sub": "肥不欲纹满，瘦不欲骨露"},
            {"title": "额头枕", "sub": "额分贵贱，枕骨各有名目"},
            {"title": "面三停", "sub": "上中下停要相称"},
            {"title": "眉眼", "sub": "眉主贤愚兼兄弟；眼所以生神"},
            {"title": "腰背手足", "sub": "腹脐掌纹爪，黑痣不能当体检"},
        ],
    },
    "taiqing-10-geju": {
        "chapter_label": "太清神鉴 · 格局与女相",
        "banner": "部位收成格局；女相体柔用弱为正",
        "caption": "对应：黑痣显处多凶隐处多吉。术数文献，不是医学。",
        "nodes": [
            {"title": "黑痣总例", "sub": "显处多凶，隐处多吉"},
            {"title": "男儿诸格", "sub": "贵格两府两制正郎豪富"},
            {"title": "三停五大八小", "sub": "四相不露，六贱六极六恶"},
            {"title": "女相九善九恶", "sub": "体柔用弱为正"},
            {"title": "贵贤与贱恶", "sub": "部位与男相同，条目另开"},
        ],
    },
}


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("slug", nargs="?")
    parser.add_argument("--all", action="store_true")
    args = parser.parse_args()
    slugs = list(SPECS) if args.all else [args.slug]
    if not slugs or slugs == [None]:
        raise SystemExit("usage: render-xuanxue-relation.py <slug> | --all")
    for slug in slugs:
        spec = SPECS.get(slug)
        if not spec:
            raise SystemExit(f"no spec for {slug}")
        dest = OUT_DIR / f"inline-xuanxue-relation-{slug}.jpg"
        path = render(spec, dest)
        print(path, path.stat().st_size)


if __name__ == "__main__":
    main()
