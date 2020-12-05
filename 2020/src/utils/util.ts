import { promises as fs } from 'fs';

export async function inputAsArray(filePath: string): Promise<string[]> {
	const buffer = await fs.readFile(filePath);
	const str = buffer.toString();
	const asArray = str.split('\n');
	return asArray;
}