import katex from 'katex';
import { marked } from 'marked';

marked.setOptions({ gfm: true, breaks: false });

function escapeHtml(value: string): string {
	return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function decodeHtml(value: string): string {
	return value
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'");
}

function renderTex(tex: string, displayMode: boolean): string {
	try {
		return katex.renderToString(tex.trim(), {
			displayMode,
			throwOnError: false,
			strict: 'ignore',
		});
	} catch {
		return `<code>${escapeHtml(tex)}</code>`;
	}
}

function renderMath(markdown: string): string {
	const fences: string[] = [];
	const withoutFences = markdown.replace(/```[\s\S]*?```/g, (block) => {
		fences.push(block);
		return `@@FENCE${fences.length - 1}@@`;
	});

	const withMath = withoutFences
		.replace(/\\\[([\s\S]+?)\\\]/g, (_all, tex) => renderTex(tex, true))
		.replace(/\$\$([\s\S]+?)\$\$/g, (_all, tex) => renderTex(tex, true))
		.replace(/\\\((.+?)\\\)/g, (_all, tex) => renderTex(tex, false));

	return withMath.replace(/@@FENCE(\d+)@@/g, (_all, index) => fences[Number(index)] ?? '');
}

export function renderNoteMarkdown(markdown: string, currentSubject: string): string {
	const linked = markdown.replace(/\[\[([^\]|#]+)(?:\|([^\]]+))?\]\]/g, (_all, target, text) => {
		const path = String(target).includes('/') ? String(target) : `${currentSubject}/${target}`;
		const label = text || path;
		return `<a href="/notes/${path}/">${label}</a>`;
	});
	const html = marked.parse(renderMath(linked)) as string;
	return html.replace(
		/<pre><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/g,
		(_all, code) => `<pre class="mermaid">${decodeHtml(code)}</pre>`,
	);
}
