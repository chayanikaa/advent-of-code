import { inputAsArray } from './utils/util';

interface Turn {
	num: number;
}

type NumberMap = Map<number, number[]>;

function playNextTurn(turns: Turn[], numberMap: NumberMap) {
	const lastTurn = turns[turns.length - 1];
	const lastNumberTurns: number[] = numberMap.get(lastTurn.num) as number[];
	let nextNumber = 0;
	if (lastNumberTurns.length > 1) {
		nextNumber = lastNumberTurns[1] - lastNumberTurns[0];
	}

	const nextNumberTurns = numberMap.get(nextNumber);

	if (nextNumberTurns) {
		numberMap.set(nextNumber, [
			nextNumberTurns[nextNumberTurns.length - 1],
			turns.length,
		]);
	} else {
		numberMap.set(nextNumber, [ turns.length ]);
	}

	turns.push({
		num: nextNumber,
	});
}

function findNumberAt(starting: number[], pos: number = 30000000): number | undefined {
	const turns: Turn[] = [];
	const numbers: NumberMap = new Map();

	let i = 0;

	while (i < starting.length) {
		turns.push({ num: starting[i] });
		numbers.set(starting[i], [ i ]);
		i++;
	}

	while (i <= pos - 1) {
		playNextTurn(turns, numbers);
		i++;
	}

	const lastElement = turns.pop();
	return lastElement && lastElement.num;
}

inputAsArray('inputs/15.txt', ',').then((arr) => {
	const numbers = arr.map(str => +str);
	console.time();
	console.log('Part 1', findNumberAt(numbers, 2020));
	console.timeEnd();
	console.time();
	console.log('Part 2', findNumberAt(numbers, 30000000));
	console.timeEnd();
});
