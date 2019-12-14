const fs = require('fs');

const ip = fs.readFileSync('./day-3-ip.txt').toString().split('\n');

// const ip = [`R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51`,
// `U98,R91,D20,R16,D67,R40,U7,R15,U6,R7`];

const paths = ip.map(path => path.split(','));

// console.log(paths[1]);

const coveredCoordinates = paths.map(path => {
  const coords = [[0,0]];
  path.forEach(move => {
    const dir = move[0];
    const dis = parseFloat(move.substring(1));
    let i = 1;
    const lastCoord = coords[coords.length - 1];
    // console.log({dir, dis});
    if (dir === 'L') {
      while(i <= dis) {
        coords.push([lastCoord[0] - i, lastCoord[1]]);
        i++;
      }
    }
    if (dir === 'R') {
      while(i <= dis) {
        coords.push([lastCoord[0] + i, lastCoord[1]]);
        i++;
      }
    }
    if (dir === 'U') {
      while(i <= dis) {
        coords.push([lastCoord[0], lastCoord[1] + i]);
        i++;
      }
    }
    if (dir === 'D') {
      while(i <= dis) {
        coords.push([lastCoord[0], lastCoord[1] - i]);
        i++;
      }
    }
  });
  return coords;
});

let intersections = [];

coveredCoordinates[0].forEach((coord, i) => {
  const intersection = coveredCoordinates[1].find(coord1 => coord1[0] === coord[0] && coord1[1] === coord[1]);
  intersection && intersections.push(intersection);
});

intersections = intersections.filter(inter => !(inter[0] === 0 && inter[1] === 0));

// const distances = intersections.map(inter => Math.sqrt(inter[0] ** 2 + inter[1] ** 2));

const distances = intersections.map(inter => Math.abs(inter[0]) + Math.abs(inter[1]));

// const resultPoint = intersections[distances.indexOf(Math.min(...distances))];

// const manhattenDistance = resultPoint[0] + resultPoint[1];

console.log(Math.min(...distances));