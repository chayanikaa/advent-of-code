const fs = require('fs');

const origIP = fs.readFileSync('./day-11-ip.txt').toString().split(',').map(parseFloat);

const { Computer } = require('./int-computer');

const DIRECTIONS = {
  UP: 0,
  DOWN: 180,
  LEFT: 270,
  RIGHT: 90,
}

drawImage(origIP);

function drawImage(program) {
  let map = runProgramOnPanels(program);
  map = runProgramOnPanels(program, 1);
  console.log('map size', map.size);
  const matrix = getMatrix(map);
  const display = [' ', '\u2591\u2591'];
  // const display = ['.', '#'];
  matrix.forEach(row => {
    console.log(row.map(num => display[num] || ' ').reverse().join(''));
  });
}

function getMatrix(map) {
  // console.log(map);
  const xPosArr = [], yPosArr = [];
  [...map.keys()].forEach(pos => {
    const formattedPos = pos.split(',').map(parseFloat);
    // console.log({ pos, formattedPos });
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
  // console.log({ xOffset, yOffset });

  let x = minX, y = minY;

  while (y <= maxY) {
    matrix[y + yOffset] = [];
    x = minX;
    while (x <= maxX) {
      const value = map.get(`${x},${y}`);
      matrix[y + yOffset].push(value ? value : 0);
      x++;
    }
    y++;
  }
  console.log(matrix.length);
  console.log(matrix[0].length);

  return matrix;

  // console.log(matrix);
}

function runProgramOnPanels(program, firstPanel = 0) {
  const map = new Map();
  let currPos = [0,0];
  map.set('0,0', firstPanel);
  let currDir = DIRECTIONS.UP;

  const robot = new Computer(program, []);

  while(!robot.completed) {
    let currColor = map.get(currPos.join(','));
    
    currColor = currColor == null ? 0 : currColor;
    // console.log(currPos, currColor);
    robot.input.push(currColor);
    robot.run();
    map.set(currPos.join(','), robot.output.shift());
    currDir = determineNextDir(currDir, robot.output.shift());
    currPos = determineNextPos(currPos, currDir);
    // console.log({ currDir, currPos });
  }
  console.log(map.get('0,0'));
  console.log('map size', map.size);
  return map;
  // console.log(map);

  // return map.size;
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