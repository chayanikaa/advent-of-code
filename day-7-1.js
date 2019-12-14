const fs = require('fs');

const origIP = fs.readFileSync('./day-7-ip.txt').toString().split(',').map(parseFloat);

// const origIP = [3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0];

// tryAllPhasePermutations();

function tryAllPhasePermutations() {
  const results = [], allPhases = [];
  let phases = []
  let a = 0, b = 0, c = 0, d = 0, e = 0;
  while(a < 5) {
    while(b < 5) {
      while(c < 5) {
        while(d < 5) {
          while(e < 5) {
            phases = [a, b, c, d, e];
            if (new Set(phases).size === phases.length) {
              allPhases.push(phases);
              results.push(runAmplifiersWithPhaseSequence(phases));
            }
            phases = [];
            e++;
          }
          d++;
          e = 0;
        }
        c++;
        d = 0, e = 0;
      }
      b++;
      c = 0, d = 0, e = 0;
    }
    a++;
    b = 0, c = 0, d = 0, e = 0;
  }
  console.log({ maxResult: Math.max(...results)})
  console.log(allPhases[results.indexOf(Math.max(...results))]);
}

function runAmplifiersWithPhaseSequence([ ...phases]) {
  const output = [];
  let i = 0,
    prevOutput = 0;
  while (i < 5) {
    runProgram([...origIP], [phases[i], prevOutput], output);
    prevOutput = output.shift();
    i++;
  }
  return prevOutput;
}

function runProgram(ip, userInput, programOutput) {
  let i = 0;
  while(i < ip.length) {
    const info = decodeInstruction(ip, i);
    const next = executeInstruction({ ip, ...info, userInput, programOutput});
    // console.log({ info, next });
    i = next;
  }
}

function decodeInstruction(ip, instructionIdx) {
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
    next = instructionIdx + 2;
  } else if (code === 3) {
    outputPos = ip[instructionIdx + 1];
    next = instructionIdx + 2;
  }
  let parameterCodes = digits.slice(0, -2).reverse();
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

function executeInstruction({ ip, code, parameters, outputPos, next, programOutput, userInput }) {
  if (code === 1) {
    ip[outputPos] = parameters.reduce((acc, curr) => acc + curr , 0);
  } else if (code === 2) {
    ip[outputPos] = parameters.reduce((acc, curr) => acc * curr , 1);
  } else if (code === 3) {
    ip[outputPos] = userInput.shift();
  } else if (code === 4) {
    programOutput.push(parameters[0]);
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



// console.log(ip);