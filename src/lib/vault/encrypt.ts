import { createCipheriv, pbkdf2Sync, randomBytes } from 'node:crypto';
import type { EncryptedBlob } from './types';

export const VAULT_ITERATIONS = 210_000;

export function resolveVaultPassword(): string | null {
	const fromEnv = String(import.meta.env.VAULT_PASSWORD ?? process.env.VAULT_PASSWORD ?? '').trim();
	if (fromEnv) return fromEnv;
	if (import.meta.env.DEV) return 'dev-vault';
	return null;
}

export function encryptJson(value: unknown, password: string): EncryptedBlob {
	const plaintext = JSON.stringify(value);
	const salt = randomBytes(16);
	const iv = randomBytes(12);
	const key = pbkdf2Sync(password, salt, VAULT_ITERATIONS, 32, 'sha256');
	const cipher = createCipheriv('aes-256-gcm', key, iv);
	const data = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
	const tag = cipher.getAuthTag();
	return {
		v: 1,
		kdf: 'pbkdf2-sha256',
		iter: VAULT_ITERATIONS,
		salt: salt.toString('base64'),
		iv: iv.toString('base64'),
		tag: tag.toString('base64'),
		data: data.toString('base64'),
	};
}
