// let map = 
// `#####################################
// #####...#########...#############...#
// #####.#.###########.#############.#.#
// ###...#.###########.#############.#.#
// ###.###.###########.#############.#.#
// #...#.#.............#############.#.#
// #.###.###########################.#.#
// #...#...#.......###########.....#.#.#
// ###.#.#.#.#####.###########.###.#.#.#
// #...#.#...#...#.###########...#...#.#
// #.###.#####.###.#############.#####.#
// #.#.....#...#...##............#...#.#
// #.#####.#.#.#.#############.###.#.#.#
// #.....#.#.#.#.#####.......#.....#O#.#
// #####.#.#.#.#.#####.#####.#########.#
// #####...#.#...#.....#####...#...#...#
// #########.#####.###########.#.#.#.###
// #######...#...#.....#######...#.#...#
// #######.###.#.#####.###########.###.#
// #######.....#.......#####...........#
// #####################################`;

let map = 
`#########################################
#.....#.....#...#.............#.........#
###.#.###.#.#.#.#.#####.#####.###.#####.#
#...#...#.#...#.#.#...#.#.....#...#.....#
#.#####.#.#.#####.#.#.#.#.#####.###.#####
#.#...#...#.#...#...#.#.#.....#...#.#...#
#.#.#.#######.#.#####.#.#####.###.#.###.#
#...#.........#.......#.....#.....#...#.#
#.#########################.#########.#.#
#...#.....#.....#.#.......#...#...#...#.#
###.#.###.#.###.#.#.#####.###.#.#.#.###.#
#...#...#...#.#...#.#...#...#.#.#...#...#
#.#####.#####.###.#.###.###.#.#.#######.#
#.......#...#.....#...#.......#...#.....#
#########.#.#.#######.###.#######.###.###
#...#.....#.#.#...#.#...#.#.....#...#...#
#.###.#####.#.#.#.#.###.###.###.###.###.#
#.....#.#...#...#.....#.....#.#.#.......#
#.#####.#.###########.#######.#.#######.#
#.#.....#.........#.......#...#.....#...#
#.#.###.#####.#.###.#####.###.#####.#####
#...#...#...#.#.#...#...#.........#.#...#
#####.###.#.#.###.#####.###.#######.#.#.#
#.....#...#.#.........#.#...#.......#.#.#
#.#####.###.###########.#.###.#####.#.#.#
#...#...#.#.............#.#...#.....#.#.#
###.#.###.#################.#.#######.#.#
#.#.#...#...#.......#.....#.#.#.....#.#.#
#.#.###.#.#.#.#####.###.#.#.#.#.###.#.#.#
#...#...#.#...#...#.#...#...#.#...#...#.#
#.###.###.#####.###.#.###########.#####.#
#...#.#.....#...#...#.............#...#.#
###.#.#####.#.#.#.###.#########.###.#.#.#
#...#.....#.#.#.#.#...#.......#.....#O#.#
#.#######.#.#.#.#.#####.#####.#########.#
#.....#.#...#.#...#.....#...#...#...#...#
#####.#.#####.#####.#####.#.###.#.#.#.###
#...#.....#...#...#.....#.#...#...#.#...#
#.#.#####.#.###.#.#####.#.###.#####.###.#
#.#.......#.....#.......#...#...........#
#########################################`;

let i = 0;
let matrix = map.split('\n');
matrix = matrix.map(row => row.split(''));

while (matrix.find(row => row.indexOf('.') >= 0)) {
  matrix = spreadOxygen(matrix);
  drawMatrix(matrix);
  i++;
}

console.log(i);

function spreadOxygen(matrix) {
  const newOxygenPositions = [];
  matrix.forEach((row, y) =>
    row.forEach((el, x) => {
      if (el === 'O') {
        // turn surrounding to oxygen
        if (matrix[y-1][x] === '.') {
          newOxygenPositions.push([x, y-1]);
        }
        if (matrix[y+1][x] === '.') {
          newOxygenPositions.push([x, y+1]);
        }
        if (matrix[y][x-1] === '.') {
          newOxygenPositions.push([x-1, y]);
        }
        if (matrix[y][x+1] === '.') {
          newOxygenPositions.push([x+1, y]);
        }
      }
    })
  );
  newOxygenPositions.forEach(([x, y]) => matrix[y][x] = 'O');
  return matrix;
}

function drawMatrix(matrix) {
  matrix.forEach(row => console.log(row.join('')));
  console.log('---------------------------------');
}
