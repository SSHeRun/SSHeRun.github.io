#!/usr/bin/env node
/**
 * 校验加密笔记：学科已登记、封面存在、概念与互链完整。
 * Run: npm run verify:notes
 */

import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const NOTES_DIR = path.join(ROOT, 'src/content/notes');
const SUBJECTS_FILE = path.join(ROOT, 'src/lib/vault/subjects.ts');
const PUBLIC_DIR = path.join(ROOT, 'public');

const SUBJECT_RE = /^subject:\s*['"]?([\w-]+)['"]?\s*$/m;
const COVER_RE = /^cover:\s*['"]?([^'"\n]+)['"]?\s*$/m;
const CONCEPTS_RE = /^concepts:\s*\n([\s\S]*?)(?=^[a-zA-Z]+:|\n---)/m;
const RELATED_RE = /^related:\s*\n([\s\S]*?)(?=^[a-zA-Z]+:|\n---)/m;
const WIKILINK_RE = /\[\[([^\]|#]+)/g;

async function listMarkdown(dir) {
	const out = [];
	let entries = [];
	try {
		entries = await readdir(dir, { withFileTypes: true });
	} catch {
		return out;
	}
	for (const entry of entries) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) out.push(...(await listMarkdown(full)));
		else if (entry.name.endsWith('.md')) out.push(full);
	}
	return out;
}

function parseList(block) {
	if (!block) return [];
	return block
		.split('\n')
		.map((line) => line.trim())
		.filter((line) => line.startsWith('- '))
		.map((line) => line.slice(2).trim().replace(/^['"]|['"]$/g, ''));
}

async function loadSubjects() {
	const source = await readFile(SUBJECTS_FILE, 'utf8');
	const start = source.indexOf('export const SUBJECTS');
	const slice = start >= 0 ? source.slice(start) : source;
	const groupById = new Map();
	for (const match of slice.matchAll(/\{\s*id:\s*'([^']+)'[\s\S]*?group:\s*'([^']+)'/g)) {
		groupById.set(match[1], match[2]);
	}
	return groupById;
}

const files = await listMarkdown(NOTES_DIR);
const groupById = await loadSubjects();
const subjects = new Set(groupById.keys());
const errors = [];
const ids = new Set();

for (const file of files) {
	const rel = path.relative(NOTES_DIR, file).replace(/\\/g, '/');
	const id = rel.replace(/\.md$/, '');
	ids.add(id);
	const text = await readFile(file, 'utf8');
	const subject = text.match(SUBJECT_RE)?.[1];
	const cover = text.match(COVER_RE)?.[1];
	const concepts = parseList(text.match(CONCEPTS_RE)?.[1] ?? '');
	const related = parseList(text.match(RELATED_RE)?.[1] ?? '');
	const folder = rel.split('/')[0];
	const group = subject ? groupById.get(subject) : '';
	const examTrack = group === '408' || group === 'cs';

	if (!subject || !subjects.has(subject)) {
		errors.push(`${rel}: subject 未在 subjects.ts 登记`);
	}
	if (subject && folder !== subject) {
		errors.push(`${rel}: 目录 ${folder} 与 subject ${subject} 不一致`);
	}
	if (concepts.length < 3) {
		errors.push(`${rel}: concepts 少于 3 个`);
	}
	if (!cover) {
		errors.push(`${rel}: 缺 cover`);
	} else if (cover.startsWith('/')) {
		const asset = path.join(PUBLIC_DIR, cover.replace(/^\//, ''));
		try {
			const info = await stat(asset);
			if (info.size < 20_000) errors.push(`${rel}: 封面过小 ${cover}`);
		} catch {
			errors.push(`${rel}: 封面不存在 ${cover}`);
		}
	}
	if (!/##\s*本章要义/.test(text)) {
		errors.push(`${rel}: 缺少「本章要义」`);
	}
	if (group === 'xuanxue') {
		if (!/^difficulty:\s*(入门|进阶|艰深)\s*$/m.test(text)) {
			errors.push(`${rel}: 玄学笔记必须标注 difficulty（入门/进阶/艰深）`);
		}
		if (/##\s*白话译文/.test(text)) {
			errors.push(`${rel}: 玄学译文须按段落穿插，禁止整章「白话译文」殿后`);
		}
		if (!/\*\*白话：\*\*/.test(text)) {
			errors.push(`${rel}: 玄学正文缺少段落白话`);
		}
	}
	if (examTrack && !/##\s*源笔记勘误/.test(text)) {
		errors.push(`${rel}: 缺少「源笔记勘误」`);
	}
	if (examTrack && !/##\s*考研题精练/.test(text)) {
		errors.push(`${rel}: 缺少「考研题精练」`);
	}
	const body = text.replace(/^---[\s\S]*?---\n?/, '');
	if (examTrack && !/```mermaid/.test(body)) {
		errors.push(`${rel}: 正文缺少知识点图表（mermaid）`);
	}

	for (const link of related) {
		if (!ids.has(link) && !files.some((item) => path.relative(NOTES_DIR, item).replace(/\\/g, '/').replace(/\.md$/, '') === link)) {
			// 第二遍再查
		}
	}
}

for (const file of files) {
	const rel = path.relative(NOTES_DIR, file).replace(/\\/g, '/');
	const text = await readFile(file, 'utf8');
	const related = parseList(text.match(RELATED_RE)?.[1] ?? '');
	for (const link of related) {
		if (!ids.has(link)) errors.push(`${rel}: related 指向不存在的笔记 ${link}`);
	}
	const body = text.replace(/^---[\s\S]*?---\n?/, '');
	for (const match of body.matchAll(WIKILINK_RE)) {
		const target = match[1].trim();
		if (!target.includes('/')) continue;
		if (!ids.has(target)) errors.push(`${rel}: 文内链到不存在的笔记 ${target}`);
	}
}

if (errors.length) {
	console.error('verify:notes 失败\n' + errors.map((item) => `- ${item}`).join('\n'));
	process.exit(1);
}

console.log(`verify:notes 通过（${files.length} 章）`);
