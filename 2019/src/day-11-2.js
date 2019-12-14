const fs = require('fs');

const origIP = fs.readFileSync('../data/day-11-ip.txt').toString().split(',').map(parseFloat);

const { Computer } = require('./int-computer');

const DIRECTIONS = {
  UP: 0,
  DOWN: 180,
  LEFT: 270,
  RIGHT: 90,
}

drawImage(origIP);

function drawImage(program) {
  let map = runProgramOnPanels(program, 1);
  const matrix = getMatrix(map);
  const display = [' ', '█'];
  matrix.forEach(row => {
    console.log(row.map(num => display[num]).join(''));
  });
}

function getMatrix(map) {
  const xPosArr = [], yPosArr = [];
  [...map.keys()].forEach(pos => {
    const formattedPos = pos.split(',').map(parseFloat);
    xPosArr.push(formattedPos[0]);
    yPosArr.push(formattedPos[1]);
  });
  const minX = Math.min(...xPosArr);
  const maxX = Math.max(...xPosArr);
  const minY = Math.min(...yPosArr);
  const maxY = Math.max(...yPosArr);

  console.log( {minX, minY, maxX, maxY} );

  const matrix = [];
  const xOffset = 0 - minX;
  const yOffset = 0 - minY;

  let x = minX, y = minY;

  while (y <= maxY) {
    matrix[y + yOffset] = [];
    x = minX;
    while (x <= maxX) {
      const value = map.get(`${x},${y}`);
      matrix[y + yOffset][x + xOffset] = value || 0;
      x++;
    }
    y++;
  }

  return matrix;
}

function runProgramOnPanels(program) {
  const map = new Map();
  let currPos = [0,0];
  map.set('0,0', 1);
  let currDir = DIRECTIONS.UP;

  const robot = new Computer(program, []);

  while(!robot.completed) {
    let currColor = map.get(currPos.join(',')) || 0;
    robot.input.push(currColor);
    robot.run();
    const output = robot.output;
    map.set(currPos.join(','), output.shift());
    currDir = determineNextDir(currDir, output.shift());
    currPos = determineNextPos(currPos, currDir);
  }
  return map;
}

function determineNextPos([ ...pos ], dir) {
  if (dir === DIRECTIONS.UP) {
    pos[1] = pos[1] - 1;
  } else if (dir === DIRECTIONS.DOWN) {
    pos[1] = pos[1] + 1;
  } else if (dir === DIRECTIONS.LEFT) {
    pos[0] = pos[0] - 1;
  } else if (dir === DIRECTIONS.RIGHT) {
    pos[0] = pos[0] + 1;
  } else {
    console.log('ERR: unknown direction', pos);
    return;
  }
  return pos;
}

function determineNextDir(dir, ip) {
  if (ip === 0) {
    dir += 270;
  } else if (ip === 1) {
    dir += 90;
  } else {
    console.log('ERR: Unknown Turn', dir);
  }
  return dir % 360;
}