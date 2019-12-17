const fs = require('fs');
const program = fs.readFileSync('../data/day-17-ip.txt').toString().split(',').map(Number);

const { Computer } = require('./int-computer');

// program[0] = 2;

const ASCII_MAP = {
 10: '\n',
 35: '#',
 46: '.',
 94: '^',
 118: 'v',
 60: '<',
 62: '>',
};

const computer = new Computer(program, []);

computer.run();

const output = computer.output;

console.log(output.map(num => ASCII_MAP[num]).join(''));

// console.log(output.indexOf(10), output.filter(el => el === 10).length);

const rowLength = output.indexOf(10) + 1;
let matrix = splitArray(output, rowLength);

// console.log(matrix);

// matrix.map();


const intersectionIds = matrix.flatMap(
  (row, y) => row.flatMap((el, x) => {
    if (isIntersection({ matrix, x, y })) {
      return [x * y];
    }
    return [];
  })
);

console.log(intersectionIds.reduce((acc, el) => acc + el, 0));

function isIntersection({ matrix, x, y }) {
  if (
    matrix[y][x] === 35 &&
    matrix[y - 1] && matrix[y - 1][x] === 35 &&
    matrix[y + 1] && matrix[y + 1][x] === 35 &&
    matrix[y][x - 1] === 35 &&
    matrix[y][x + 1] === 35
  ) {
    return true;
  }
}

function splitArray(array, chunk) {
  var i, j;
  let arrays = [];
  for (i=0,j=array.length; i<j; i+=chunk) {
      arrays.push(array.slice(i,i+chunk));
      // do whatever
  }
  arrays = arrays
    .map(row => row.filter(el => el !== 10))
    .filter(row => row.length);
  return arrays;
}
