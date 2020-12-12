import { inputAsArray } from './utils/util';

enum SeatState {
  empty = 'L',
  floor = '.',
  occupied = '#',
}

const seeingIncrementers = [
  [ -1, -1 ],
  [ -1, 0 ],
  [ -1, +1 ],
  [ 0, -1 ],
  [ 0, +1 ],
  [ +1, -1 ],
  [ +1, 0 ],
  [ +1, +1 ],
];

function isVisibleSeatOccupied(
  map: string[],
  row: number,
  col: number,
  rowIncrement: number,
  colIncrement: number,
  maxTimes = Infinity,
): boolean {
  let seeingSeat;
  let currRow = row,
    currCol = col;
  let i = 0;
  do {
    currRow = currRow + rowIncrement;
    currCol = currCol + colIncrement;
    seeingSeat = map[currRow] ? map[currRow][currCol] : undefined;
    i++;
  } while (seeingSeat === SeatState.floor && i <= maxTimes);
  if (seeingSeat === SeatState.occupied) {
    return true;
  }
  return false;
}

function simulateRound(map: string[], maxAdjacentOcc: number, onlyAdjacent = false): {
  newMap: string[],
  positionChanges: number,
} {
  let positionChanges = 0;
  const newMap = map.map((row, rowI) => {
    return row.split('').map((val, colI) => {
      if (val === SeatState.floor) {
        return val;
      }
      const seeingOccupied = seeingIncrementers.map(
        incrementers => {
          return isVisibleSeatOccupied(
            map,
            rowI,
            colI,
            incrementers[0],
            incrementers[1],
            onlyAdjacent ? 1 : Infinity,
          );
        }
      ).filter(occ => occ).length;
      if (val === SeatState.empty) {
        if (seeingOccupied === 0) {
          positionChanges+=1;
          return SeatState.occupied;
        }
      }
      if (val === SeatState.occupied) {
        if (seeingOccupied >= maxAdjacentOcc) {
          positionChanges+=1;
          return SeatState.empty;
        }
      }
      return val;
    }).join('');
  });
  return {
    newMap,
    positionChanges,
  }
}

function countOccupied(map: string[]): number {
  let occupied = 0;
  map.forEach((row) => {
    return row.split('').forEach((val) => {
      if (val === SeatState.occupied) {
        occupied++;
      }
    });
  });
  return occupied;
}

function simulateTillStabilize(map: string[], maxAdjacentOcc = 5, onlyAdjacent = false): number {
  let simulateResult = {
    newMap: map,
    positionChanges: 0,
  };
  do {
    simulateResult = simulateRound(simulateResult.newMap, maxAdjacentOcc, onlyAdjacent);
  } while (simulateResult.positionChanges !== 0)
  return countOccupied(simulateResult.newMap);
}


inputAsArray('inputs/11.txt').then(inputs => {
  console.time();
  console.log('Part 1', simulateTillStabilize(inputs, 4, true));
  console.timeEnd();
  console.time();
  console.log('Part 2', simulateTillStabilize(inputs));
  console.timeEnd();
});