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
	integrations: [mermaid(), mdx(), sitemap()],
	markdown: {
		remarkPlugins: [
			[remarkWikilinks, { pathPrefix: '/blog/' }],
		],
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
