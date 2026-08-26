#!/usr/bin/env node
/**
 * Verify blog posts have required images, tags, and graph links before deploy.
 * Run: npm run verify:blog
 */

import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BLOG_DIR = path.join(ROOT, 'src/content/blog');
const TAXONOMY_FILE = path.join(ROOT, 'src/lib/taxonomy.ts');
const MIN_COVER_BYTES = 80_000;

const HERO_RE = /^heroImage:\s*['"]?([^'"\n]+)['"]?\s*$/m;
const LANG_RE = /^lang:\s*['"]?(\w+)['"]?\s*$/m;
const TRANSLATION_KEY_RE = /^translationKey:\s*['"]?([^'"\n]+)['"]?\s*$/m;
const TAGS_RE = /^tags:\s*\[(.*?)\]\s*$/m;
const IMAGE_RE = /!\[[^\]]*\]\(([^)]+)\)/g;
const WIKILINK_RE = /\[\[([^\]|#]+)/g;

function slugFromFile(file) {
	return file.replace(/\.en\.md$/, '').replace(/\.md$/, '');
}

function resolveAsset(fromFile, assetPath) {
	const cleaned = assetPath.split('#')[0].split('?')[0];
	if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
		return null;
	}
	return path.normalize(path.resolve(path.dirname(fromFile), cleaned));
}

function parseTags(raw) {
	if (!raw) return null;
	return raw
		.split(',')
		.map((part) => part.trim().replace(/^['"]|['"]$/g, ''))
		.filter(Boolean);
}

async function loadCanonicalTags() {
	const source = await readFile(TAXONOMY_FILE, 'utf8');
	const tags = [...source.matchAll(/tags:\s*\[([^\]]+)\]/g)].flatMap((match) =>
		match[1]
			.split(',')
			.map((part) => part.trim().replace(/^['"]|['"]$/g, ''))
			.filter(Boolean),
	);
	return new Set(tags);
}

async function parsePost(filePath) {
	const rel = path.relative(BLOG_DIR, filePath);
	const text = await readFile(filePath, 'utf8');
	const heroMatch = text.match(HERO_RE);
	const langMatch = text.match(LANG_RE);
	const keyMatch = text.match(TRANSLATION_KEY_RE);
	const tagsMatch = text.match(TAGS_RE);

	const inlineImages = [];
	for (const match of text.matchAll(IMAGE_RE)) {
		inlineImages.push(match[1].trim());
	}

	const body = text.replace(/^---[\s\S]*?---\n?/, '');
	const wikilinks = [...body.matchAll(WIKILINK_RE)].map((match) => match[1].trim());
	const hasRelatedSection = /##\s*(相关文章|Related posts)\b/.test(body);

	return {
		rel,
		filePath,
		slug: slugFromFile(rel),
		lang: langMatch?.[1] ?? (rel.endsWith('.en.md') ? 'en' : 'zh'),
		translationKey: keyMatch?.[1] ?? slugFromFile(rel),
		heroImage: heroMatch?.[1]?.trim() ?? null,
		tags: parseTags(tagsMatch?.[1] ?? null),
		inlineImages,
		wikilinks,
		hasRelatedSection,
		mdMtime: (await stat(filePath)).mtimeMs,
	};
}

async function checkAsset(post, assetPath, label, errors, warnings) {
	if (!assetPath) {
		errors.push(`${post.rel}: missing ${label}`);
		return;
	}

	const resolved = resolveAsset(post.filePath, assetPath);
	if (!resolved) return;

	try {
		const info = await stat(resolved);
		if (!info.isFile()) {
			errors.push(`${post.rel}: ${label} is not a file (${assetPath})`);
			return;
		}

		if (label === 'heroImage' && info.size < MIN_COVER_BYTES) {
			warnings.push(
				`${post.rel}: heroImage looks too small (${info.size} bytes < ${MIN_COVER_BYTES}) — may be a placeholder`,
			);
		}

		if (label === 'heroImage' && info.mtimeMs < post.mdMtime - 1000) {
			warnings.push(
				`${post.rel}: heroImage is older than the post file — regenerate cover after editing frontmatter`,
			);
		}
	} catch {
		errors.push(`${post.rel}: ${label} file not found (${assetPath})`);
	}
}

function sameTags(a, b) {
	if (!a || !b) return false;
	if (a.length !== b.length) return false;
	const left = [...a].sort();
	const right = [...b].sort();
	return left.every((tag, index) => tag === right[index]);
}

async function main() {
	const canonical = await loadCanonicalTags();
	const files = (await readdir(BLOG_DIR))
		.filter((f) => f.endsWith('.md'))
		.map((f) => path.join(BLOG_DIR, f));

	const posts = await Promise.all(files.map(parsePost));
	const knownSlugs = new Set(posts.map((post) => post.translationKey));
	const errors = [];
	const warnings = [];

	for (const post of posts) {
		await checkAsset(post, post.heroImage, 'heroImage', errors, warnings);

		for (const img of post.inlineImages) {
			await checkAsset(post, img, `inline image ${img}`, errors, warnings);
		}

		if (!post.tags) {
			errors.push(`${post.rel}: missing tags (need 2–4 from controlled vocabulary)`);
		} else {
			if (post.tags.length < 2 || post.tags.length > 4) {
				errors.push(`${post.rel}: tags must be 2–4 items, got ${post.tags.length}`);
			}
			if (new Set(post.tags).size !== post.tags.length) {
				errors.push(`${post.rel}: duplicate tags`);
			}
			for (const tag of post.tags) {
				if (tag === 'AI') {
					errors.push(`${post.rel}: do not use tag "AI" — use Agent / LLM / 工程 instead`);
				} else if (!canonical.has(tag)) {
					errors.push(
						`${post.rel}: unknown tag "${tag}" — use only tags from src/lib/taxonomy.ts`,
					);
				}
			}
		}

		const validLinks = post.wikilinks.filter((target) => knownSlugs.has(target.replace(/\.en$/, '')));
		if (!post.hasRelatedSection && validLinks.length === 0) {
			errors.push(
				`${post.rel}: add "## 相关文章" / "## Related posts" with [[slug|title]] links (needed for knowledge graph)`,
			);
		} else if (post.hasRelatedSection && validLinks.length === 0) {
			warnings.push(`${post.rel}: related section exists but no valid [[slug]] targets resolved`);
		}
	}

	const byKey = new Map();
	for (const post of posts) {
		const key = post.translationKey;
		if (!byKey.has(key)) byKey.set(key, []);
		byKey.get(key).push(post);
	}

	for (const [key, group] of byKey) {
		const langs = new Set(group.map((p) => p.lang));
		if (!langs.has('zh') || !langs.has('en')) {
			warnings.push(`translationKey "${key}": missing ${langs.has('zh') ? 'en' : 'zh'} counterpart`);
		}

		const zh = group.find((p) => p.lang === 'zh' || p.lang === 'zh-CN');
		const en = group.find((p) => p.lang === 'en');
		if (zh?.tags && en?.tags && !sameTags(zh.tags, en.tags)) {
			errors.push(
				`translationKey "${key}": zh/en tags differ — keep the same Chinese vocabulary tags on both (${zh.tags.join(', ')} vs ${en.tags.join(', ')})`,
			);
		}

		for (const post of group) {
			if (!post.heroImage) continue;
			const expectedSuffix = post.lang === 'en' ? '-en.jpg' : '.jpg';
			if (!post.heroImage.includes(expectedSuffix) && post.lang === 'en') {
				warnings.push(`${post.rel}: English post heroImage should usually end with -en.jpg`);
			}
		}
	}

	if (warnings.length) {
		console.warn('\nWarnings:');
		for (const w of warnings) console.warn(`  ⚠ ${w}`);
	}

	if (errors.length) {
		console.error('\nErrors:');
		for (const e of errors) console.error(`  ✗ ${e}`);
		console.error(
			`\n${errors.length} error(s). Fix covers/tags/related links before deploy.\nCanonical tags: ${[...canonical].join(', ')}\n`,
		);
		process.exit(1);
	}

	console.log(`✓ Verified ${posts.length} blog posts (${byKey.size} translation groups)`);
	console.log(`  taxonomy: ${canonical.size} canonical tags`);
	if (warnings.length) {
		console.log(`  ${warnings.length} warning(s) — review before publishing`);
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
