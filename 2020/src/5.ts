import { inputAsArray } from './utils/util';

function binarySearch(
  searchString: string,
  min: number,
  max: number,
  lowCode: string,
  highCode: string,
): number {
  if (min === max) {
    return min;
  }
  let newMin = min, newMax = max;
  if (searchString[0] === lowCode) {
    newMax = Math.floor((min + max)/2);
  } else {
    newMin = Math.ceil((min + max)/2);
  }
  return binarySearch(
    searchString.substring(1),
    newMin,
    newMax,
    lowCode,
    highCode,
  );
}

function getRow(code: string): number {
  const result = binarySearch(
    code,
    0,
    127,
    'F',
    'B'
  );
  return result;
}

function getColumn(code: string): number {
  const result = binarySearch(
    code,
    0,
    7,
    'L',
    'R'
  );
  return result;
}

function getId(row: number, column: number): number {
  return row * 8 + column;
}

function sortMatrix(matrix: {row: number, column: number}[]) {
  matrix.sort((seat1, seat2) => {
    return seat1.column - seat2.column;
  });
  matrix.sort((seat1, seat2) => {
    return seat1.row - seat2.row;
  });
  return matrix;
}

function findMissing(matrix: {row: number, column: number}[]): {
  row: number,
  column: number,
} {
  let start = matrix[0].row;
  const maxRow = matrix[matrix.length - 1].row;
  let iCol = 0;
  for (let iRow = 0; iRow <= maxRow; iRow++) {
    iCol = 0;
    for (iCol = 0; iCol <= 7; iCol++) {
      const seat = matrix[iRow * 8 + iCol];
      if (seat.row !== (start + iRow) || seat.column !== iCol) {
        return ({
          row: iRow + start,
          column: iCol,
        });
      }
    }
  }
}

inputAsArray('inputs/5.txt').then(arr => {
  const matrix = arr.map(seat => {
    return {
      row: getRow(seat.substring(0, 7)),
      column: getColumn(seat.substring(7)),
    }
  });
  console.log('Part 1', Math.max(...matrix.map(seat => getId(seat.row, seat.column))));
  sortMatrix(matrix);
  const missing = findMissing(matrix);
  console.log('Part 2', getId(missing.row, missing.column));
});
