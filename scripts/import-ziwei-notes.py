#!/usr/bin/env python3
"""Import 紫微阅读版 into encrypted xuanxue vault notes."""

from __future__ import annotations

import re
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = Path("/tmp/ziwei-unpack/紫薇/阅读版")
IMG_SRC = SRC / "images"
MEDIA = ROOT / "public" / "notes-media"
NOTES = ROOT / "src" / "content" / "notes" / "xuanxue"

IMG_RENAME = {
    "01-three-systems.png": "inline-xuanxue-ziwei-01-three-systems.jpg",
    "02-study-loop.png": "inline-xuanxue-ziwei-02-study-loop.jpg",
    "03-twelve-palaces.png": "inline-xuanxue-ziwei-03-twelve-palaces.jpg",
    "04-fourteen-stars.png": "inline-xuanxue-ziwei-04-fourteen-stars.jpg",
    "05-sihua.png": "inline-xuanxue-ziwei-05-sihua.jpg",
    "06-taiwai-core.png": "inline-xuanxue-ziwei-06-taiwai-core.jpg",
    "07-taiwai-koujue.png": "inline-xuanxue-ziwei-07-taiwai-koujue.jpg",
    "08-an-shen-ming.png": "inline-xuanxue-ziwei-08-an-shen-ming.jpg",
    "09-an-ziwei-tianfu.png": "inline-xuanxue-ziwei-09-an-ziwei-tianfu.jpg",
    "10-sihua-tiangan.png": "inline-xuanxue-ziwei-10-sihua-tiangan.jpg",
    "11-ben-dui-he-lin.png": "inline-xuanxue-ziwei-11-ben-dui-he-lin.jpg",
    "12-nv-ming-gusui.png": "inline-xuanxue-ziwei-12-nv-ming-gusui.jpg",
    "13-yangtuo-huoling.png": "inline-xuanxue-ziwei-13-yangtuo-huoling.jpg",
    "14-dui-gong.png": "inline-xuanxue-ziwei-14-dui-gong.jpg",
    "15-sanfang-sizheng.png": "inline-xuanxue-ziwei-15-sanfang-sizheng.jpg",
    "16-an-fusha.png": "inline-xuanxue-ziwei-16-an-fusha.jpg",
    "17-wuxing-ju.png": "inline-xuanxue-ziwei-17-wuxing-ju.jpg",
    "18-daxian.png": "inline-xuanxue-ziwei-18-daxian.jpg",
    "19-miaowangxian.png": "inline-xuanxue-ziwei-19-miaowangxian.jpg",
}


def convert_images() -> None:
    MEDIA.mkdir(parents=True, exist_ok=True)
    for src_name, dest_name in IMG_RENAME.items():
        src = IMG_SRC / src_name
        dest = MEDIA / dest_name
        im = Image.open(src).convert("RGB")
        im.save(dest, "JPEG", quality=86, optimize=True)
        print(f"img {dest_name} {dest.stat().st_size}")


def cover_from(inline_name: str, cover_name: str) -> str:
    src = MEDIA / inline_name
    dest = MEDIA / cover_name
    dest.write_bytes(src.read_bytes())
    return f"/notes-media/{cover_name}"


def list_md(folder: Path, skip: frozenset[str] | None = None) -> list[Path]:
    skip = skip or frozenset()
    files = [p for p in folder.rglob("*.md") if p.name not in skip]
    return sorted(files, key=lambda p: str(p).replace("宫_", "宫0_"))


def rewrite_body(text: str) -> str:
    text = re.sub(r"^# .+\n+", "", text, count=1)
    text = re.sub(
        r"\]\((?:\.\./)*images/([^)]+)\)",
        lambda m: f"](/notes-media/{IMG_RENAME[m.group(1)]})",
        text,
    )
    text = re.sub(r"\*\*白话\*\*(?![：:])", "**白话：**", text)
    text = re.sub(r"^## 白话\s*$", "**白话：**", text, flags=re.M)
    text = re.sub(r"\[([^\]]+)\]\([^)]+\.md[^)]*\)", r"**\1**", text)
    text = re.sub(
        r"\[([^\]]+)\]\([^)]+\.pdf[^)]*\)",
        r"\1（扫描本留在原压缩包，体积过大未进仓库）",
        text,
    )
    return text.strip()


