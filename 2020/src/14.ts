import { inputAsArray } from './utils/util';

function applyValue(instruction: string,
  mask: string[],
  memory: Map<number, number>) {
    const address = +instruction.split(/[\[\]]/g)[1];
    const value = +instruction.split(' = ')[1];

    const binValueArr = value.toString(2).padStart(36, '0').split('');

    const finalValueString = binValueArr.map((val, i) => {
      const maskBit = mask[i];
      if (['0', '1'].includes(maskBit)) {
        return maskBit;
      }
      return val;
    }).join('');

    memory.set(
      address, parseInt(finalValueString, 2)
    );

}

function executeProgram(inputs: string[]) {
  let mask: string[] = [];
  const results = new Map();
  for (let input of inputs) {
    if (input.includes('mask')) {
      mask = input.split(' = ')[1].split('');
    } else {
      applyValue(
        input,
        mask,
        results,
      );
    }
  }
  return results;
}

inputAsArray('inputs/14.txt').then(inputs => {
  console.time();
  const result = executeProgram(inputs);
  let sum = 0;
  result.forEach(value => sum+= value);
  console.log('Part 1', sum);
  console.timeEnd();
});