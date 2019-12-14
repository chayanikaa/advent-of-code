const fs = require('fs');

const fullProgram = fs.readFileSync('./day-13-ip.txt').toString().split(',').map(parseFloat);

const { Computer } = require('./int-computer');
// const { intCode } = require('./day-11-copy');

const TILE_TYPES = {
  PADDLE: 3,
  BALL: 4,
  WALL: 1,
};

fullProgram[0] = 2;

// const game = new intCode('./day-13-ip.txt', 2);
const game = new Computer(fullProgram, []);

// console.log(computer.output);

let score = 0, input = [];

while (!game.completed) {
  game.run();
  let i = 0;
  const output = game.output;
  let paddleX = 0, ballX = 0, minX = output[0], maxX = output[0];
  while (i < output.length) {
    const x = output[i++];
    const y = output[i++];
    const type = output[i++];
    if (x === -1 && y === 0) {
      score = type;
    } else if (type === TILE_TYPES.PADDLE) {
      paddleX = x;
    } else if (type === TILE_TYPES.BALL) {
      ballX = x;
    }
  }

  game.output = [];
  input = [];
  if (ballX < paddleX) {
    input.push(-1);
  } else if (ballX > paddleX) {
    input.push(1);
  } else {
    input.push(0);
  }
  game.input = input;
}

console.log({ score });

// const tileIds = computer.output.filter((_, i) => i % 3 === 2);

// console.log(tileIds.filter(id => id === 2).length);

