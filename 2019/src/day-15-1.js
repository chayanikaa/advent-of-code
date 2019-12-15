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

const drawingMap = ['#', '.', 'X', 'U'];

const map = new Map();
const { oxygenPosition } = findOxygenPosition(map);
console.log(oxygenPosition);
drawMap(map);
  // console.log(oxygenPosition, i);
// const shortestPath = calculateMaxDistance({ map, source: oxygenPosition });
// console.log(shortestPath);

function calculateFewestSteps({ map, destination, source, distancesMap = new Map() }) {
  const unvisitedSet = new Set(map.keys());
  if (!distancesMap.size) {
    map.forEach((_, key) => {
      distancesMap.set(`${source.join(',')},${key}`, Infinity);
    });
    distancesMap.set(`${source.join(',')},${source.join(',')}`, 0);
  }
  // console.log({ distancesMap });

  let currentNode = source;
  const toVisit = [ currentNode ];
  // while (unvisitedSet.has(destination.join(',')) && toVisit.length) {
  while (currentNode = toVisit.shift()) {
    const neighbors = getNeighbors(map, currentNode);
    // console.log({ neighbors, unvisitedSet });
    unvisitedSet.delete(currentNode.join(','));
    neighbors.forEach(neighbor => {
      if (!unvisitedSet.has(neighbor.join(','))) {
        return;
      }
      const sourceToNeighborKey = `${source.join(',')},${neighbor.join(',')}`;
      const currentToNeighborKey = `${currentNode.join(',')},${neighbor.join(',')}`;
      const sourceToCurrentKey = `${source.join(',')},${currentNode.join(',')}`;
      distancesMap.set(currentToNeighborKey, 1);
      distancesMap.set(sourceToNeighborKey, distancesMap.get(sourceToNeighborKey) || Infinity);
      const distance = Math.min(
        distancesMap.get(sourceToNeighborKey),
        distancesMap.get(sourceToCurrentKey) +
        distancesMap.get(currentToNeighborKey)
      );
      // console.log(distancesMap.get(sourceToNeighborKey), distancesMap.get(sourceToCurrentKey), distancesMap.get(currentToNeighborKey));
      // console.log({ currentNode, neighbor, distance });
      distancesMap.set(sourceToNeighborKey, distance);
      // const distance = calculateFewestSteps({ map, destination: neighbor});
      toVisit.push(neighbor);
    });
    // console.log('source to current', distancesMap.get(`${source.join(',')},${currentNode.join(',')}`));
    // console.log({ currentNode, toVisit });
  }
  //console.log(distancesMap);
  return distancesMap.get(`${source.join(',')},${destination.join(',')}`);
}

function getNeighbors(map, currentPos) {
  // only empty spaces are nodes
  const positions = Object.values(DIRECTIONS).map(dir => getNextPosition({ currentPos, dir }));
  return positions.filter(position => map.get(position.join(',')));
}


function findOxygenPosition(map = new Map()) {
  let currentPos = [0,0];
  let nextPos;
  let currentDir = DIRECTIONS.NORTH;
  const computer = new Computer(program, []);
  let response;
  let i = 0;
  let xRange = 1, yRange = 1;
  let minX = 0, minY = 0, maxX = 0, maxY = 0;
  // while (/*response !== 2 */!computer.completed) {
  
  while (map.size < (xRange * yRange)) {
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
    // console.log({ response, currentDir, currentPos });
    minX = Math.min(minX, nextPos[0]);
    minY = Math.min(minY, nextPos[1]);
    maxX = Math.max(maxX, nextPos[0]);
    maxY = Math.max(maxY, nextPos[1]);
    xRange = maxX - minX + 1;
    yRange = maxY - minY + 1;
    console.log({ xRange, yRange, mapSize: map.size });
    i++;
  }
  //drawMap(map, currentPos);
  return { oxygenPosition: currentPos, map, i };
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

function drawMap(map) {
  const matrix = getMatrix(map, 3);
  matrix.forEach((row,y)=> console.log(
    row.map(code => drawingMap[code]
    ).join('')));
}


