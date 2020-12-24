import { inputAsArray } from './utils/util';

type Directions = string[];

const neighborIncrements = [
	[1, 0],
	[-1, 0],
	[0.5, 0.5],
	[0.5, -0.5],
	[-0.5, 0.5],
	[-0.5, -0.5],
];

function parseDirections(directions: string): Directions | null {
	return directions.match(/(nw|ne|se|sw|w|e)/g);
}

function findTile(directions: Directions, referenceTile = [0, 0]): number[] {
	const tile = [ ...referenceTile ];
	directions.forEach(dir => {
		switch(dir) {
			case 'e':
				tile[0]++;
				break;
			case 'w':
				tile[0]--;
				break;
			case 'ne':
				tile[0] += 0.5;
				tile[1] += 0.5;
				break;
			case 'sw':
				tile[0] -= 0.5;
				tile[1] -= 0.5;
				break;
			case 'nw':
				tile[0] -= 0.5;
				tile[1] += 0.5;
				break;
			case 'se':
				tile[0] += 0.5;
				tile[1] -= 0.5;
				break;
			default:
				throw new Error(`Something is wrong. ${directions}`);
		}
	});
	return tile;
}

function executeDirections(input: string[]): Set<string> {
	const directionsArr = input.map(parseDirections);
	const blackSet: Set<string> = new Set;
	directionsArr.forEach((direction, i) => {
		if (direction == null) {
			throw new Error(`Something is wrong. ${input[i]}`);
		}
		const tileCoords = findTile(direction);
		const key = JSON.stringify(tileCoords);
		if (blackSet.has(key)) {
			blackSet.delete(key);
		} else {
			blackSet.add(key);
		}
	});
	return blackSet;
}

function findNeighbors(coords: number[]) {
	return neighborIncrements.map(inc => [coords[0] + inc[0], coords[1] + inc[1]]);
}

function getKey(coords: number[]) { return JSON.stringify(coords) }

function getCoords(key: string): number[] { return JSON.parse(key) };

function executeDay(blackTileSet: Set<string>) {
	const blackTileMap: Map<string, number> = new Map();
	const whiteTileMap: Map<string, number> = new Map();

	blackTileSet.forEach(key => blackTileMap.set(key, 0));

	blackTileSet.forEach(key => {
		const coords = getCoords(key);
		const neighbors = findNeighbors(coords);
		neighbors.forEach(neighbor => {
			const neighborKey = getKey(neighbor);
			if (blackTileSet.has(neighborKey)) {
				blackTileMap.set(key, (blackTileMap.get(key) as number) + 1);
			} else {
				// white neighbor
				const currentNeighbors = whiteTileMap.get(neighborKey) || 0;
				if (whiteTileMap.has(neighborKey)) {
					whiteTileMap.set(neighborKey, currentNeighbors + 1);
				} else {
					whiteTileMap.set(neighborKey, 1);
				}
			}
		});
	});

	const toFlipBlack: string[] = [];
	const toFlipWhite: string[] = [];

	whiteTileMap.forEach((neighbors, keyCoords) => {
		if (neighbors === 2) {
			toFlipBlack.push(keyCoords);
		}
	});

	blackTileMap.forEach((neighbors, keyCoords) => {
		if (neighbors === 0 || neighbors > 2) {
			toFlipWhite.push(keyCoords);
		}
	});

	toFlipBlack.forEach(key => blackTileSet.add(key));
	toFlipWhite.forEach(key => blackTileSet.delete(key));
}


inputAsArray('inputs/24.txt', '\n').then((arr) => {
	const blackSet = executeDirections(arr);
	console.log('Part 1', blackSet.size);

	let day = 0;

	while (day < 100) {
		executeDay(blackSet);
		day++;
	}

	console.log('Part ', blackSet.size);

});
