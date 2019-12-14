const fs = require('fs');

const ip = fs.readFileSync('../data/day-5-ip.txt').toString().split(',').map(parseFloat);

// ip[1] = 12;
// ip[2] = 2;

// const ip = [1101,100,-1,4,0];
const userInput = 1;

// console.log(ip);

let i = 0;

function decodeInstruction(instructionIdx) {
  const instruction = ip[instructionIdx];
  const digits = instruction.toString().split('').map(parseFloat);
  const code = instruction % 100;
  const parameters = [];
  let outputPos;
  let next;
  let nParameters = 0;
  if (code < 3) {
    nParameters = 2;
    outputPos = ip[instructionIdx + 3];
    next = instructionIdx + 4;
  } else if (code === 4) {
    nParameters = 1;
    // parameters.push(ip[ip[instructionIdx + 1]]);
    next = instructionIdx + 2;
  } else if (code === 3) {
    outputPos = ip[instructionIdx + 1];
    next = instructionIdx + 2;
  }
  let parameterCodes = digits.slice(0, -2).reverse();
  // parameterCodes = parameterCodes.length ? parameterCodes : Array(nParameters).fill(0);
  // console.log({ nParameters, parameterCodes });
  for (let i = 0; i < nParameters; i++) {
    if (parameterCodes[i] === 0 || parameterCodes[i] == null) { // position mode
      parameters.push(ip[ip[instructionIdx + i + 1]]);
    } else if (parameterCodes[i] === 1) { // immediate mode
      parameters.push(ip[instructionIdx + i + 1]);
    }
  }

  return {
    code,
    parameters,
    outputPos,
    next,
  }
}

function executeInstruction({ code, parameters, outputPos }) {
  if (code === 1) {
    ip[outputPos] = parameters.reduce((acc, curr) => acc + curr , 0);
  } else if (code === 2) {
    ip[outputPos] = parameters.reduce((acc, curr) => acc * curr , 1);
  } else if (code === 3) {
    ip[outputPos] = userInput;
  } else if (code === 4) {
    console.log(parameters[0]);
  } else if (code === 99) {
    console.log('exited successfully');
    return;
  }
}

while(i < ip.length) {
  const info = decodeInstruction(i);
  // console.log(info);
  executeInstruction(info);
  i = info.next;
}

// console.log(ip);