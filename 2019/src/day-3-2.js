const fs = require('fs');

const ip = fs.readFileSync('../data/day-3-ip.txt').toString().split('\n');

// const ip = [`R75,D30,R83,U83,L12,D49,R71,U7,L72`,
// `U62,R66,U55,R34,D71,R55,D58,R83`];

const paths = ip.map(path => path.split(','));

// console.log(paths[1]);

const coveredCoordinates = paths.map(path => {
  const coords = [[0, 0, 0]];
  path.forEach(move => {
    const dir = move[0];
    const dis = parseFloat(move.substring(1));
    let i = 1;
    const lastCoord = coords[coords.length - 1];
    // console.log({dir, dis});
    if (dir === 'L') {
      while(i <= dis) {
        coords.push([lastCoord[0] - i, lastCoord[1], lastCoord[2] + i]);
        i++;
      }
    }
    if (dir === 'R') {
      while(i <= dis) {
        coords.push([lastCoord[0] + i, lastCoord[1], lastCoord[2] + i]);
        i++;
      }
    }
    if (dir === 'U') {
      while(i <= dis) {
        coords.push([lastCoord[0], lastCoord[1] + i, lastCoord[2] + i]);
        i++;
      }
    }
    if (dir === 'D') {
      while(i <= dis) {
        coords.push([lastCoord[0], lastCoord[1] - i, lastCoord[2] + i]);
        i++;
      }
    }
  });
  // console.log(coords)
  return coords;
});

let intersections = [];

coveredCoordinates[0].forEach((coord, i) => {
  const intersection = coveredCoordinates[1].find(coord1 => coord1[0] === coord[0] && coord1[1] === coord[1]);
  intersection && intersections.push([ ...coord, intersection[2] ]);
});

intersections = intersections.filter(inter => !(inter[0] === 0 && inter[1] === 0));

console.log({ intersections });

// const distances = intersections.map(inter => Math.sqrt(inter[0] ** 2 + inter[1] ** 2));

const distances = intersections.map(inter => inter[2] + inter[3]);

// const resultPoint = intersections[distances.indexOf(Math.min(...distances))];

// const manhattenDistance = resultPoint[0] + resultPoint[1];

console.log(Math.min(...distances));