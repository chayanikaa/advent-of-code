



function playMove(input: number[], i: number): {
	cups: number[], nextI: number } {

	
	const currentI = i % input.length;

	const currentNumber = input[currentI];

	// console.log(currentNumber, input.join(' '));
	const nextIndices = [
		(currentI + 1) % input.length,
		(currentI + 2) % input.length,
		(currentI + 3) % input.length
	]
	const nextNumbers = nextIndices.map(ind => input[ind]);
	let output = input.map((num, i) => nextIndices.includes(i) ? undefined : num);
	//console.log(output)

	// const outputNumbers = output.filter(op => op != null) as number[];

	const max = 9;
	const min = 1;

	let targetDest = currentNumber - 1;

	let destNumber, destI;
	destI = output.indexOf(targetDest);
	if (destI === -1) {
		while (destI < 0) {
			if (targetDest < min) {
				targetDest = max;
			}
			destI = output.indexOf(targetDest);
			targetDest--;
		}
	}
	destNumber = output[destI];

	// console.log({ currentNumber, nextNumbers, destNumber });

	output = [
		...output.slice(0, destI + 1),
		...nextNumbers,
		...output.slice(destI + 1, output.length)].filter(num => num != null)

		// console.log('output', output.join(' '));
	
	return {
		cups: output as number[],
		nextI: (output.indexOf(currentNumber) + 1) % output.length
	};
}

function part1() {
	const inputStr = '562893147';
	let input = inputStr.split('').map(l => +l);

	let i = 0;
	let result = {
		cups: input,
		nextI: 0,
	}
	while (i < 100) {
		result = playMove(result.cups, result.nextI);
		i++;
	}
	console.log('Part 1: including 1', result.cups.join(''));
}


part1();