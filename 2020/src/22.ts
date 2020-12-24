import { inputAsArray } from './utils/util';

interface GameState {
	deck1: number[],
	deck2: number[],
}

function simulateRecursiveCombat(deck1: number[], deck2: number[], recurse = false): {
	winner: number,
	deck: number[],
 } {
	let winner: number = 1;
	const gameStates: Set<string> = new Set();
	while (deck1.length && deck2.length) {
		winner = 1;
		const gameState: GameState = { deck1, deck2 };
		const str = JSON.stringify(gameState);
		
		if (gameStates.has(str)) {
			return { winner, deck: deck1 };
		}
		gameStates.add(str);

		const card1 = deck1.shift() as number;
		const card2 = deck2.shift() as number;

		if (recurse && deck1.length >= card1 && deck2.length >= card2) {
			winner = simulateRecursiveCombat(deck1.slice(0, card1), deck2.slice(0, card2), recurse).winner;
		} else {
			if (card1 > card2) {
				winner = 1;
			} else {
				winner = 2;
			}
		}

		if (winner === 1) {
			deck1.push(card1, card2);
		} else {
			deck2.push(card2, card1);
		}
	}

	return {
		winner,
		deck: winner === 1 ? deck1 : deck2,
	};
}

inputAsArray('inputs/22.txt', '\n\n').then((arr) => {
	const deck1 = arr[0].split('\n').slice(1).map(n => +n);
	const deck2 = arr[1].split('\n').slice(1).map(n => +n);
	const winningDeck1 = simulateRecursiveCombat([ ...deck1], [ ...deck2]).deck;
	console.log('Part 1', winningDeck1.reduce((acc, curr, i) => acc + curr * (winningDeck1.length - i), 0));

	const winningDeck2 = simulateRecursiveCombat(deck1, deck2, true).deck;
	console.log('Part 2', winningDeck2.reduce((acc, curr, i) => acc + curr * (winningDeck2.length - i), 0));
});
