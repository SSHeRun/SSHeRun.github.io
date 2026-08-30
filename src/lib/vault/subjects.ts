export type SubjectGroup = '408' | 'cs' | 'reading' | 'xuanxue';

export type Subject = {
	id: string;
	label: string;
	group: SubjectGroup;
	groupLabel: string;
	description: string;
	order: number;
	color: string;
};

export const SUBJECT_GROUPS: { id: SubjectGroup; label: string; order: number; color: string }[] = [
	{ id: '408', label: '考研 408', order: 1, color: '#0891b2' },
	{ id: 'cs', label: '计算机科学', order: 2, color: '#7c3aed' },
	{ id: 'reading', label: '读书笔记', order: 3, color: '#d97706' },
	{ id: 'xuanxue', label: '玄学', order: 4, color: '#6d28d9' },
];

/**
 * 可扩展学科登记表。新增一门课或一类读书笔记时：
 * 1. 在这里加一条记录
 * 2. 在 src/content/notes/{id}/ 下写章节 Markdown
 * 3. 不必改路由或加密逻辑
 */
export const SUBJECTS: Subject[] = [
	{
		id: 'ds',
		label: '数据结构',
		group: '408',
		groupLabel: '考研 408',
		description: '逻辑结构、存储结构与算法；线性表、栈队列、树、图、查找与排序。',
		order: 1,
		color: '#0891b2',
	},
	{
		id: 'co',
		label: '计算机组成原理',
		group: '408',
		groupLabel: '考研 408',
		description: '数据表示、运算器、存储器、指令系统、CPU、总线与 I/O。',
		order: 2,
		color: '#7c3aed',
	},
	{
		id: 'os',
		label: '操作系统',
		group: '408',
		groupLabel: '考研 408',
		description: '进程线程、调度死锁、内存与虚拟存储、文件与设备管理。',
		order: 3,
		color: '#0d9488',
	},
	{
		id: 'cn',
		label: '计算机网络',
		group: '408',
		groupLabel: '考研 408',
		description: '体系结构、物理层到应用层，以及 IP / TCP / HTTP 等核心协议。',
		order: 4,
		color: '#2563eb',
	},
	{
		id: 'db',
		label: '数据库',
		group: 'cs',
		groupLabel: '计算机科学',
		description: '关系模型、SQL、规范化、事务恢复与并发控制。',
		order: 5,
		color: '#c026d3',
	},
	{
		id: 'security',
		label: '信息安全',
		group: 'cs',
		groupLabel: '计算机科学',
		description: '密码学、对称/公钥体制、消息认证、数字签名与 PGP。',
		order: 6,
		color: '#dc2626',
	},
	{
		id: 'reading',
		label: '读书笔记',
		group: 'reading',
		groupLabel: '读书笔记',
		description: '预留：一本书一篇或按章节拆分，沿用同一套加密笔记结构。',
		order: 7,
		color: '#d97706',
	},
	{
		id: 'xuanxue',
		label: '玄学',
		group: 'xuanxue',
		groupLabel: '玄学',
		description: '命理、术数与传统宇宙观的个人笔记，不进公开博客。',
		order: 8,
		color: '#6d28d9',
	},
];

export const SUBJECT_IDS = SUBJECTS.map((subject) => subject.id);

export function getSubject(id: string): Subject | undefined {
	return SUBJECTS.find((subject) => subject.id === id);
}

export function notePath(subject: string, slug: string): string {
	return `/notes/${subject}/${slug}/`;
}

export function subjectPath(subject: string): string {
	return `/notes/${subject}/`;
}
