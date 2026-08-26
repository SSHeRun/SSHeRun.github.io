import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { CANONICAL_TAGS } from './lib/taxonomy';

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

export const collections = { blog };
