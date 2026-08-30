export type VaultNote = {
	id: string;
	subject: string;
	slug: string;
	title: string;
	description: string;
	chapter: number;
	order: number;
	status: 'draft' | 'reviewed';
	difficulty?: '入门' | '进阶' | '艰深';
	concepts: string[];
	cover: string;
	related: string[];
	updated?: string;
	markdown: string;
};

export type NotesGraphNode = {
	id: string;
	label: string;
	type: 'group' | 'subject' | 'chapter' | 'concept';
	url?: string;
	subject?: string;
	color?: string;
	weight?: number;
};

export type NotesGraphEdge = {
	source: string;
	target: string;
	type: 'belongs' | 'next' | 'related' | 'concept';
};

export type NotesGraphPayload = {
	nodes: NotesGraphNode[];
	edges: NotesGraphEdge[];
	stats: { subjects: number; chapters: number; concepts: number; edges: number };
};

export type VaultPayload = {
	subjects: Array<{
		id: string;
		label: string;
		group: string;
		groupLabel: string;
		description: string;
		order: number;
		color: string;
	}>;
	notes: VaultNote[];
	graph: NotesGraphPayload;
};

export type EncryptedBlob = {
	v: 1;
	kdf: 'pbkdf2-sha256';
	iter: number;
	salt: string;
	iv: string;
	tag: string;
	data: string;
};

export type VaultFile = { configured: false } | ({ configured: true } & EncryptedBlob);
