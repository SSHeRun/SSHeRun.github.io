import 'katex/dist/katex.min.css';
import mermaid from 'mermaid';
import type { VaultNote, VaultPayload } from '../lib/vault/types';
import {
	clearVaultSession,
	decryptVault,
	loadVaultFile,
	readVaultSession,
	writeVaultSession,
} from './vault-crypto';
import { renderNoteMarkdown } from './vault-markdown';
import { mountNotesGraph } from './init-notes-graph';

type Mode = 'catalog' | 'subject' | 'note' | 'graph';

mermaid.initialize({
	startOnLoad: false,
	securityLevel: 'strict',
	theme: document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'neutral',
});

function notesForSubject(payload: VaultPayload, id: string): VaultNote[] {
	return payload.notes.filter((note) => note.subject === id);
}

function bindVaultPage() {
	const root = document.getElementById('vault-app');
	if (!root || root.dataset.bound === '1') return;
	root.dataset.bound = '1';

	const mode = (root.dataset.mode || 'catalog') as Mode;
	const subjectId = root.dataset.subject || '';
	const slug = root.dataset.slug || '';
	const lock = document.getElementById('vault-lock');
	const content = document.getElementById('vault-content');
	const form = document.getElementById('vault-form') as HTMLFormElement | null;
	const input = document.getElementById('vault-password') as HTMLInputElement | null;
	const errorEl = document.getElementById('vault-error');
	const hintEl = document.getElementById('vault-hint');

	function showError(message: string) {
		if (!errorEl) return;
		errorEl.textContent = message;
		errorEl.hidden = false;
	}

	function hideLock() {
		if (lock) lock.hidden = true;
		if (content) content.hidden = false;
	}

	function showLock() {
		if (lock) lock.hidden = false;
		if (content) content.hidden = true;
	}

	function renderCatalog(payload: VaultPayload) {
		if (!content) return;
		const groups = new Map<string, typeof payload.subjects>();
		for (const subject of payload.subjects) {
			if (subject.id === 'reading' && !notesForSubject(payload, subject.id).length) continue;
			const list = groups.get(subject.group) ?? [];
			list.push(subject);
			groups.set(subject.group, list);
		}

		const blocks = [...groups.entries()]
			.map(([group, subjects]) => {
				const label = subjects[0]?.groupLabel ?? group;
				const cards = subjects
					.map((subject) => {
						const count = notesForSubject(payload, subject.id).length;
						return `<a class="vault-card" href="/notes/${subject.id}/">
						<span class="vault-card-kicker" style="background:${subject.color}"></span>
						<h3>${subject.label}</h3>
						<p>${subject.description}</p>
						<p class="vault-meta">${count ? `${count} 章已审` : '待写入'}</p>
					</a>`;
					})
					.join('');
				return `<section class="vault-section"><h2>${label}</h2><div class="vault-grid">${cards}</div></section>`;
			})
			.join('');

		content.innerHTML = `
		<header class="vault-header">
			<p class="vault-kicker">加密知识库</p>
			<h1>笔记保险库</h1>
			<p>按学科查阅。知识图谱独立于博客标签图，后续加学科不必改路由。</p>
			<p class="vault-actions">
				<a href="/notes/graph/">打开知识图谱</a>
				<button type="button" id="vault-lock-again">重新上锁</button>
			</p>
			<label class="vault-search-label">
				<span class="sr-only">搜索章节</span>
				<input id="vault-catalog-search" type="search" placeholder="搜索章节、概念，例如：快排、页表、三次握手" />
			</label>
			<div id="vault-catalog-results" class="vault-search-results" hidden></div>
		</header>
		${blocks}
	`;

		document.title = '笔记保险库';
		const search = content.querySelector<HTMLInputElement>('#vault-catalog-search');
		const results = content.querySelector<HTMLElement>('#vault-catalog-results');
		search?.addEventListener('input', () => {
			if (!results) return;
			const q = search.value.trim().toLowerCase();
			if (!q) {
				results.hidden = true;
				results.innerHTML = '';
				return;
			}
			const hits = payload.notes
				.filter((note) => {
					const hay = [note.title, note.description, note.concepts.join(' '), note.markdown].join('\n').toLowerCase();
					return hay.includes(q);
				})
				.slice(0, 12);
			results.hidden = false;
			results.innerHTML = hits.length
				? hits
						.map((note) => {
							const subject = payload.subjects.find((item) => item.id === note.subject);
							return `<a href="/notes/${note.subject}/${note.slug}/"><span>${subject?.label ?? note.subject}</span>${note.title}</a>`;
						})
						.join('')
				: `<p class="vault-hint">没有匹配「${search.value}」的章节。</p>`;
		});
	}

	function renderSubject(payload: VaultPayload) {
		if (!content) return;
		const subject = payload.subjects.find((item) => item.id === subjectId);
		const notes = notesForSubject(payload, subjectId);
		const cards = notes
			.map(
				(note) => `<a class="vault-chapter" href="/notes/${note.subject}/${note.slug}/">
				<span class="vault-chapno">第 ${note.chapter} 章</span>
				<div>
					<p class="vault-meta">${note.status === 'reviewed' ? '已审' : '草稿'} · ${note.concepts.slice(0, 3).join(' · ')}</p>
					<h3>${note.title}</h3>
					<p>${note.description}</p>
				</div>
			</a>`,
			)
			.join('');

		content.innerHTML = `
		<header class="vault-header">
			<p class="vault-kicker"><a href="/notes/">全部学科</a></p>
			<h1>${subject?.label ?? subjectId}</h1>
			<p>${subject?.description ?? ''}</p>
		</header>
		<div class="vault-chapters">${cards || '<p class="vault-empty">这一科还没有已审章节。</p>'}</div>
	`;
		document.title = `${subject?.label ?? '笔记'} · 保险库`;
	}

	async function renderNote(payload: VaultPayload) {
		if (!content) return;
		const note = payload.notes.find((item) => item.subject === subjectId && item.slug === slug);
		if (!note) {
			content.innerHTML = `<p class="vault-empty">找不到这一章。请回 <a href="/notes/">目录</a>。</p>`;
			return;
		}
		const subject = payload.subjects.find((item) => item.id === note.subject);
		const siblings = notesForSubject(payload, note.subject);
		const index = siblings.findIndex((item) => item.id === note.id);
		const prev = siblings[index - 1];
		const next = siblings[index + 1];
		const html = renderNoteMarkdown(note.markdown, note.subject);

		const toc = [...html.matchAll(/<h2[^>]*>(.*?)<\/h2>/g)].map((match, index) => {
			const text = match[1].replace(/<[^>]+>/g, '');
			return `<a href="#vault-h2-${index}">${text}</a>`;
		});
		let headingIndex = 0;
		const body = html.replace(/<h2([^>]*)>/g, (_all, attrs) => `<h2 id="vault-h2-${headingIndex++}"${attrs}>`);

		content.innerHTML = `
		<article class="vault-article">
			<p class="vault-kicker"><a href="/notes/">保险库</a> / <a href="/notes/${note.subject}/">${subject?.label ?? note.subject}</a></p>
			<h1>${note.title}</h1>
			<p class="vault-lead">${note.description}</p>
			<p class="vault-meta">第 ${note.chapter} 章 · ${note.concepts.length} 个概念${note.updated ? ` · 更新 ${note.updated}` : ''}</p>
			<div class="vault-concepts">${note.concepts.map((item) => `<a href="/notes/graph/?q=${encodeURIComponent(item)}">${item}</a>`).join('')}</div>
			${toc.length ? `<nav class="vault-toc" aria-label="本章目录">${toc.join('')}</nav>` : ''}
			<div class="vault-body">${body}</div>
			<nav class="vault-pager">
				${prev ? `<a href="/notes/${prev.subject}/${prev.slug}/">← ${prev.title}</a>` : '<span></span>'}
				${next ? `<a href="/notes/${next.subject}/${next.slug}/">${next.title} →</a>` : '<span></span>'}
			</nav>
		</article>
	`;
		document.title = `${note.title} · ${subject?.label ?? '笔记'}`;

		try {
			await mermaid.run({ querySelector: '.vault-body .mermaid' });
		} catch {
			// 单张图失败不阻断整章
		}
	}

	function renderGraph(payload: VaultPayload) {
		if (!content) return;
		root.classList.add('vault-app-wide');
		const subjects = payload.subjects.filter((item) => notesForSubject(payload, item.id).length);
		const chips = [
			'<button type="button" data-subject="all" class="active">全部</button>',
			...subjects.map(
				(item) =>
					`<button type="button" data-subject="${item.id}"><span class="swatch" style="background:${item.color}"></span>${item.label}</button>`,
			),
		].join('');
		content.innerHTML = `
		<header class="vault-header">
			<p class="vault-kicker"><a href="/notes/">保险库</a></p>
			<h1>知识图谱</h1>
			<p>${payload.graph.stats.subjects} 科 · ${payload.graph.stats.chapters} 章 · ${payload.graph.stats.concepts} 个概念 · ${payload.graph.stats.edges} 条关系</p>
			<p class="vault-hint">先搜概念或章节。默认只显示学科和章节，勾选后才铺开概念点。双击打开笔记。</p>
			<div class="vault-graph-toolbar">
				<label class="vault-search-label">
					<span class="sr-only">查找节点</span>
					<input id="notes-graph-search" type="search" placeholder="查找：快排、页表、三次握手、B+ 树…" />
				</label>
				<div id="notes-graph-results" class="vault-search-results" hidden></div>
				<div id="notes-graph-filters" class="vault-filters">${chips}</div>
				<div class="vault-graph-tools">
					<label><input id="notes-graph-concepts" type="checkbox" /> 显示概念点</label>
					<button type="button" id="notes-graph-fit">复位视图</button>
				</div>
			</div>
		</header>
		<div class="vault-graph-wrap">
			<div id="notes-cy"></div>
			<aside id="notes-graph-panel" hidden>
				<button id="notes-graph-close" type="button" aria-label="关闭">×</button>
				<div id="notes-graph-body"></div>
			</aside>
			<div class="vault-legend">
				<span>方块 = 分组</span>
				<span>菱形 = 学科</span>
				<span>圆点 = 章节</span>
				<span>青线 = 章序</span>
				<span>紫线 = 交叉</span>
			</div>
		</div>
	`;
		document.title = '知识图谱 · 保险库';
		mountNotesGraph(payload.graph);
		const params = new URLSearchParams(window.location.search);
		const q = params.get('q');
		const search = document.getElementById('notes-graph-search') as HTMLInputElement | null;
		if (q && search) {
			search.value = q;
			search.dispatchEvent(new Event('input'));
		}
	}

	async function reveal(payload: VaultPayload) {
		hideLock();
		if (mode === 'catalog') renderCatalog(payload);
		else if (mode === 'subject') renderSubject(payload);
		else if (mode === 'note') await renderNote(payload);
		else renderGraph(payload);

		content?.querySelector('#vault-lock-again')?.addEventListener('click', () => {
			clearVaultSession();
			showLock();
			if (input) input.value = '';
			input?.focus();
		});
	}

	async function unlock(password: string) {
		const file = await loadVaultFile();
		if (!file.configured) {
			showError('构建时没有配置 VAULT_PASSWORD，保险库是空的。');
			return;
		}
		try {
			const payload = await decryptVault(file, password);
			try {
				writeVaultSession(payload);
			} catch {
				// 配额满时仍展示本页，只是跳转要再输一次
			}
			await reveal(payload);
		} catch {
			showError('口令不对，或者密文已损坏。');
		}
	}

	async function boot() {
		const file = await loadVaultFile().catch(() => null);
		if (file && !file.configured && hintEl) {
			hintEl.textContent = '当前构建没有写入保险库密钥。本地请在 .env 设置 VAULT_PASSWORD。';
		}

		const existing = readVaultSession();
		if (existing) {
			await reveal(existing);
			return;
		}
		showLock();
	}

	form?.addEventListener('submit', (event) => {
		event.preventDefault();
		const password = input?.value ?? '';
		if (!password) {
			showError('请输入口令。');
			return;
		}
		if (errorEl) errorEl.hidden = true;
		void unlock(password);
	});

	void boot();
}

bindVaultPage();
document.addEventListener('astro:page-load', bindVaultPage);
