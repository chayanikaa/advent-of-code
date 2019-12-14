const fs = require('fs');

// const mapData = fs.readFileSync('./day-8-ip.txt').toString();

// let mapData = 
// `.#..#
// .....
// #####
// ....#
// ...##`.split('');

let mapData = `...###.#########.####
.######.###.###.##...
####.########.#####.#
########.####.##.###.
####..#.####.#.#.##..
#.################.##
..######.##.##.#####.
#.####.#####.###.#.##
#####.#########.#####
#####.##..##..#.#####
##.######....########
.#######.#.#########.
.#.##.#.#.#.##.###.##
######...####.#.#.###
###############.#.###
#.#####.##..###.##.#.
##..##..###.#.#######
#..#..########.#.##..
#.#.######.##.##...##
.#.##.#####.#..#####.
#.#.##########..#.##.`;

const transformedMapData = [[]];
let i = 0;
while (i < mapData.length) {
  if (mapData[i] === '\n') {
    transformedMapData.push([]);
  } else {
    transformedMapData[transformedMapData.length - 1].push(mapData[i]);
  }
  i++;
}
mapData = transformedMapData;

const nAsteroids = mapData.map(calcAsteroidsForRow).flat();

console.log('max', Math.max(...nAsteroids));

function calcAsteroidsForRow(row, y) {
  return row.map((point, x) => {
    if (point === '#') {
      return calcNAsteroidsForPos(x, y);
    } return 0;
  });
}

function calcNAsteroidsForPos(x, y) {
  let slopes = mapData.map(
    (row, y2) => row.map(
      (point, x2) => {
        if (point === '.') {
          return;
        }
        if (y2 === y && x2 === x) {
          return 'invalid';
        }
        //   return x2 > x ? Infinity : -Infinity;
        // }
        // if (y2 < y && x === x2) {
        //   return 'minusZero';
        // }
        // return Math.cos() + Math.sin();
        // const slope = 1 / Math.tan((y2 - y)/(x2 - x));
        const slope = Math.atan2((y2 - y), (x2 - x));
        // if (y2 < y && x2 - x) {
        //   return 0 - slope;
        // }
        return slope;
      }
    )
  )
    const visited = {};
    slopes.forEach((slopeRow, y1) => slopeRow.forEach((slope, x1) => {
      if (!visited[slope]) {visited[slope] = []}
      visited[slope].push([x1, y1]);
    }));
  slopes = slopes.flat().filter(slope => slope != null && slope !== 'invalid' );
  // console.log(new Set(slopes).size);
  if (new Set(slopes).size === 227) {
    console.log({x, y});
  }
  return new Set(slopes).size;
}





// mapData.flatMap((row, y2) => {})


// console.log(mapData);

// const nAsteroids = mapData.map((point, i) );

// function calcAsteroidsForPos(map) {
//   map.map(function(point, i) {
//     if (point === '\n') {
//       return '\n';
//     }
//     if (point === '#') {
//       return '#';
//     }
//     if (point === ' ') {
//       return 
//     }
//     return calcNAsteroidsSpace(map, i);
//   });
// }

// function calcNAsteroidsSpace(map, pos) {
//   let i = 0;
//   while(i < map.length) {
//     if (i)
//   }
// }

function createRay(start) {}