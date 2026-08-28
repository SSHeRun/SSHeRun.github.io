import cytoscape from 'cytoscape';
import type { NotesGraphPayload } from '../lib/vault/types';

function readTheme() {
	const s = getComputedStyle(document.documentElement);
	return {
		accent: s.getPropertyValue('--accent').trim() || '#0891b2',
		accentSecondary: s.getPropertyValue('--accent-secondary').trim() || '#7c3aed',
		text: s.getPropertyValue('--text-primary').trim() || '#1e293b',
		muted: s.getPropertyValue('--text-muted').trim() || '#94a3b8',
		border: s.getPropertyValue('--border').trim() || '#e2e8f0',
		surface: s.getPropertyValue('--bg-surface').trim() || '#ffffff',
	};
}

function matchesQuery(label: string, query: string): boolean {
	const hay = String(label).toLowerCase();
	const q = query.toLowerCase();
	if (!q) return false;
	if (hay.includes(q)) return true;
	let i = 0;
	for (const ch of hay) {
		if (ch === q[i]) i += 1;
		if (i >= q.length) return true;
	}
	return false;
}

function typeLabel(type: string): string {
	if (type === 'group') return '分组';
	if (type === 'subject') return '学科';
	if (type === 'chapter') return '章节';
	if (type === 'concept') return '概念';
	return type;
}

