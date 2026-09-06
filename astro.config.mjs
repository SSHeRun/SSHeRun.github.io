// @ts-check

import { unified } from '@astrojs/markdown-remark';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import mermaid from 'astro-mermaid';
import { defineConfig } from 'astro/config';
import remarkWikilinks from './src/plugins/remark-wikilinks.mjs';

// https://astro.build/config
export default defineConfig({
	site: 'https://ssherun.github.io',
	// Astro 7 默认改用 JSX 空白规则，会吃掉行内元素之间的空格（比如日期与阅读时长
	// 中间那个「 · 」会被压成「·」）。保持 v6 的 HTML 规则。
	compressHTML: true,
	i18n: {
		defaultLocale: 'zh-CN',
		locales: ['zh-CN', 'en'],
		routing: {
			prefixDefaultLocale: false,
		},
	},
	integrations: [
		mermaid(),
		mdx(),
		sitemap({
			filter: (page) => !page.includes('/notes/'),
			i18n: {
				defaultLocale: 'zh-CN',
				locales: {
					'zh-CN': 'zh-Hans',
					en: 'en',
				},
			},
			serialize(item) {
				const zh = item.links?.find((link) => link.lang === 'zh-Hans');
				if (zh && !item.links.some((link) => link.lang === 'x-default')) {
					item.links.push({ lang: 'x-default', url: zh.url });
				}
				return item;
			},
		}),
	],
	markdown: {
		// Astro 7 默认换成了 Sätteri，但知识图谱依赖 remark-wikilinks 解析 [[slug|title]]，
		// 所以继续走 unified 管线。要换 Sätteri 得先把这个插件移植成 MDAST 插件。
		processor: unified(),
		remarkPlugins: [remarkWikilinks],
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
