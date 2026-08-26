#!/usr/bin/env node
/**
 * Verify blog posts have required images before deploy.
 * Run: npm run verify:blog
 */

import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BLOG_DIR = path.join(ROOT, 'src/content/blog');
const MIN_COVER_BYTES = 80_000;

const HERO_RE = /^heroImage:\s*['"]?([^'"\n]+)['"]?\s*$/m;
const LANG_RE = /^lang:\s*['"]?(\w+)['"]?\s*$/m;
const TRANSLATION_KEY_RE = /^translationKey:\s*['"]?([^'"\n]+)['"]?\s*$/m;
const IMAGE_RE = /!\[[^\]]*\]\(([^)]+)\)/g;

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

async function parsePost(filePath) {
	const rel = path.relative(BLOG_DIR, filePath);
	const text = await readFile(filePath, 'utf8');
	const heroMatch = text.match(HERO_RE);
	const langMatch = text.match(LANG_RE);
	const keyMatch = text.match(TRANSLATION_KEY_RE);

	const inlineImages = [];
	for (const match of text.matchAll(IMAGE_RE)) {
		inlineImages.push(match[1].trim());
	}

	return {
		rel,
		filePath,
		slug: slugFromFile(rel),
		lang: langMatch?.[1] ?? (rel.endsWith('.en.md') ? 'en' : 'zh'),
		translationKey: keyMatch?.[1] ?? slugFromFile(rel),
		heroImage: heroMatch?.[1]?.trim() ?? null,
		inlineImages,
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

async function main() {
	const files = (await readdir(BLOG_DIR))
		.filter((f) => f.endsWith('.md'))
		.map((f) => path.join(BLOG_DIR, f));

	const posts = await Promise.all(files.map(parsePost));
	const errors = [];
	const warnings = [];

	for (const post of posts) {
		await checkAsset(post, post.heroImage, 'heroImage', errors, warnings);

		for (const img of post.inlineImages) {
			await checkAsset(post, img, `inline image ${img}`, errors, warnings);
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
		console.error(`\n${errors.length} error(s). Run cover/inline image workflow before deploy.\n`);
		process.exit(1);
	}

	console.log(`✓ Verified ${posts.length} blog posts (${byKey.size} translation groups)`);
	if (warnings.length) {
		console.log(`  ${warnings.length} warning(s) — review before publishing`);
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
