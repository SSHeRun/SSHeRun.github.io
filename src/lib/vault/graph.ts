import { SUBJECT_GROUPS, SUBJECTS } from './subjects';
import type { NotesGraphEdge, NotesGraphPayload, VaultNote } from './types';

const edgeKey = (source: string, target: string, type: string) => `${source}\0${target}\0${type}`;

export function buildNotesGraph(notes: VaultNote[]): NotesGraphPayload {
	const nodes: NotesGraphPayload['nodes'] = [];
	const edges: NotesGraphEdge[] = [];
	const seen = new Set<string>();

	function addEdge(source: string, target: string, type: NotesGraphEdge['type']) {
		if (source === target) return;
		const key = edgeKey(source, target, type);
		if (seen.has(key)) return;
		seen.add(key);
		edges.push({ source, target, type });
	}

	const usedSubjects = new Set(notes.map((note) => note.subject));
	const visibleSubjects = SUBJECTS.filter(
		(subject) => usedSubjects.has(subject.id) || (subject.id !== 'reading' && subject.id !== 'xuanxue'),
	);
	const visibleGroups = new Set(visibleSubjects.map((subject) => subject.group));

	for (const group of SUBJECT_GROUPS) {
		if (!visibleGroups.has(group.id)) continue;
		nodes.push({
			id: `group:${group.id}`,
			label: group.label,
			type: 'group',
			color: group.color,
			weight: 8,
		});
	}

	for (const subject of visibleSubjects) {
		nodes.push({
			id: `subject:${subject.id}`,
			label: subject.label,
			type: 'subject',
			url: `/notes/${subject.id}/`,
			subject: subject.id,
			color: subject.color,
			weight: 6,
		});
		addEdge(`group:${subject.group}`, `subject:${subject.id}`, 'belongs');
	}

	const bySubject = new Map<string, VaultNote[]>();
	for (const note of notes) {
		const list = bySubject.get(note.subject) ?? [];
		list.push(note);
		bySubject.set(note.subject, list);
	}

	for (const [subjectId, list] of bySubject) {
		const subject = SUBJECTS.find((item) => item.id === subjectId);
		const sorted = [...list].sort((a, b) => a.order - b.order);
		for (let i = 0; i < sorted.length; i++) {
			const note = sorted[i];
			const chapterId = `note:${note.id}`;
			nodes.push({
				id: chapterId,
				label: note.title,
				type: 'chapter',
				url: `/notes/${note.subject}/${note.slug}/`,
				subject: note.subject,
				color: subject?.color,
				weight: 3,
			});
			addEdge(`subject:${note.subject}`, chapterId, 'belongs');
			if (i > 0) addEdge(`note:${sorted[i - 1].id}`, chapterId, 'next');

			for (const concept of note.concepts) {
				const conceptId = `concept:${note.id}:${concept}`;
				nodes.push({
					id: conceptId,
					label: concept,
					type: 'concept',
					url: `/notes/${note.subject}/${note.slug}/`,
					subject: note.subject,
					color: subject?.color,
					weight: 1,
				});
				addEdge(chapterId, conceptId, 'concept');
			}

			for (const related of note.related) {
				addEdge(chapterId, `note:${related}`, 'related');
			}
		}
	}

	// 408 内部常见交叉：帮助从导图关系过渡到可点图谱
	const cross: Array<[string, string]> = [
		['subject:ds', 'subject:os'],
		['subject:ds', 'subject:co'],
		['subject:co', 'subject:os'],
		['subject:os', 'subject:cn'],
		['subject:ds', 'subject:db'],
		['subject:os', 'subject:db'],
		['subject:cn', 'subject:security'],
		['subject:db', 'subject:security'],
		['subject:co', 'subject:cn'],
	];
	for (const [from, to] of cross) {
		if (nodes.some((node) => node.id === from) && nodes.some((node) => node.id === to)) {
			addEdge(from, to, 'related');
		}
	}

	return {
		nodes,
		edges,
		stats: {
			subjects: nodes.filter((node) => node.type === 'subject').length,
			chapters: nodes.filter((node) => node.type === 'chapter').length,
			concepts: nodes.filter((node) => node.type === 'concept').length,
			edges: edges.length,
		},
	};
}
