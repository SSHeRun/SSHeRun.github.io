import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const publicDir = path.join(root, 'public');
const svgPath = path.join(publicDir, 'favicon.svg');
const svg = await fs.readFile(svgPath);

const sizes = [
	{ name: 'favicon-16.png', size: 16 },
	{ name: 'favicon-32.png', size: 32 },
	{ name: 'apple-touch-icon.png', size: 180 },
	{ name: 'icon-192.png', size: 192 },
	{ name: 'icon-512.png', size: 512 },
];

for (const { name, size } of sizes) {
	await sharp(svg).resize(size, size).png().toFile(path.join(publicDir, name));
}

await sharp(svg).resize(32, 32).toFile(path.join(publicDir, 'favicon.ico'));

console.log('Generated favicon assets in public/');
