import type { CollectionEntry } from 'astro:content';
import { SUBJECTS } from './subjects';
import { buildNotesGraph } from './graph';
import type { VaultNote, VaultPayload } from './types';

export function slugFromNoteId(id: string): string {
	const parts = id.split('/');
	return parts[parts.length - 1] ?? id;
}

export function toVaultNote(note: CollectionEntry<'notes'>): VaultNote {
	return {
		id: note.id,
		subject: note.data.subject,
		slug: slugFromNoteId(note.id),
		title: note.data.title,
		description: note.data.description,
		chapter: note.data.chapter,
		order: note.data.order,
		status: note.data.status,
		difficulty: note.data.difficulty,
		concepts: note.data.concepts,
		cover: note.data.cover,
		related: note.data.related ?? [],
		updated: note.data.updatedDate?.toISOString().slice(0, 10),
		markdown: note.body ?? '',
	};
}

export function buildVaultPayload(notes: CollectionEntry<'notes'>[]): VaultPayload {
	const serialized = notes
		.map(toVaultNote)
		.sort((a, b) => {
			if (a.subject !== b.subject) {
				const orderA = SUBJECTS.find((item) => item.id === a.subject)?.order ?? 99;
				const orderB = SUBJECTS.find((item) => item.id === b.subject)?.order ?? 99;
				return orderA - orderB;
			}
			return a.order - b.order;
		});

	return {
		subjects: SUBJECTS,
		notes: serialized,
		graph: buildNotesGraph(serialized),
	};
}