def assemble(files: list[Path]) -> str:
    parts: list[str] = []
    for path in files:
        raw = path.read_text(encoding="utf-8")
        body = rewrite_body(raw)
        if not body:
            continue
        rel = path.relative_to(SRC)
        parts.append(f"### {path.stem}\n\n{body}")
    return "\n\n".join(parts)


def frontmatter(
    *,
    title: str,
    description: str,
    chapter: int,
    difficulty: str,
    concepts: list[str],
    cover: str,
    related: list[str],
) -> str:
    concepts_yaml = "\n".join(f"  - {c}" for c in concepts)
    related_yaml = "\n".join(f"  - {r}" for r in related)
    return f"""---
title: {title}
description: {description}
subject: xuanxue
chapter: {chapter}
order: {chapter}
status: draft
difficulty: {difficulty}
concepts:
{concepts_yaml}
cover: {cover}
related:
{related_yaml}
updatedDate: 2026-08-31
---
"""


def write_note(slug: str, head: str, yao: str, diben: str, body: str) -> None:
    if "**白话：**" not in body:
        body += "\n\n**白话：** 本章是术数文献，不是医学，也不能当命运证明。排盘软件只当计算器。\n"
    text = (
        head
        + "\n"
        + yao.rstrip()
        + "\n\n## 底本\n\n"
        + diben.rstrip()
        + "\n\n## 对读\n\n"
        + body.rstrip()
        + "\n"
    )
    dest = NOTES / f"{slug}.md"
    dest.write_text(text, encoding="utf-8")
    print(f"note {slug} {dest.stat().st_size}")


