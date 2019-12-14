const fs = require('fs');

// const readline = require('readline').createInterface({
//   input: process.stdin,
//   output: process.stdout
// })

// readline.question(`What's your name?`, (name) => {
//   console.log(`Hi ${name}!`)
//   readline.close()
// })

const ip = fs.readFileSync('./day-5-ip.txt').toString().split(',').map(parseFloat);

// ip[1] = 12;
// ip[2] = 2;

// const ip = [3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9];
const userInput = 5;

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
  if ([1, 2, 7, 8].includes(code)) {
    nParameters = 2;
    outputPos = ip[instructionIdx + 3];
    next = instructionIdx + 4;
  } if ([5, 6].includes(code)) {
    nParameters = 2;
    next = instructionIdx + 3;
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

function executeInstruction({ code, parameters, outputPos, next }) {
  if (code === 1) {
    ip[outputPos] = parameters.reduce((acc, curr) => acc + curr , 0);
  } else if (code === 2) {
    ip[outputPos] = parameters.reduce((acc, curr) => acc * curr , 1);
  } else if (code === 3) {
    ip[outputPos] = userInput;
  } else if (code === 4) {
    console.log(parameters[0]);
  } else if (code === 5) {
    if (parameters[0] !== 0) {
      next = parameters[1];
    }
  } else if (code === 6) {
    if (parameters[0] === 0) {
      next = parameters[1];
    }
  } else if (code === 7) {
    if (parameters[0] < parameters[1]) {
      ip[outputPos] = 1;
    } else {
      ip[outputPos] = 0;
    }
  } else if (code === 8) {
    if (parameters[0] === parameters[1]) {
      ip[outputPos] = 1;
    } else {
      ip[outputPos] = 0;
    }
  } else if (code === 99) {
    console.log('exited successfully');
    return;
  }
  return next;
}

while(i < ip.length) {
  const info = decodeInstruction(i);
  const next = executeInstruction(info);
  // console.log({ info, next });
  i = next;
}

// console.log(ip);