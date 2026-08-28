import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { encryptJson, resolveVaultPassword } from '../../lib/vault/encrypt';
import { buildVaultPayload } from '../../lib/vault/serialize';

export const GET: APIRoute = async () => {
	const password = resolveVaultPassword();
	if (!password) {
		return new Response(JSON.stringify({ configured: false }), {
			headers: { 'Content-Type': 'application/json; charset=utf-8' },
		});
	}

	const notes = await getCollection('notes');
	const payload = buildVaultPayload(notes);
	const blob = encryptJson(payload, password);

	return new Response(JSON.stringify({ configured: true, ...blob }), {
		headers: { 'Content-Type': 'application/json; charset=utf-8' },
	});
};
