const fs = require('fs');
const program = fs.readFileSync('../data/day-15-ip.txt').toString().split(',').map(Number);

const { getMatrix } = require('./map');

const { Computer } = require('./int-computer');

const DIRECTIONS = {
 NORTH: 1,
 SOUTH: 2,
 WEST: 3,
 EAST: 4,
};

const RESPONSE_CODES = {
  WALL_FAIL: 0,
  EMPTY_SUCCESS: 1,
  OXYGEN_SUCCESS: 2
};

const drawingMap = ['#', '.', 'X'];

const oxygenPosition = findOxygenPosition();
const shortestPath = calculateFewestSteps();

function calculateFewestSteps() {}

function findOxygenPosition() {
  const map = new Map();
  let currentPos = [0,0];
  let nextPos;
  let currentDir = DIRECTIONS.NORTH;
  const computer = new Computer(program, []);
  let response;
  while (response !== 2 && !computer.completed) {
  // let i = 0;
  // while (i < 5) {
    computer.input.push(currentDir);
    computer.run();
    response = computer.output.shift();
    
    nextPos = getNextPosition({ currentPos, dir: currentDir});
    // console.log({ response, nextPos });
    if (response !== RESPONSE_CODES.WALL_FAIL) {
      currentPos = nextPos;
    }
    
    map.set(nextPos.join(','), response);
    currentDir = getNextDirection({ map, currentPos, currentDir });
    console.log({ response, currentDir, currentPos });
    
    // i++;
  }
  drawMap(map, currentPos);
  return currentPos;
}

function getNextDirection({ map, currentPos, currentDir }) {
  // return currentDir;
  const currX = currentPos;
  let selected;
  const possibleDirs = Object.values(DIRECTIONS).filter(dir => {
    let nextPos = getNextPosition({ currentPos, dir });
    const code = map.get(nextPos.join(','));
    if (code == null || code === 1) {
      return true;
    }
  });
  return possibleDirs[Math.floor(Math.random() * possibleDirs.length - Number.EPSILON)];

  // let wallDistances = {};
  // Object.values(DIRECTIONS).forEach(dir => {
  //   let wallDistance = 0;
  //   let nextPos = currentPos;
  //   while (true) {
  //     nextPos = getNextPosition({ currentPos: nextPos, dir});
  //     if (map.get(nextPos.join(',')) === undefined) {
  //       wallDistance = Infinity;
  //       break;
  //     } else if (map.get(nextPos.join(',')) === RESPONSE_CODES.WALL_FAIL) {
  //       break;
  //     } else {
  //       wallDistance++;
  //     }
  //   }

  //   wallDistances[dir] = wallDistance;
  // });
  // console.log({ wallDistances });
  // const maxDistance = Math.max(...Object.values(wallDistances));
  // return Number(Object.keys(wallDistances).find(key => wallDistances[key] === maxDistance));
}

function getNextPosition({ currentPos, dir }) {
  const nextPos = [ ...currentPos ];
  if (dir === DIRECTIONS.NORTH) {
    nextPos[1]--;
  } else if (dir === DIRECTIONS.SOUTH) {
    nextPos[1]++;
  } else if (dir === DIRECTIONS.WEST) {
    nextPos[0]--;
  } else if (dir === DIRECTIONS.EAST) {
    nextPos[0]++;
  } else {
    console.log('UNKNOWN DIRECTION');
  }
  return nextPos;
}

function drawMap(map, currentPos) {
  const matrix = getMatrix(map);
  matrix.forEach((row,y)=> console.log(
    row.map((code,x) => x === currentPos[0] && y === currentPos[1] ? 'D' :
      drawingMap[code]
    ).join('')));
}


