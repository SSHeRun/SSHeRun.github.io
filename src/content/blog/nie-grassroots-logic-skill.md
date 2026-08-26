---
title: '把《基层中国》蒸馏成 Agent Skill：求学考公投资都能问'
description: '开源项目 nie-grassroots-logic 把聂辉华《基层中国的运行逻辑》提炼成 Cursor/Codex 可调用的治理框架工具箱——不含原书全文，却能拆地方新闻与个人选择。'
pubDate: '2026-08-26'
heroImage: '../../assets/cover-nie-grassroots-logic-skill.jpg'
tags: ['Agent', 'Skills', '思考']
---

有人把聂辉华老师的《基层中国的运行逻辑》整本书，**蒸馏成了一个 Agent Skill**。

不是把 PDF 塞进上下文，而是把县乡村治理里那些反复出现的框架——**条块、含权量、双均衡、三座大山、土地财政闭环、政企四象限**——固化成可被 Cursor、Claude Code、Codex、Grok 反复调用的方法论工具箱。

[小众软件上的介绍](https://www.appinn.com/nie-grassroots-logic/)来自青小蛙，蚁工厂推荐；开源仓库是 [ayi-ai/nie-grassroots-logic](https://github.com/ayi-ai/nie-grassroots-logic)，GitHub 上已有五百多 star。

## 原书是什么

![基层治理框架分析](../../assets/inline-nie-grassroots-logic-skill-01.jpg)

《基层中国的运行逻辑》目前在售（ISBN 9787208197473，定价 69 元），作者聂辉华，豆瓣约 **7.7 分**——在「大家都不读书」的年代，这个分数不算低。

Skill **不含原书全文**。它提供的是分析语言，用来解释现象和做选择。

## Skill 能帮你干什么

![Skill 限定分析边界](../../assets/inline-nie-grassroots-logic-skill-03.jpg)

两类用法：

1. **拆新闻与权力结构**——为什么穷县还在拼命招商卖地？县委书记和省里副处长谁更「怕」谁？
2. **做个人选择**——求学、考公、投资、养老、创业、买房、孩子入学……问得越具体，回答越有用。

| 常见困惑 | Skill 怎么帮 |
|----------|----------------|
| 县里明明穷，为什么还在拼命招商、卖地、抢项目？ | 用「三座大山 + 土地财政闭环 + 等级制」拆动机 |
| 县委书记权力很大，怎么又怕省里一个副处长？ | 用「条块 + 等级资源分配」写清权界 |
| 乡镇和部委差在哪？街道值不值得去？ | 用「含权量三因子 + 城市等级」做路径对比 |
| 撤县设区了，房价/学区/编制会怎样？ | 用区划一页纸分「官 / 企 / 家」情景 |
| 企业拿补贴、推园区项目，怎么谈才不踩雷？ | 用「政企四象限 + 不完全契约 + 推项目路径」 |
| 问责这么严，基层还敢创新吗？ | 用「容错红黄绿边界」判断能不能推 |

## 举个例子：撤县设区

![县域决策与政策脉络](../../assets/inline-nie-grassroots-logic-skill-02.jpg)

青小蛙把 Skill 交给 Codex 做情景分析，输出很「工具箱」——不灌鸡汤，直接列机制：

1. **学区：** 行政区变化不等于立即共享主城区学位  
2. **编制：** 机构会调整，个人不会自动「升编」  

然后它会追问：具体是哪个县、何时获批、你最关心买房、孩子入学还是考公？有了这些，才能做当地版本的核实和情景判断。

学生/家长、找工作、创业、买房投资，甚至纯好奇一个问题——**都值得一问，而且越具体越好**。

## 为什么 Skill 比裸聊靠谱

通用 AI 聊天容易发散、套模板、编「听起来对」的体制叙事。

Skill 的价值在于**限定范围**：你必须用书里那套治理语言提问，模型也被引导在同一框架里推理。有边界，比无边界聊天更接近「可复用的分析」，而不是一次性爽文。

这和「5 分钟看电影」不一样——不是剧情摘要，而是**把书变成可调用的工具**。但原书要不要读？取决于你要的是「做判断」还是「吃透论证」；框架能借，细节和反例仍可能在书里。

## 怎么装

克隆仓库，放进你的 Agent Skills 目录，例如：

- `~/.cursor/skills/nie-grassroots-logic`
- `~/.codex/skills/nie-grassroots-logic`

然后像用其他 Skill 一样调用。项目本身开源，不含原书全文；想深入仍建议买正版书。

---

**相关：** 若你在搭自己的 Agent 工作流，「专著 → Skill」是一种值得抄的作业——把**可重复的判断框架**从长文本里抽出来，比每次粘贴大段 PDF 更省 Token、也更稳。

## 相关文章

- [[agent-skills-five-design-patterns|Agent Skills 五大设计模式]]
- [[anthropic-skills-lessons|Anthropic 内部数百个 Skills]]
- [[top-skill-yc-ceo-review|顶级 Skill 长什么样]]
- [[ai-multi-advisor-decision-system|多顾问决策架构]]
