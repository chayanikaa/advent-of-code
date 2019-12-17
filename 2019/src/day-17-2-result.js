const fs = require('fs');
const program = fs.readFileSync('../data/day-17-ip.txt').toString().split(',').map(Number);

const { Computer } = require('./int-computer');

const ASCII_MAP = {
 '\n': 10,
 '#': 35,
 '.': 46,
 '^': 94,
 'v': 118,
 '<': 60,
'>': 62,
'@': 64,
};

const ASCII_MAP_INVERSE = Object.fromEntries(
  Object.entries(ASCII_MAP).map(([key, value]) => [value, key])
);

program[0] = 2;

const inputs = [
  'A,A,B,C,C,A,C,B,C,B\n',
  'L,4,L,4,L,6,R,10,L,6\n',
  'L,12,L,6,R,10,L,6\n',
  'R,8,R,10,L,6\n',
  'n\n'
];

const ascii = inputs.map(
  str => str.split('').map(char => char.charCodeAt(0))
);
const computer = new Computer(program, []);

computer.run();

while (!computer.completed && ascii.length) {
  const nextIp = ascii.shift();
  if (nextIp) {
    computer.input.push(...nextIp);
  }
  computer.run();
}
const output = computer.output;
console.log('space dust: ', output.pop());
