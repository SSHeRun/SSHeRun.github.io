import type { Locale } from '../i18n/config';

type Text = Record<Locale, string>;

export type StartPick = { key: string; note: Text };
export type ReadingPath = { id: string; color: string; title: Text; intro: Text; picks: StartPick[] };

/** 导读页「先读这三篇」 */
export const FIRST_READS: StartPick[] = [
	{
		key: 'hello-world',
		note: {
			'zh-CN': '这个站为什么长这样：同一份内容，人读 HTML，Agent 读 Markdown 和 llms.txt。',
			en: 'Why this site looks the way it does: humans read HTML, agents read Markdown and llms.txt.',
		},
	},
	{
		key: 'forceful-systems-fly-off-multi-agent-illusion',
		note: {
			'zh-CN': '最能代表本站立场的一篇：多 Agent 的价值在并行搜索与主脑收敛，不在角色扮演。',
			en: 'The post that best captures this blog’s stance: multi-agent value comes from parallel search and a converging lead, not role-play.',
		},
	},
	{
		key: 'ai-getting-good-at-math',
		note: {
			'zh-CN': '最长也最硬核的一篇分析：验证器决定 AI 能力的边界，失败清单是 harness 最值钱的资产。',
			en: 'The deepest analysis here: verifiers set the boundary of AI capability, and the failure log is a harness’s most valuable asset.',
		},
	},
];

export const READING_PATHS: ReadingPath[] = [
	{
		id: 'agent',
		color: '#0891b2',
		title: { 'zh-CN': '做 Agent 与 AI 工程', en: 'Building agents' },
		intro: {
			'zh-CN': '适合正在搭 Agent、写 Skill、设计多 Agent 协作的人。顺序从架构判断到知识工程。',
			en: 'For people building agents, writing Skills, or wiring up multi-agent systems. Ordered from architecture to knowledge engineering.',
		},
		picks: [
			{
				key: 'forceful-systems-fly-off-multi-agent-illusion',
				note: { 'zh-CN': '为什么「虚拟公司」式分工大多失败', en: 'Why “virtual company” role splits usually fail' },
			},
			{
				key: 'worse-together-multi-agent',
				note: { 'zh-CN': '共享资源时，协调者为何胜过点对点', en: 'Why a coordinator beats peer-to-peer on shared resources' },
			},
			{
				key: 'anthropic-skills-lessons',
				note: { 'zh-CN': 'Skill 是带脚本和数据的能力单元，不只是 Markdown', en: 'A Skill is a capability unit with scripts and data, not just Markdown' },
			},
			{
				key: 'kdc-knowledge-engineering-not-files',
				note: { 'zh-CN': '召回到材料 ≠ 获得知识：版本、证据与适用边界', en: 'Retrieval ≠ knowledge: versions, evidence, and scope' },
			},
		],
	},
	{
		id: 'product',
		color: '#7c3aed',
		title: { 'zh-CN': '做产品与创业', en: 'Product & startups' },
		intro: {
			'zh-CN': '适合产品经理和独立开发者：当构建变便宜，判断、取舍和获客才是真正的难点。',
			en: 'For PMs and indie builders: once building is cheap, judgment, trade-offs, and distribution become the hard part.',
		},
		picks: [
			{
				key: 'dual-entry-human-agent-design',
				note: { 'zh-CN': '同一套能力，给人一个入口、给 Agent 一个入口', en: 'One capability, one door for humans and one for agents' },
			},
			{
				key: 'taste-at-speed-pm-skill',
				note: { 'zh-CN': '快速评估、大量淘汰，只发布幸存者', en: 'Evaluate fast, kill most, ship the survivors' },
			},
			{
				key: 'first-principles-startup-review',
				note: { 'zh-CN': '让 AI 做第一性原理审查，48 小时推翻一份计划', en: 'An AI first-principles review that killed a plan in 48 hours' },
			},
			{
				key: 'indie-product-promotion-hard-truths',
				note: { 'zh-CN': '推广难往往不是缺渠道，而是信任与差异化', en: 'Growth is rarely about a secret channel; it is trust and differentiation' },
			},
		],
	},
	{
		id: 'career',
		color: '#db2777',
		title: { 'zh-CN': '职业与个人成长', en: 'Careers in the AI era' },
		intro: {
			'zh-CN': '适合担心被 AI 替代的工程师和管理者：写代码之外，剩下的才是这份工作的大头。',
			en: 'For engineers and managers worried about replacement: beyond writing code is where most of the job always was.',
		},
		picks: [
			{
				key: 'what-can-programmers-still-do',
				note: { 'zh-CN': 'AI 接走写代码之后，程序员还能做的五件事', en: 'Five things programmers still do once AI writes the code' },
			},
			{
				key: 'software-engineering-splits-three',
				note: { 'zh-CN': '软件工程正在分成三层，你在哪一层', en: 'Software engineering is splitting into three tiers' },
			},
			{
				key: 'ai-era-clarity-matters',
				note: { 'zh-CN': '把话说清楚，是让 AI 变成杠杆的前提', en: 'Saying it clearly is what turns AI into leverage' },
			},
			{
				key: 'ai-organization-redesign',
				note: { 'zh-CN': '员工变快了，公司为什么没变强', en: 'People got faster; why didn’t the company get stronger?' },
			},
		],
	},
	{
		id: 'model',
		color: '#d97706',
		title: { 'zh-CN': '看懂模型与 AI 搜索', en: 'Models & AI search' },
		intro: {
			'zh-CN': '适合想跟上模型能力边界、以及 AI 如何改变搜索与引用的人。',
			en: 'For readers tracking where model capability ends and how AI is reshaping search and citation.',
		},
		picks: [
			{
				key: 'ai-getting-good-at-math',
				note: { 'zh-CN': '人靠品味剪枝，AI 靠验证器剪枝', en: 'Humans prune with taste; AI prunes with verifiers' },
			},
			{
				key: 'deepseek-engram-conditional-memory',
				note: { 'zh-CN': '条件记忆：MoE 之外的另一条稀疏性轴', en: 'Conditional memory: a sparsity axis beyond MoE' },
			},
			{
				key: 'openai-alien-mind',
				note: { 'zh-CN': '对齐未解时，为什么不能全速扩模型', en: 'Why not to scale flat-out while alignment is unsolved' },
			},
			{
				key: 'geo-vs-seo-same-or-separate',
				note: { 'zh-CN': 'GEO 与 SEO：底座共享，目标分叉', en: 'GEO vs SEO: shared foundation, diverging goals' },
			},
		],
	},
];
