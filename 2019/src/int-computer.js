
const EXIT_CODES = {
  WAITING: 1,
  HALT: 99
}

const sanitizeParameters = params => params.map(param => param == null ? 0 : param);

class Computer {
  constructor(program, userInput, index = 0) {
    this.waiting = false;
    this.completed = false;
    this.program = [ ...program ];
    this.input = userInput;
    this.output = [];
    this.index = index;
    this.relativeBase = 0;
  }

  run() {
    this.waiting = false;
    const { exitCode, index, relativeBase } = runProgram(this.program, this.input, this.output, this.index, this.relativeBase);
    this.index = index;
    this.relativeBase = relativeBase;
    if (exitCode === EXIT_CODES.HALT) {
      this.completed = true;
    } else if (exitCode === EXIT_CODES.WAITING) {
      this.waiting = true;
    }
  }
}

function runProgram(ip, userInput, programOutput, index = 0, givenRelativeBase = 0) {
  // console.log( { userInput, programOutput });
  let i = index;
  let result;
  let relativeBase = givenRelativeBase;
  while(i < ip.length) {
    const info = decodeInstruction({ ip, instructionIdx: i, relativeBase });
    // console.log({ ...info, userInput, programOutput, relativeBase, instruction: ip.slice(i, i+4) });
    result = executeInstruction({ ip, ...info, userInput, programOutput, relativeBase });
    relativeBase = result.relativeBase;
    if (result.exitCode) {
      return {
        index: i,
        exitCode: result.exitCode,
        relativeBase: relativeBase,
      }
    }
    i = result.next;
  }
}

function decodeInstruction({ ip, instructionIdx, relativeBase }) {
  const instruction = ip[instructionIdx];
  // console.log({instruction});
  const digits = instruction.toString().split('').map(parseFloat);
  const code = instruction % 100; // 9 and 99 should be distinguished here correctly
  let parameters = [];
  let outputPos;
  let next;
  let nParameters = 0;
  let needsOutputPos;
  if ([1, 2, 7, 8].includes(code)) {
    nParameters = 3;
    // outputPos = ip[instructionIdx + 3];
    next = instructionIdx + 4;
    needsOutputPos = true;
  } if ([5, 6].includes(code)) {
    nParameters = 2;
    next = instructionIdx + 3;
  } else if ([4, 9].includes(code)) {
    nParameters = 1;
    next = instructionIdx + 2;
  } else if (code === 3) {
    // console.log('reading 3', digits.slice(0, -2).reverse());
    nParameters = 1;
    // outputPos = ip[instructionIdx + 1];
    next = instructionIdx + 2;
    needsOutputPos = true;
  }
  let parameterCodes = digits.slice(0, -2).reverse();
  for (let i = 0; i < nParameters; i++) {
    ip[instructionIdx + i + 1] = ip[instructionIdx + i + 1] || 0;
    const valueAtPosition = ip[instructionIdx + i + 1];
    let calcOutputPos;
    // console.log({ i, needsOutputPos });
    if (i === (nParameters - 1) && needsOutputPos) {
      calcOutputPos = true;
    }
    if (parameterCodes[i] === 0 || parameterCodes[i] == null) { // position mode
      if (calcOutputPos) {
        outputPos = valueAtPosition;
      } else {
        parameters.push(ip[valueAtPosition]);
      }
    } else if (parameterCodes[i] === 1) { // immediate mode
      parameters.push(valueAtPosition);
    }  else if (parameterCodes[i] === 2) { // relative mode
      if (calcOutputPos) {
        // console.log('relative mode output', { relativeBase, valueAtPosition, value: ip[relativeBase + valueAtPosition] });
        outputPos = relativeBase + valueAtPosition;
      } else {
        // console.log('relative mode', { relativeBase, valueAtPosition, value: ip[relativeBase + valueAtPosition] });
        parameters.push(ip[relativeBase + valueAtPosition]);
      }
      
    }
  }
  parameters = sanitizeParameters(parameters);

  return {
    code,
    parameters,
    outputPos,
    next,
  }
}

function executeInstruction({ ip, code, parameters, outputPos, next, programOutput, userInput, relativeBase }) {
  // console.log({ code, relativeBase, parameters });
  let exitCode;
  if (code === 1) {
    ip[outputPos] = parameters.reduce((acc, curr) => acc + curr , 0);
  } else if (code === 2) {
    ip[outputPos] = parameters.reduce((acc, curr) => acc * curr , 1);
  } else if (code === 3) {
    // console.log(3, { outputPos });
    if (userInput.length === 0) {
      exitCode = EXIT_CODES.WAITING;
    } else {
      ip[outputPos] = userInput.shift();
    }
  } else if (code === 4) {
    programOutput.push(parameters[0]);
    // console.log('output', parameters[0]);
  } else if (code === 5) {
    // console.log('opcode 5', { parameters });
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
  } else if (code === 9) {
    // console.log({ relativeBase })
    relativeBase = relativeBase + parameters[0];
    // console.log({ relativeBase });
  } else if (code === 99) {
    exitCode = EXIT_CODES.HALT;
    console.log('exited successfully');
  }
  return {
    next,
    exitCode,
    relativeBase,
  }
}

module.exports = {
  runProgram,
  EXIT_CODES,
  Computer,
}