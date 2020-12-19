import { promises as fs } from 'fs';

function getNeighbors(x: number, y: number, z: number, w: number, map: string[][][]): string[] {
  let i, j, k, l;
  const neighbors = [];
  for (i = x - 1; i <= x + 1; i++) {
    for (j = y - 1; j <= y + 1; j++) {
      for (k = z - 1; k <= z + 1; k++) {
        for (l = w - 1; l <= w + 1; l++) {
        if (!(i === x && j === y && k === z && l === w)) {
          neighbors.push(map[l] && map[l][k] && map[l][k][j] && map[l][k][j][i] || '.')
        }
      }
    }
  }
}
  return neighbors;
};

function clone(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

function executeCycle(map: string[][][]) {
  let newMap = padMap(map);

  newMap = newMap.map((cube, w) =>
    cube.map((plane, z) => plane.map(
    (row, y) => {
      let x = 0;
      let newRowArr: string[] = row.split('');
      for (x = 0; x < row.length; x++) {
        const neighbors = getNeighbors(x,y,z, w, newMap);
        const activeNeighbors = neighbors.filter(n => n === '#').length;
        if (row[x] === '#') {
          if ([2,3].includes(activeNeighbors)){
            newRowArr[x] = '#';
          } else {
            newRowArr[x] = '.';
          }
        } else if (row[x] === '.') {
          if ([3].includes(activeNeighbors)){
            newRowArr[x] = '#';
          } else {
            newRowArr[x] = '.';
          }
        }
      }
      return newRowArr.join('');
    }
  )));
  return newMap;
}

function padMap(map: string[][][]) {
  const targetRowLength = map[0][0][0].length + 2;
  const targetColLength = map[0][0].length + 2;
  const targetCubeLength = map[0].length + 2;

  const emptyRow = ''.padEnd(targetRowLength, '.');
  const emptyPlane = new Array(targetColLength).fill(emptyRow);
  const emptyCube = new Array(targetCubeLength).fill(clone(emptyPlane));
  let newMap: string[][][] = [clone(emptyCube), ...map, clone(emptyCube)];
  newMap = newMap.map((cube) => {
		let newCube: string[][] = clone(cube);
		if (newCube.length < targetCubeLength) {
			newCube = [clone(emptyPlane), ...newCube, clone(emptyPlane)];
		}

		return newCube.map((plane) => {
			let newPlane = plane;
			if (plane.length < targetColLength) {
				newPlane = [emptyRow, ...plane, emptyRow];
			}
			return newPlane.map((row) => {
				if (row.length < targetRowLength) {
					return row.padEnd(targetRowLength - 1, '.').padStart(targetRowLength, '.');
				}
				return row;
			});
    });
  });
  return newMap;
}

fs.readFile('inputs/17.txt').then((buffer) => {
  const str = buffer.toString().split('\n');
  const map:string[][][] = [ [str] ];
  let i = 0;
  let newMap = map;
  while (i < 6) {
    newMap = executeCycle(newMap);
    i++;
  }
  let count = 0;
  newMap.forEach(cube => cube.forEach(
    plane => plane.map(row => {
      count += row.split('').filter(char => char === '#').length;
    })
  ));
  console.log('Part 2', count);
});
