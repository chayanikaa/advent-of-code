const fs = require('fs');
const program = fs.readFileSync('../data/day-17-ip.txt').toString().split(',').map(Number);

const { Computer } = require('./int-computer');

const ASCII_MAP = {
 '\n': 10,
 '#': 35,
 '.': 46,
 '^': 94,
 'v': 118,
 '<': 60,
'>': 62,
'@': 64,
};

const ASCII_MAP_INVERSE = Object.fromEntries(
  Object.entries(ASCII_MAP).map(([key, value]) => [value, key])
);

const computer = new Computer(program, []);

computer.run();

const output = computer.output;

const rowLength = output.indexOf(ASCII_MAP['\n']) + 1;
let matrix = splitArray(output, rowLength);


let currPos = getStartingPos(matrix);
let currDir = 0;
let moveCounter = 0;

matrix = restoreMatrix(matrix);

const path = [];

let turn;

while (turn !== 'exit') {
  turn = getTurn({ pos: currPos, matrix, currDir });
  if (!turn) {
    moveCounter++;
    currPos = getNextPos({ pos: currPos, dir: currDir });
    matrix[currPos.y][currPos.x] = ASCII_MAP['@'];
  } else if (turn !== 'exit'){
    path.push(moveCounter);
    moveCounter = 0;
    path.push(turn);
    currDir = getNewDir({ dir: currDir, turn });
  }
  if (turn === 'exit') {
    path.push(moveCounter);
  }
  drawMatrix(matrix);
}

let strPath =  path.join(',');
strPath = strPath.replace(/L,4,L,4,L,6,R,10,L,6/g, 'A');
strPath = strPath.replace(/L,12,L,6,R,10,L,6/g, 'B');
strPath = strPath.replace(/R,8,R,10,L,6/g, 'C');

console.log('Main instruction: ', strPath);

function getTurn({ pos, matrix, currDir }) {
  if (isNextCharALedge({dir: currDir, pos, matrix})) {
    return;
  }
  if (isNextCharALedge({
    dir: getNewDir({ dir: currDir, turn: 'R' }),
    matrix,
    pos
  })) {
    return 'R';
  }
  if (isNextCharALedge({
    dir: getNewDir({ dir: currDir, turn: 'L' }),
    matrix,
    pos
  })) {
    return 'L';
  }
  return 'exit';
}

function isNextCharALedge({dir, pos, matrix}) {
  const char = getCharAt({
    pos: getNextPos({ pos, dir }),
    matrix
  });
  return char === ASCII_MAP['#'] || char === ASCII_MAP['@'];
}

function getNewDir({ dir, turn }) {
  if (turn === 'L') {
    dir += 270;
  } else if (turn === 'R') {
    dir += 90;
  } else {
    console.log('ERR: Unknown Turn', dir);
  }
  return dir % 360;
}

function getCharAt({ pos, matrix }) {
  return matrix[pos.y] && matrix[pos.y][pos.x];
}

function getNextPos({ pos, dir }) {
  const newPos = { ...pos };
  if (dir === 0) {
    newPos.y--;
  } else if (dir === 90) {
    newPos.x++;
  } else if (dir === 180) {
    newPos.y++;
  } else if (dir === 270) {
    newPos.x--;
  }
  return newPos;
}

function getStartingPos(matrix) {
  let x, y;
  y = matrix.findIndex(row => {
    x = row.indexOf(ASCII_MAP['^']);
    return x !== -1;
  });
  return {x, y};
}

function restoreMatrix(matrix) {
  return matrix.map(row => row.map(
    el => el === ASCII_MAP['.'] ? ASCII_MAP['.'] : ASCII_MAP['#']
  ));
}

function splitArray(array, chunk) {
  var i, j;
  let arrays = [];
  for (i=0,j=array.length; i<j; i+=chunk) {
      arrays.push(array.slice(i,i+chunk));
      // do whatever
  }
  arrays = arrays
    .map(row => row.filter(el => el !== ASCII_MAP['\n']))
    .filter(row => row.length);
  return arrays;
}

function drawMatrix(matrix) {
  matrix.forEach(row =>
    console.log(row.map(el => ASCII_MAP_INVERSE[el]).join(''))
  );
}