def main() -> None:
    convert_images()
    skip_meta = frozenset({"README.md", "00_目录.md", "_写作规范.md", "_图片审核.md"})

    juan1_shang = [
        SRC / "01_全书/卷一/01_罗序.md",
        SRC / "01_全书/卷一/02_太微赋.md",
        SRC / "01_全书/卷一/03_太微赋_例曰.md",
        SRC / "01_全书/卷一/04_形性赋.md",
        SRC / "01_全书/卷一/05_星垣论.md",
        SRC / "01_全书/卷一/06_斗数准绳.md",
        SRC / "01_全书/卷一/07_斗数发微论.md",
        SRC / "01_全书/卷一/08_重补斗数彀率.md",
        SRC / "01_全书/卷一/09_增补太微赋.md",
    ]
    zhuxing = [SRC / "01_全书/卷一/10_诸星问答/README.md"] + sorted(
        (SRC / "01_全书/卷一/10_诸星问答").glob("[0-9]*.md")
    )
    gejue = [
        SRC / "01_全书/卷一/11_斗数骨髓赋.md",
        SRC / "01_全书/卷一/11b_斗数骨髓赋_下.md",
        SRC / "01_全书/卷一/12_女命骨髓赋.md",
        SRC / "01_全书/卷一/13_定富贵贫贱十等论.md",
        SRC / "01_全书/卷一/14_十二宫得地失陷诀.md",
        SRC / "01_全书/卷一/15_定富贵贫杂局.md",
    ]
    anxing = sorted((SRC / "01_全书/卷二").glob("[0-9]*.md")) + sorted(
        (SRC / "01_全书/卷二").glob("安*")
    )
    # 卷二 numbered files only
    anxing = [
        p
        for p in sorted((SRC / "01_全书/卷二").iterdir())
        if p.suffix == ".md" and not p.name.startswith("宫_") and p.name != "00_目录.md"
    ]
    gong = sorted((SRC / "01_全书/卷二").glob("宫_*.md"))
    juan3 = list_md(SRC / "01_全书/卷三", skip_meta)
    fu = list_md(SRC / "02_赋诀", skip_meta)
    feixing = list_md(SRC / "03_十八飞星", skip_meta)
    qizheng = list_md(SRC / "04_七政", skip_meta)

    write_note(
        "ziwei-00-path",
        frontmatter(
            title="紫微斗数：学习路径",
            description="先分清正统十四主星、十八飞星与七政四余。入门只走排盘、全书三卷、赋诀，不交叉记。",
            chapter=22,
            difficulty="入门",
            concepts=["紫微斗数", "十四主星", "十二宫", "四化", "十八飞星", "七政四余"],
            cover=cover_from("inline-xuanxue-ziwei-02-study-loop.jpg", "xuanxue-ziwei-00.jpg"),
            related=["xuanxue/ziwei-01-juan1", "xuanxue/ziwei-18-feixing", "xuanxue/ziwei-04-qizheng"],
        ),
        """## 本章要义

先分清三套东西，再谈进度。今天口语里的「紫微」，指的是《紫微斗数全书》这一套：**十四主星 + 十二宫 + 禄权科忌四化**。另有一套古本也叫紫微斗数，主星是天虚、天贵、天印，安星法不同，阅读版放在十八飞星，入门不要对号入座。七政四余看天上真实的日月五星，不是斗数排盘。

正统的读法是五步：先能排出一本盘，再读卷一立法、卷二对宫、卷三行运，赋诀用来背。排盘软件只当计算器，对错拿卷二「安身命例」核对。今人注本有版权，也不和《全书》混成一套课本。

本章**入门**。这是术数文献，不是医学，也不能当命运证明。""",
        "阅读版 `00_学习路径.md`。源文件：维基文库公版《紫微斗数全书》、《youngzs/xuanxue》赋诀整理、互联网档案馆扫描。仅供个人阅读研究。",
        assemble([SRC / "00_学习路径.md"]),
    )

    write_note(
        "ziwei-01-juan1",
        frontmatter(
            title="紫微斗数全书：卷一 · 立法",
            description="罗序、太微赋、形性赋、星垣论、准绳、发微论、彀率与增补太微赋。卷一是星性、庙旺与格局的尺子。",
            chapter=23,
            difficulty="进阶",
            concepts=["太微赋", "形性赋", "星垣论", "斗数发微", "庙旺", "三方四正"],
            cover=cover_from("inline-xuanxue-ziwei-06-taiwai-core.jpg", "xuanxue-ziwei-01.jpg"),
            related=["xuanxue/ziwei-00-path", "xuanxue/ziwei-01-zhuxing", "xuanxue/ziwei-02-fu"],
        ),
        """## 本章要义

卷一是立法，不是马上批流年。身命为福德之本；星入庙为奇、失度为虚。太微赋先读总纲，再读「例曰」口诀。形性赋讲星的形貌性情，星垣论把十二支和星对上，准绳与发微论收成看盘总法：四正、三方、对合。彀率、增补太微赋和太微赋互参，不要另立一套口诀。

诸星问答、骨髓赋在后面两章。本章**进阶**。术数文献，不是医学。""",
        "《紫微斗数全书》卷一。阅读版拆自维基文库公版；口诀以全书为准。",
        assemble(juan1_shang),
    )

    write_note(
        "ziwei-01-zhuxing",
        frontmatter(
            title="紫微斗数全书：诸星问答",
            description="十四主星、辅煞与禄权科忌各问。四化口诀以本篇问答为准，不要用坊间另一套表替换。",
            chapter=24,
            difficulty="进阶",
            concepts=["紫微", "天府", "化禄", "化权", "化科", "化忌", "擎羊", "陀罗"],
            cover=cover_from("inline-xuanxue-ziwei-04-fourteen-stars.jpg", "xuanxue-ziwei-01-zhuxing.jpg"),
            related=["xuanxue/ziwei-01-juan1", "xuanxue/ziwei-01-gejue", "xuanxue/ziwei-02-anxing"],
        ),
        """## 本章要义

诸星问答是一星一篇的设问体。先认十四主星：北斗武曲廉贞贪狼巨门破军，中天紫微太阳太阴，南斗天机天同天府天相天梁七杀。禄存、昌曲、辅弼、魁钺是辅星，不入这十四颗。四化（禄权科忌）以这些问答为准，甲廉破武阳那一套口诀在卷二还要再对一遍。

羊陀火铃另有总论，不要和主星混成「十八颗主星」。本章**进阶**。术数文献，不是医学。""",
        "《紫微斗数全书》卷一「诸星问答论」。阅读版一星一篇。",
        assemble(zhuxing),
    )

    write_note(
        "ziwei-01-gejue",
        frontmatter(
            title="紫微斗数全书：骨髓赋与诸局",
            description="斗数骨髓赋上下、女命骨髓赋、富贵贫贱十等与十二宫得地失陷。格局口诀，不是现代格局名词表。",
            chapter=25,
            difficulty="艰深",
            concepts=["斗数骨髓赋", "女命骨髓赋", "得地", "失陷", "格局"],
            cover=cover_from("inline-xuanxue-ziwei-12-nv-ming-gusui.jpg", "xuanxue-ziwei-01-gejue.jpg"),
            related=["xuanxue/ziwei-01-zhuxing", "xuanxue/ziwei-02-shiergong", "xuanxue/ziwei-02-fu"],
        ),
        """## 本章要义

骨髓赋是格局口诀：夹、会、忌格、总戒。女命另有专赋，三方四正嫌逢杀、更在夫宫祸患深。十等论、得地失陷诀、富贵贫杂局是把「这盘够不够格」收成条文。不要先背现代书里的格局名单来套古诀。

近人注本在赋诀单篇里，只当讲解。本章**艰深**。术数文献，不是医学，也不能当婚育证明。""",
        "《紫微斗数全书》卷一骨髓赋至定局。阅读版拆页。",
        assemble(gejue),
    )

    write_note(
        "ziwei-02-anxing",
        frontmatter(
            title="紫微斗数全书：卷二 · 安星",
            description="安命身、安南北斗、辅煞、四化、杂曜与五行局。排盘对错用安身命例核对。",
            chapter=26,
            difficulty="进阶",
            concepts=["命宫", "身宫", "五行局", "安紫微", "安天府", "辅星", "煞星"],
            cover=cover_from("inline-xuanxue-ziwei-08-an-shen-ming.jpg", "xuanxue-ziwei-02-anxing.jpg"),
            related=["xuanxue/ziwei-00-path", "xuanxue/ziwei-01-zhuxing", "xuanxue/ziwei-02-shiergong"],
        ),
        """## 本章要义

卷二先学会把星安上：寅上起正月，逆时安命、顺时安身；定五行局（水二木三金四土五火六）再起紫微、天府，带出其余主星；时辰安昌曲、月份安辅弼、年干安魁钺禄存、年支安天马；羊陀火铃另诀。四化按年干，甲廉破武阳……癸破巨阴贪。

盘图、ASCII 排盘是核对用的，不是现代软件截图。本章**进阶**。术数文献，不是医学。""",
        "《紫微斗数全书》卷二安身命例至五行局、庙旺。阅读版拆页。",
        assemble(anxing),
    )

    write_note(
        "ziwei-02-shiergong",
        frontmatter(
            title="紫微斗数全书：卷二 · 十二宫",
            description="命、兄弟、妻妾、子女、财帛、疾厄、迁移、奴仆、官禄、田宅、福德、父母。同一颗星在不同宫断法不同。",
            chapter=27,
            difficulty="艰深",
            concepts=["命宫", "财帛", "官禄", "妻妾", "奴仆", "福德", "对宫"],
            cover=cover_from("inline-xuanxue-ziwei-03-twelve-palaces.jpg", "xuanxue-ziwei-02-shiergong.jpg"),
            related=["xuanxue/ziwei-02-anxing", "xuanxue/ziwei-03-xingyun", "xuanxue/ziwei-01-gejue"],
        ),
        """## 本章要义

十二宫用全书原名：命、兄弟、妻妾、子女、财帛、疾厄、迁移、奴仆、官禄、田宅、福德、父母。不要改成「交友／事业」。同一颗星落到命、财、官、妻妾，说法不一样。对宫是命—迁移、兄弟—奴仆、妻妾—官禄、子女—田宅、财帛—福德、疾厄—父母。三方四正以命、财帛、官禄、迁移为例。

本章**艰深**，要按宫对读，不能只记宫名。术数文献，不是医学。""",
        "《紫微斗数全书》卷二十二宫分论。阅读版一宫一篇（命宫有续篇）。",
        assemble(gong),
    )

    write_note(
        "ziwei-03-xingyun",
        frontmatter(
            title="紫微斗数全书：卷三 · 行运",
            description="入格、男女、小儿、大限流年、羊陀迭并与七杀重逢。本命看完再看限。",
            chapter=28,
            difficulty="艰深",
            concepts=["大限", "流年", "小限", "羊陀迭并", "七杀重逢", "岁限"],
            cover=cover_from("inline-xuanxue-ziwei-18-daxian.jpg", "xuanxue-ziwei-03.jpg"),
            related=["xuanxue/ziwei-02-shiergong", "xuanxue/ziwei-02-fu", "xuanxue/ziwei-00-path"],
        ),
        """## 本章要义

卷三是行运：本命看完再看限。大限口诀是阳男阴女从命前一宫起顺行（父母宫），阴男阳女从命后一宫起逆行（兄弟宫）；局数二至六岁起限。流年太岁、羊陀迭并、七杀重逢是「限上再逢凶」的断法，不要一上来就批流月流日。

本章**艰深**。术数文献，不是医学，也不能当寿命预测。""",
        "《紫微斗数全书》卷三。阅读版含岁限、诸星同垣。",
        assemble(juan3),
    )

    write_note(
        "ziwei-02-fu",
        frontmatter(
            title="紫微斗数：赋诀单篇",
            description="发微轮、骨髓赋近人注、观音经验谈、十喻歌等。口诀仍以全书为准，近人注只当讲解。",
            chapter=29,
            difficulty="进阶",
            concepts=["十喻歌", "斗数发微轮", "观音经验谈", "本对合邻"],
            cover=cover_from("inline-xuanxue-ziwei-11-ben-dui-he-lin.jpg", "xuanxue-ziwei-02-fu.jpg"),
            related=["xuanxue/ziwei-01-juan1", "xuanxue/ziwei-01-gejue", "xuanxue/ziwei-03-xingyun"],
        ),
        """## 本章要义

单篇是从全书抄出来方便背的。太微赋、骨髓赋、发微、彀率，全书里都有，**字句以全书为准**。《斗数骨髓赋》近人注本有当代用语，只帮助理解，不拿它改口诀。《观音经验谈》题作民国南北山人，不当口诀标准。十喻歌记本、对、合、邻。

本章**进阶**。术数文献，不是医学。""",
        "阅读版 `02_赋诀`。源出全书抽篇与 youngzs/xuanxue；近人注单独标明。",
        assemble(fu),
    )

    write_note(
        "ziwei-18-feixing",
        frontmatter(
            title="紫微斗数：十八飞星（另一体系）",
            description="清代以前另一套飞星斗数。星名天虚天贵天印等，与正统十四主星不同，入门不要交叉记。",
            chapter=30,
            difficulty="艰深",
            concepts=["十八飞星", "天虚", "天贵", "天印", "照胆经", "洞微"],
            cover=cover_from("inline-xuanxue-ziwei-01-three-systems.jpg", "xuanxue-ziwei-18.jpg"),
            related=["xuanxue/ziwei-00-path", "xuanxue/ziwei-04-qizheng", "xuanxue/ziwei-01-juan1"],
        ),
        """## 本章要义

这是**另一门课**。主星名单和安星法都与《紫微斗数全书》十四主星不同。入门阶段不要把天机和天虚对串，也不要用正统四化去套飞星盘。《康节说易全书》扫描是托名邵雍的汇编，只对照纸面，不当主课；扫描 PDF 体积过大，留在原压缩包，未进本仓库。

正统十四主星学稳后再读。本章**艰深**。术数文献，不是医学。""",
        "维基文库公版十八飞星本。阅读版按卷之一至卷之三拆页。扫描 PDF 见原 `紫薇.zip`。",
        assemble(feixing),
    )

    write_note(
        "ziwei-04-qizheng",
        frontmatter(
            title="七政四余（附录）",
            description="星平会海、星学大成残篇。看实际日月五星，不是斗数。学完正统再翻。",
            chapter=31,
            difficulty="进阶",
            concepts=["七政四余", "星学大成", "星平会海", "二十八宿"],
            cover=cover_from("inline-xuanxue-ziwei-01-three-systems.jpg", "xuanxue-ziwei-04-qizheng.jpg"),
            related=["xuanxue/ziwei-00-path", "xuanxue/ziwei-18-feixing"],
        ),
        """## 本章要义

七政四余看天上真实的日、月、五星和四余，是星命里的另一门，不是斗数排十二宫主星。仓库里的《星平会海》《星学大成》是残篇、篇目和杂诗，不是完本。学完正统紫微再当附录翻，不要和十四主星混记。

本章**进阶**。术数文献，不是医学。""",
        "阅读版 `04_七政`。youngzs/xuanxue 仓库本不完整，照录残篇并标明。",
        assemble(qizheng),
    )


if __name__ == "__main__":
    main()
