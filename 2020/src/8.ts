import { inputAsArray } from './utils/util';

let globals = {
  accumulator: 0,
  offset: 0,
  pointer: 0,
};

const instructions = {
  acc: 'acc',
  jmp: 'jmp',
  nop: 'nop',
};

function executeInstruction(instruction: string) {
  // console.log(instruction);
  const parts = instruction.split(' ');
  const op = parts[0];
  const val = parseInt(parts[1], 10);
  if (op === instructions.acc) {
    globals.accumulator += val;
    globals.pointer += 1;
  } else if (op === instructions.jmp) {
    globals.pointer += val;
  } else if (op === instructions.nop) {
    globals.pointer += 1;
  } else {
    console.log(`unknown op ${op}`);
  }
}

function executeCode(inputs: string[], print = false) {
  const executedSet = new Set();
  let pointer = globals.pointer;
  // while() {
  while(
    pointer < inputs.length && !executedSet.has(pointer)
  ) {
    executeInstruction(inputs[pointer]);
    executedSet.add(pointer);
    pointer = globals.pointer;
  }
  if (executedSet.has(pointer)) {
    if (print) {
      console.log('Part 1', globals.accumulator);
    }
    return null;
  }
  return globals.accumulator;
  
}

function resetGlobals() {
  globals = {
    accumulator: 0,
    offset: 0,
    pointer: 0,
  };
}

function changeEachJmpToNop(inputs: string[]) {
  return inputs.some((element, i) => {
    if (element.includes(instructions.jmp)) {
      const newInstructions = [...inputs];
      newInstructions[i] = element.replace('jmp', 'nop');
      resetGlobals();
      const result = executeCode(newInstructions);
      if (result) {
        console.log('Part 2', result);
        return true;
      }
    }
  });
}

inputAsArray('inputs/8.txt').then(arr => {
  executeCode(arr, true);
  changeEachJmpToNop(arr);
});
