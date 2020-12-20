
import { inputAsArray } from './utils/util';

type Puzzle = {
	minX: number;
	minY: number;
	maxX: number;
	maxY: number;
	map: Map<string, Tile>;
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

function flipImageHorizontal(image: string[]) {
	return image.map(row => row.split('').reverse().join(''));
}

function flipImageVertical(image: string[]) {
	return image.map((_, i) => image[image.length - i - 1]);
}

function rotateImage90Clockwise(image: string[]) {
	const newStr: string[][] = [];
	let x = 0, y = 0;
	while (x < image.length) {
		const row = image[x];
		y = 0;
		newStr[x] = [];
		while (y < row.length) {
			newStr[x][y] = image[image.length - y - 1][x];
			y++;
		}
		x++;
	}
	return newStr.map(row => row.join(''));
}

function rotate90Clockwise(tile: Tile) {
	return {
		id: tile.id,
		top: tile.left.split('').reverse().join(''),
		right: tile.top,
		bottom: tile.right.split('').reverse().join(''),
		left: tile.bottom,
		str: rotateImage90Clockwise(tile.str),
	};
}

function flipHorizontal(tile: Tile) {
	return {
		id: tile.id,
		top: tile.top.split('').reverse().join(''),
		right: tile.left,
		bottom: tile.bottom.split('').reverse().join(''),
		left: tile.right,
		str: tile.str.map(row => row.split('').reverse().join('')),
	};
}

function flipVertical(tile: Tile) {
	return {
		id: tile.id,
		top: tile.bottom,
		right: tile.right.split('').reverse().join(''),
		bottom: tile.top,
		left: tile.left.split('').reverse().join(''),
		str: tile.str.map((_, i) => tile.str[tile.str.length - i - 1]),
	};
}

function matchesTile(curTile: Tile, nextTile: Tile, curTileCoords: number[]) {
	let angle = 0;
	let rotatedTile = nextTile;
	let matchCoords: number[] | undefined;
	let matchTile: Tile | undefined;
	while (angle <= 270) {
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

	puzzle.map.set(JSON.stringify([0, 0]), tiles[0]);

	while (puzzle.map.size < tiles.length) {
		tiles.forEach((nextTile) => {
			puzzle.map.forEach((tile, coords) => {
				if (!coveredSet.has(nextTile.id)) {
					const match = matchesTile(tile, nextTile, JSON.parse(coords));
					if (match.matchCoords && match.tile) {
						puzzle.map.set(JSON.stringify(match.matchCoords), match.tile);
            coveredSet.add(nextTile.id);
					}
				}
			});
		});
	}

	return puzzle;
}

function ripOutBorders(tile: Tile): Tile {
	const newTile = { ...tile };
	newTile.str = tile.str.filter((row, i) => {
		return ![0, tile.str.length - 1].includes(i);
	}).map((row => row.substring(1, tile.str.length - 1)));
	return newTile;
}

function drawPuzzle(puzzle: Puzzle): string[] {
	const allX = [];
  const allY = [];

  for (let coordsStr of puzzle.map.keys()) {
		const coords: number[] = JSON.parse(coordsStr);
    allX.push(coords[0]);
		allY.push(coords[1]);
		puzzle.map.set(coordsStr, ripOutBorders(puzzle.map.get(coordsStr) as Tile))
	}

	const tileHeight = 8;

  const maxX = Math.max(...allX);
  const minX = Math.min(...allX);
  const maxY = Math.max(...allY);
	const minY = Math.min(...allY);
	
	let tileX = minX, tileY = minY;

	let image: string[] = [];

	while(tileX <= maxX) {
		tileY = minY;
		while (tileY <= maxY) {
			const tile = puzzle.map.get(JSON.stringify([tileX, tileY])) as Tile;
			tile.str.forEach((row, rowI) => {
				const imageRowI = (tileY - minY) * tileHeight + rowI;
				const imageRow = image[imageRowI];
				if (!imageRow) {
					image[imageRowI] = '';
				}
				image[imageRowI] += row;
			});
			tileY++;
		}
		tileX++;
	}

	return image;

}

function findSeaMonsters(image: string[], seaMonsterPattern: number[][]) {
	let x = 0, y = 0;
	let seaMonsters = 0;

	while (y < image.length) {
		x = 0;
		while (x < image[0].length) {
			const matches = seaMonsterPattern.every(pixel => {
				const row = image[y + pixel[1]];
				if (!row) {
					return false;
				}
				return row[x + pixel[0]] === '#';
			});
			if (matches) {
				seaMonsters++;
			}
			x++;
		}
		y++;
	}

	return seaMonsters;
}

function getCornerPeices(puzzle: Puzzle) {
  const allX = [];
  const allY = [];
  const corners: Tile[] = [];

  for (let coordsStr of puzzle.map.keys()) {
		const coords = JSON.parse(coordsStr);
    allX.push(coords[0]);
    allY.push(coords[1]);
  }

  const maxX = Math.max(...allX);
  const minX = Math.min(...allX);
  const maxY = Math.max(...allY);
  const minY = Math.min(...allY);

  puzzle.map.forEach((tile, coordsStr) => {
		const coords = JSON.parse(coordsStr);
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

function part1(puzzle: Puzzle) {
	return getCornerPeices(puzzle).reduce((acc, cur) => +cur.id * acc, 1)
}

function part2(seaMonsterStr: string, puzzle: Puzzle) {
	const seaMonsterPattern: number[][] = [];

	seaMonsterStr.split('\n').forEach((row, y) => {
		row.split('').forEach((char, x) => {
			if (char === '#') {
				seaMonsterPattern.push([x, y]);
			}
		});
	});

	let image = drawPuzzle(puzzle);

	let angle = 0;
	let rotatedImage = image;
	let seaMonsters = 0;
	
	while (angle <= 270) {
		const found = [
			rotatedImage,
			flipImageHorizontal(rotatedImage),
			flipImageVertical(rotatedImage)
		].some((fuckingImage) => {
			seaMonsters = findSeaMonsters(fuckingImage, seaMonsterPattern);
			return seaMonsters;
		});
		if (!found) {
			angle+=90;
			rotatedImage = rotateImage90Clockwise(rotatedImage);
		} else {
			angle = Infinity;
		}
	}


	const hashes = image.reduce((acc, cur) => {
		return acc + cur.split('').filter(el => el === '#').length;
	}, 0);

	return hashes - seaMonsterPattern.length * seaMonsters;
}


inputAsArray('inputs/20.txt', '\n\n').then((tileStrings) => {
	const seaMonsterStr = 
`                  # 
#    ##    ##    ###
 #  #  #  #  #  #   `;
	const puzzle = arrangePuzzle(tileStrings);

	console.log('Part 1', part1(puzzle));
	console.log('Part 2', part2(seaMonsterStr, puzzle));
});
