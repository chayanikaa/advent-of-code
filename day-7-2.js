const fs = require('fs');

const origIP = fs.readFileSync('./day-7-ip.txt').toString().split(',').map(parseFloat);

const { Computer } = require('./int-computer');

// const origIP = fs.readFileSync('./day-5-ip.txt').toString().split(',').map(parseFloat);

// const origIP = [3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5];

// const origIP = [3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,
//   -5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,
//   53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10];

// runProgram([...origIP], [1], []);


// tryAllPhasePermutationsFindMax(origIP);

function tryAllPhasePermutationsFindMax(program) {
  const results = [], allPhases = [];
  let phases = []
  let a = 5, b = 5, c = 5, d = 5, e = 5;
  while(a < 10) {
    while(b < 10) {
      while(c < 10) {
        while(d < 10) {
          while(e < 10) {
            phases = [a, b, c, d, e];
            if (new Set(phases).size === phases.length) {
              allPhases.push(phases);
              results.push(runAmplifiersWithPhaseSequence(program, phases));
            }
            phases = [];
            e++;
          }
          d++;
          e = 5;
        }
        c++;
        d = 5, e = 5;
      }
      b++;
      c = 5, d = 5, e = 5;
    }
    a++;
    b = 5, c = 5, d = 5, e = 5;
  }
  const maxResult = Math.max(...results);
  console.log({ maxResult })
  console.log(allPhases[results.indexOf(maxResult)]);
  return maxResult;
}

function runAmplifiersWithPhaseSequence(program, phases) {
  // console.log({ program, phases })
  const amps = [];
  const ampOutputs = [];
  let i = 0;
  for (let index = 0; index < phases.length; index++) {
    amps.push(
      new Computer(
        [...program],
        [phases[index]],
        0
      )
    );
  }
  i = 0;
  amps[0].input.push(0);

  while (!amps[4].completed) {
    const currAmp = amps[i % phases.length];
    if (!currAmp.completed) {
      const nextAmp = amps[(i + 1) % phases.length];
      currAmp.run();
      if (currAmp.output.length) {
        ampOutputs[i % phases.length] = currAmp.output[0];
        nextAmp.input.push(currAmp.output.shift());
      }
    }
    i++;
  }
  return amps[0].input[0];
}

module.exports = {
  tryAllPhasePermutationsFindMax,
}

// console.log(ip);