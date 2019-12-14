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

calculateTargetOrder(11, 13);

function calculateTargetOrder(x, y) {
  let slopes = mapData.map(
    (row, y2) => row.map(
      (point, x2) => {
        if (point === '.') {
          return;
        }
        if (y2 === y && x2 === x) {
          return 'invalid';
        }
        let slope = - Math.atan2((x2 - x), (y2 - y));
        return slope;
      }
    )
  )

    const visited = {};
    slopes.forEach((slopeRow, y1) => 
      slopeRow.forEach((slope, x1) => {
        if (!visited[slope]) { visited[slope] = [] }
        visited[slope].push([ x1, y1 ]);
    }));
    const visitedArray = Object.entries(visited)
                          .filter(([angle]) => angle !== 'undefined' && angle !== 'invalid')
                          .sort(([angle1], [angle2]) => {
                            return parseFloat(angle1) - parseFloat(angle2);
                          });

    const sortedVisitedArray = visitedArray.map(([, points]) => {
      points.sort((p1, p2) => calcDistance(p1, [ x, y ]) - calcDistance(p2, [ x, y ]));
      return points;
    });
    let i = 0, targets = [], currAngleIndex = 0;
    const totalAsteroids = sortedVisitedArray.flat().length;
    while (i < totalAsteroids) {
      const currAngleArray = sortedVisitedArray[currAngleIndex % sortedVisitedArray.length];
      if (currAngleArray.length) {
        targets.push(currAngleArray.shift());
        // console.log({ target });
        i++;
      }
      currAngleIndex++;
    }
    console.log(0, targets[0]);
    console.log(1, targets[1]);
    console.log(2, targets[2]);
    console.log(9, targets[9]);
    console.log(19, targets[19]);
    console.log(49, targets[49]);
    console.log(99, targets[99]);
    console.log(198, targets[198]);
    console.log(199, targets[199]);
}

function calcDistance([x1, y1], [ x, y ]) {
  return ((x1 - x) ** 2 + (y1 - y) ** 2);
}
