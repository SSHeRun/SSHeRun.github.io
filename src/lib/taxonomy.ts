/**
 * 博客受控标签词表。
 *
 * 原则：
 * - 每篇 2–4 个标签；主题群内复用，避免一篇一个新词
 * - 同义词合并（如 多Agent / 多智能体 / AI Agent → Agent）
 * - 不再默认打「AI」：几乎每篇都有，图谱会塌成一个星形枢纽
 */

export type TagCluster = {
	id: string;
	label: string;
	color: string;
	tags: readonly string[];
};

export const TAG_CLUSTERS: readonly TagCluster[] = [
	{
		id: 'agent',
		label: 'Agent 体系',
		color: '#0891b2',
		tags: ['Agent', 'Skills', 'Claude Code', 'OpenClaw'],
	},
	{
		id: 'product',
		label: '产品与设计',
		color: '#7c3aed',
		tags: ['产品', '设计', '组织'],
	},
	{
		id: 'career',
		label: '创业与职业',
		color: '#db2777',
		tags: ['创业', '职业', '思考'],
	},
	{
		id: 'engineering',
		label: '工程与工具',
		color: '#059669',
		tags: ['工程', '工具', '开源', '效率', '教程'],
	},
	{
		id: 'model',
		label: '模型研究',
		color: '#d97706',
		tags: ['LLM'],
	},
	{
		id: 'systems',
		label: '系统技术',
		color: '#64748b',
		tags: ['Windows'],
	},
] as const;

/** 标签之间的显式关系，构成图谱骨干 */
export const TAG_RELATIONS: readonly [string, string][] = [
	['Agent', 'Skills'],
	['Agent', 'OpenClaw'],
	['Agent', 'Claude Code'],
	['Skills', 'Claude Code'],
	['Agent', '工程'],
	['Agent', '产品'],
	['产品', '设计'],
	['产品', '组织'],
	['产品', '创业'],
	['组织', '职业'],
	['职业', '思考'],
	['职业', '工程'],
	['工程', '工具'],
	['工程', 'Claude Code'],
	['工具', '开源'],
	['工具', '教程'],
	['工具', '效率'],
	['教程', 'Windows'],
	['LLM', '工程'],
	['LLM', 'Agent'],
	['思考', '产品'],
	['效率', '组织'],
	['设计', '工程'],
];

export const CANONICAL_TAGS: readonly string[] = TAG_CLUSTERS.flatMap((c) => [...c.tags]);

const TAG_TO_CLUSTER = new Map<string, TagCluster>(
	TAG_CLUSTERS.flatMap((cluster) => cluster.tags.map((tag) => [tag, cluster] as const)),
);

export function getTagCluster(tag: string): TagCluster | undefined {
	return TAG_TO_CLUSTER.get(tag);
}

export function tagPath(tag: string): string {
	return `/tags/${encodeURIComponent(tag)}/`;
}

export function graphTagPath(tag: string): string {
	return `/graph?tag=${encodeURIComponent(tag)}`;
}

export function unknownTags(tags: string[]): string[] {
	return tags.filter((tag) => !TAG_TO_CLUSTER.has(tag));
}
