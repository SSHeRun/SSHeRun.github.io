// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import mermaid from 'astro-mermaid';
import { defineConfig } from 'astro/config';
import remarkWikilinks from './src/plugins/remark-wikilinks.mjs';

// https://astro.build/config
export default defineConfig({
	site: 'https://ssherun.github.io',
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
		remarkPlugins: [remarkWikilinks],
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
