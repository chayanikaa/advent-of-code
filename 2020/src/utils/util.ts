import { promises as fs } from 'fs';

export async function inputAsArray(filePath: string, delim: string = '\n'): Promise<string[]> {
	const buffer = await fs.readFile(filePath);
	const str = buffer.toString();
	const asArray = str.split(delim);
	return asArray;
}

export async function aTimeout(timeout: number) {
	return new Promise((resolve, reject) => {
		setTimeout(resolve, timeout);
	});
}