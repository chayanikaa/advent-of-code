import { promises as fs } from 'fs';

const sum = 2020;

async function inputAsArray() {
	const buffer = await fs.readFile('inputs/1.txt');
	const str = buffer.toString();
	const asArray = str.split('\n').map((part) => +part);
	return asArray;
}

function findEntries(arr: number[]) {
	let elements = [0, 0];
	arr.some((element1, i1) => {
		return arr.some((element2, i2) => {
			if (i2 !== i1) {
				if (element1 + element2 === sum) {
					elements = [element1, element2];
					return true;
				}
			}
		});
	});
	console.log(elements);
	console.log('Part 1', elements[0] * elements[1]);
}

function findEntries2(arr: number[]) {
	let elements = [0, 0, 0];
	arr.some((element1, i1) => {
		return arr.some((element2, i2) => {
			return arr.some((element3, i3) => {
				if (i3 !== i1 && i3 !== i2 && i2 !== i1) {
					if (element1 + element2 + element3 === sum) {
						elements = [element1, element2, element3];
						return true;
					}
				}
			});
		});
	});
	console.log(elements);
	console.log('Part 2', elements[0] * elements[1] * elements[2]);
}

inputAsArray().then((arr) => {
	findEntries(arr);
	findEntries2(arr);
});