export function mountNotesGraph(data: NotesGraphPayload) {
	const container = document.getElementById('notes-cy');
	const panel = document.getElementById('notes-graph-panel');
	const panelBody = document.getElementById('notes-graph-body');
	const panelClose = document.getElementById('notes-graph-close');
	const searchInput = document.getElementById('notes-graph-search') as HTMLInputElement | null;
	const resultList = document.getElementById('notes-graph-results');
	const filterBar = document.getElementById('notes-graph-filters');
	const conceptToggle = document.getElementById('notes-graph-concepts') as HTMLInputElement | null;
	const fitBtn = document.getElementById('notes-graph-fit');
	if (!container) return;

	const theme = readTheme();
	const elements = [
		...data.nodes.map((node) => ({
			data: {
				id: node.id,
				label: node.label,
				nodeType: node.type,
				url: node.url || '',
				subject: node.subject || '',
				color: node.color || theme.accent,
				weight: node.weight ?? 1,
			},
		})),
		...data.edges.map((edge) => ({
			data: {
				source: edge.source,
				target: edge.target,
				edgeType: edge.type,
			},
		})),
	];

	const cy = cytoscape({
		container,
		elements,
		style: [
			{
				selector: 'node[nodeType="group"]',
				style: {
					'background-color': 'data(color)',
					label: 'data(label)',
					color: theme.text,
					'font-size': '13px',
					'font-weight': 700,
					width: 78,
					height: 78,
					shape: 'round-rectangle',
					'text-valign': 'center',
					'text-wrap': 'wrap',
					'text-max-width': '72px',
					'text-outline-color': theme.surface,
					'text-outline-width': 3,
				},
			},
			{
				selector: 'node[nodeType="subject"]',
				style: {
					'background-color': 'data(color)',
					label: 'data(label)',
					color: theme.text,
					'font-size': '12px',
					width: 46,
					height: 46,
					shape: 'diamond',
					'text-valign': 'bottom',
					'text-margin-y': 6,
				},
			},
			{
				selector: 'node[nodeType="chapter"]',
				style: {
					'background-color': 'data(color)',
					label: 'data(label)',
					color: theme.text,
					'font-size': '11px',
					width: 28,
					height: 28,
					'text-valign': 'bottom',
					'text-margin-y': 6,
					'text-max-width': '120px',
					'text-wrap': 'ellipsis',
				},
			},
			{
				selector: 'node[nodeType="concept"]',
				style: {
					'background-color': theme.surface,
					'border-width': 1.5,
					'border-color': 'data(color)',
					label: 'data(label)',
					color: theme.muted,
					'font-size': '10px',
					width: 14,
					height: 14,
					'text-valign': 'bottom',
					'text-margin-y': 4,
					'text-max-width': '90px',
					'text-wrap': 'ellipsis',
				},
			},
			{
				selector: 'edge[edgeType="belongs"]',
				style: { 'line-color': theme.border, width: 1.2, opacity: 0.4, 'line-style': 'dashed' },
			},
			{
				selector: 'edge[edgeType="next"]',
				style: {
					'line-color': theme.accent,
					width: 2,
					opacity: 0.7,
					'target-arrow-shape': 'triangle',
					'target-arrow-color': theme.accent,
					'curve-style': 'bezier',
				},
			},
			{
				selector: 'edge[edgeType="related"]',
				style: { 'line-color': theme.accentSecondary, width: 1.6, opacity: 0.45, 'curve-style': 'bezier' },
			},
			{
				selector: 'edge[edgeType="concept"]',
				style: { 'line-color': theme.border, width: 1, opacity: 0.3 },
			},
			{ selector: '.dim', style: { opacity: 0.08 } },
			{
				selector: '.match',
				style: {
					'border-width': 3,
					'border-color': theme.accent,
					'z-index': 10,
				},
			},
		],
		layout: {
			name: 'cose',
			idealEdgeLength: 120,
			nodeOverlap: 28,
			padding: 48,
			animate: false,
			componentSpacing: 100,
			nodeRepulsion: (node) => {
				const type = node.data('nodeType');
				if (type === 'group') return 16000;
				if (type === 'subject') return 10000;
				if (type === 'chapter') return 7000;
				return 3200;
			},
			gravity: 0.14,
			numIter: 1200,
		},
		minZoom: 0.15,
		maxZoom: 3,
		wheelSensitivity: 0.35,
	});

	let subjectFilter = 'all';
	let showConcepts = false;

	function visibleBase() {
		return cy.nodes().filter((node) => {
			const type = node.data('nodeType');
			if (type === 'concept' && !showConcepts) return false;
			if (subjectFilter === 'all') return true;
			if (type === 'group') return true;
			return node.data('subject') === subjectFilter;
		});
	}

	function applyVisibility() {
		const keep = visibleBase();
		cy.elements().addClass('dim');
		keep.removeClass('dim');
		keep.connectedEdges().filter((edge) => keep.contains(edge.source()) && keep.contains(edge.target())).removeClass('dim');
	}

	function renderPanel(node: cytoscape.NodeSingular) {
		if (!panel || !panelBody) return;
		const url = node.data('url') as string;
		const subject = node.data('subject') as string;
		panelBody.innerHTML = `
			<p class="panel-kicker">${typeLabel(node.data('nodeType'))}${subject ? ` · ${subject}` : ''}</p>
			<h2>${node.data('label')}</h2>
			${url ? `<p><a class="panel-primary" href="${url}">打开笔记</a></p>` : '<p class="vault-hint">分组节点，点旁边的学科或章节。</p>'}
		`;
		panel.hidden = false;
	}

	function focusNode(node: cytoscape.NodeSingular) {
		const keep = node.closedNeighborhood();
		cy.elements().removeClass('dim').removeClass('match');
		cy.elements().difference(keep).addClass('dim');
		node.addClass('match');
		renderPanel(node);
		cy.animate({ fit: { eles: keep, padding: 80 }, duration: 240 });
	}

	function renderResults(query: string) {
		if (!resultList) return;
		const q = query.trim().toLowerCase();
		if (!q) {
			resultList.hidden = true;
			resultList.innerHTML = '';
			return;
		}
		const hits = cy
			.nodes()
			.filter((node) => {
				if (subjectFilter !== 'all' && node.data('nodeType') !== 'group' && node.data('subject') !== subjectFilter) {
					return false;
				}
				return matchesQuery(String(node.data('label')), q);
			})
			.toArray()
			.slice(0, 12);
		if (!hits.length) {
			resultList.hidden = false;
			resultList.innerHTML = `<p class="vault-hint">没有匹配「${query}」的节点。</p>`;
			return;
		}
		resultList.hidden = false;
		resultList.innerHTML = hits
			.map(
				(node) =>
					`<button type="button" data-id="${node.id()}"><span>${typeLabel(node.data('nodeType'))}</span>${node.data('label')}</button>`,
			)
			.join('');
		cy.elements().removeClass('match').addClass('dim');
		hits.forEach((node) => node.removeClass('dim').addClass('match'));
		hits[0]?.closedNeighborhood().removeClass('dim');
		const hitSet = hits.reduce((col, node) => col.union(node), cy.collection());
		cy.animate({ fit: { eles: hitSet.closedNeighborhood(), padding: 70 }, duration: 220 });
	}

	(window as Window & { __notesCy?: cytoscape.Core }).__notesCy = cy;

	applyVisibility();

	cy.on('tap', 'node', (evt) => {
		focusNode(evt.target);
	});
	cy.on('tap', (evt) => {
		if (evt.target === cy) {
			cy.elements().removeClass('match');
			applyVisibility();
			if (panel) panel.hidden = true;
		}
	});
	cy.on('dbltap', 'node[nodeType="chapter"], node[nodeType="concept"], node[nodeType="subject"]', (evt) => {
		const url = evt.target.data('url');
		if (url) window.location.href = url;
	});
	panelClose?.addEventListener('click', () => {
		if (panel) panel.hidden = true;
		cy.elements().removeClass('match');
		applyVisibility();
	});
	searchInput?.addEventListener('input', () => {
		renderResults(searchInput.value);
		if (!searchInput.value.trim()) applyVisibility();
	});
	searchInput?.addEventListener('keydown', (event) => {
		if (event.key !== 'Enter') return;
		const first = resultList?.querySelector<HTMLButtonElement>('button[data-id]');
		const id = first?.dataset.id;
		if (!id) return;
		const node = cy.getElementById(id);
		if (node.nonempty()) focusNode(node);
	});
	resultList?.addEventListener('click', (event) => {
		const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-id]');
		if (!button?.dataset.id) return;
		const node = cy.getElementById(button.dataset.id);
		if (node.nonempty()) focusNode(node);
	});
	filterBar?.addEventListener('click', (event) => {
		const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-subject]');
		if (!button) return;
		subjectFilter = button.dataset.subject || 'all';
		filterBar.querySelectorAll('button').forEach((el) => el.classList.toggle('active', el === button));
		if (searchInput?.value.trim()) renderResults(searchInput.value);
		else applyVisibility();
	});
	conceptToggle?.addEventListener('change', () => {
		showConcepts = Boolean(conceptToggle.checked);
		if (searchInput?.value.trim()) renderResults(searchInput.value);
		else applyVisibility();
	});
	fitBtn?.addEventListener('click', () => {
		searchInput && (searchInput.value = '');
		if (resultList) {
			resultList.hidden = true;
			resultList.innerHTML = '';
		}
		cy.elements().removeClass('match');
		applyVisibility();
		cy.animate({ fit: { eles: visibleBase(), padding: 40 }, duration: 240 });
		if (panel) panel.hidden = true;
	});

	document.addEventListener(
		'astro:before-swap',
		() => {
			cy.destroy();
		},
		{ once: true },
	);
}
