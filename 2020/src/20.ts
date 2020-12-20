import { inputAsArray } from './utils/util';

function rotate90Clockwise(tile: Tile) {
	return {
		id: tile.id,
		top: tile.left.split('').reverse().join(''),
		right: tile.top,
		bottom: tile.right.split('').reverse().join(''),
		left: tile.bottom,
		str: tile.str,
	};
}

function flipHorizontal(tile: Tile) {
	return {
		id: tile.id,
		top: tile.top.split('').reverse().join(''),
		right: tile.left,
		bottom: tile.bottom.split('').reverse().join(''),
		left: tile.right,
		str: tile.str,
	};
}

function flipVertical(tile: Tile) {
	return {
		id: tile.id,
		top: tile.bottom,
		right: tile.right.split('').reverse().join(''),
		bottom: tile.top,
		left: tile.left.split('').reverse().join(''),
		str: tile.str,
	};
}

function matchesTile(curTile: Tile, nextTile: Tile, curTileCoords: number[]) {
	let angle = 0;
	let rotatedTile = nextTile;
	let matchCoords: number[] | undefined;
	let matchTile: Tile | undefined;
	while (angle <= 270) {
		// console.log(angle);
		const found = [rotatedTile, flipHorizontal(rotatedTile), flipVertical(rotatedTile)].some((fuckingTile) => {
			if (curTile.bottom === fuckingTile.top) {
				matchCoords = [curTileCoords[0], curTileCoords[1] + 1];
				matchTile = fuckingTile;
				return true;
			}
			if (curTile.top === fuckingTile.bottom) {
				matchCoords = [curTileCoords[0], curTileCoords[1] - 1];
				matchTile = fuckingTile;
				return true;
			}
			if (curTile.left === fuckingTile.right) {
				matchCoords = [curTileCoords[0] - 1, curTileCoords[1]];
				matchTile = fuckingTile;
				return true;
			}
			if (curTile.right === fuckingTile.left) {
				matchCoords = [curTileCoords[0] + 1, curTileCoords[1]];
				matchTile = fuckingTile;
				return true;
			}
		});
		if (found) {
			break;
		}
		rotatedTile = rotate90Clockwise(rotatedTile);
		angle += 90;
	}

	// if (nextTile.id === '3079' && curTile.id === '2311') {
	// 	console.log('2311', curTile.str);
	// }

	return {
		matchCoords,
		tile: matchTile,
	};
}

function arrangePuzzle(tileStrings: string[]): Puzzle {
	const tiles = tileStrings.map(parseTile);

	const puzzle: Puzzle = {
		minX: 0,
		maxX: 0,
		minY: 0,
		maxY: 0,
		map: new Map(),
	};

	const coveredSet: Set<string> = new Set();
	coveredSet.add(tiles[0].id);

	puzzle.map.set([0, 0], tiles[0]);

	while (puzzle.map.size < tiles.length) {
		tiles.forEach((nextTile) => {
			puzzle.map.forEach((tile, coords) => {
				// console.log(nextTile.id, tile.id, coveredSet);
				// console.log(puzzle.map.size);
				if (!coveredSet.has(nextTile.id)) {
					// if (nextTile.id === '3079' && tile.id === '2311') {
					//   console.log('here');
					// }
					const match = matchesTile(tile, nextTile, coords);
					// if (nextTile.id === '3079' && tile.id === '2311') {
					//   console.log(nextTile, tile, match);
					// }
					if (match.matchCoords && match.tile) {
            // if (nextTile.id === '3079' && tile.id === '2311') {
            //   console.log(match.tile, tile, match);
            // }
						puzzle.map.set(match.matchCoords, match.tile);
            coveredSet.add(nextTile.id);
					}
				}
			});
		});
	}

	return puzzle;
}

function getCornerPeices(puzzle: Puzzle) {
  const allX = [];
  const allY = [];
  const corners: Tile[] = [];

  for (let coords of puzzle.map.keys()) {
    allX.push(coords[0]);
    allY.push(coords[1]);
  }

  const maxX = Math.max(...allX);
  const minX = Math.min(...allX);
  const maxY = Math.max(...allY);
  const minY = Math.min(...allY);

  console.log({ minX, minY, maxX, maxY });


  puzzle.map.forEach((tile, coords) => {
    if (coords[0] === minX && coords[1] === minY) {
      corners.push(tile);
    }
    if (coords[0] === maxX && coords[1] === minY) {
      corners.push(tile);
    }
    if (coords[0] === minX && coords[1] === maxY) {
      corners.push(tile);
    }
    if (coords[0] === maxX && coords[1] === maxY) {
      corners.push(tile);
    }
  })
  return corners;
}



inputAsArray('inputs/20.txt', '\n\n').then((tileStrings) => {
	// console.log(tileStrings.map(parseTile));
  const puzzle = arrangePuzzle(tileStrings);

  // console.log(puzzle);
  
  console.log(getCornerPeices(puzzle).reduce((acc, cur) => +cur.id * acc, 1));
});

type Puzzle = {
	minX: number;
	minY: number;
	maxX: number;
	maxY: number;
	map: Map<number[], Tile>;
};

type Tile = {
	id: string;
	top: string;
	left: string;
	right: string;
	bottom: string;
	str: string[];
};

function parseTile(tileString: string): Tile {
	const rows = tileString.split('\n');
	let left = '',
		right = '',
		i = 1;
	const lastElI = rows[1].length - 1;
	while (i < rows.length) {
		left += rows[i][0];
		right += rows[i][lastElI];
		i++;
	}
	return {
		id: rows[0].split(' ')[1].replace(':', ''),
		top: rows[1],
		left,
		right,
		bottom: rows[rows.length - 1],
		str: rows.filter((r, i) => i !== 0),
	};
}
