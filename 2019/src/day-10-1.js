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
        const slope = Math.atan2((y2 - y), (x2 - x));
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



