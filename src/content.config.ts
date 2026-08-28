import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { CANONICAL_TAGS } from './lib/taxonomy';
import { SUBJECT_IDS } from './lib/vault/subjects';

const tagEnum = z.enum(CANONICAL_TAGS as unknown as [string, ...string[]]);

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: image(),
			tags: z
				.array(tagEnum)
				.min(2, '至少 2 个标签')
				.max(4, '最多 4 个标签')
				.refine((tags) => new Set(tags).size === tags.length, '标签不能重复'),
			lang: z.enum(['zh', 'en']).default('zh'),
			translationKey: z.string().optional(),
		}),
});

const notes = defineCollection({
	loader: glob({ base: './src/content/notes', pattern: '**/*.md' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		subject: z
			.string()
			.refine((id) => SUBJECT_IDS.includes(id), '未知学科，先在 src/lib/vault/subjects.ts 登记'),
		chapter: z.number().int().positive(),
		order: z.number().int().nonnegative(),
		status: z.enum(['draft', 'reviewed']),
		concepts: z.array(z.string()).min(3, '至少 3 个概念，供 408 图谱使用'),
		cover: z.string().min(1, '每章需要封面图'),
		related: z.array(z.string()).default([]),
		updatedDate: z.coerce.date().optional(),
	}),
});

export const collections = { blog, notes };
