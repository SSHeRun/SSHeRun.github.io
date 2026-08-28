import type { EncryptedBlob, VaultFile, VaultPayload } from '../lib/vault/types';

const SESSION_KEY = 'ssherun.vault.v1';

function b64ToBytes(value: string): Uint8Array {
	const binary = atob(value);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
	return bytes;
}

export async function decryptVault(blob: EncryptedBlob, password: string): Promise<VaultPayload> {
	const enc = new TextEncoder();
	const salt = b64ToBytes(blob.salt);
	const iv = b64ToBytes(blob.iv);
	const tag = b64ToBytes(blob.tag);
	const data = b64ToBytes(blob.data);
	const combined = new Uint8Array(data.length + tag.length);
	combined.set(data);
	combined.set(tag, data.length);

	const material = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']);
	const key = await crypto.subtle.deriveKey(
		{ name: 'PBKDF2', salt, iterations: blob.iter, hash: 'SHA-256' },
		material,
		{ name: 'AES-GCM', length: 256 },
		false,
		['decrypt'],
	);
	const raw = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, combined);
	return JSON.parse(new TextDecoder().decode(raw)) as VaultPayload;
}

export function readVaultSession(): VaultPayload | null {
	try {
		const raw = sessionStorage.getItem(SESSION_KEY);
		return raw ? (JSON.parse(raw) as VaultPayload) : null;
	} catch {
		return null;
	}
}

export function writeVaultSession(payload: VaultPayload): void {
	sessionStorage.setItem(SESSION_KEY, JSON.stringify(payload));
}

export function clearVaultSession(): void {
	sessionStorage.removeItem(SESSION_KEY);
}

export async function loadVaultFile(): Promise<VaultFile> {
	const res = await fetch('/notes/vault.json', { cache: 'no-store' });
	if (!res.ok) throw new Error('无法加载保险库');
	return (await res.json()) as VaultFile;
}
