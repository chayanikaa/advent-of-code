import { inputAsArray } from './utils/util';

function isValidNextNumber(preamble: number[],
  num: number): boolean {
    return preamble.some((preNum1, i1) => {
      return preamble.some((preNum2, i2) => {
        if (preNum1 === preNum2) {
          return false;
        }
        if (preNum1 + preNum2 === num) {
          return true;
        }
      });
    });
}

function findContiguousSet(inputs: number[], num: number): number[] {
  let sum, contiguousSet: number[] = [];
  if (inputs.some((pre1, i) => {
    sum = pre1;
    contiguousSet = [pre1];
    for (let j = i + 1; j < inputs.length; j++) {
      sum += inputs[j];
      contiguousSet.push(inputs[j]);
      if (sum > num) {
        return false;
      }
      if (sum === num) {
        return true;
      }
    }
  }) ) {
    return contiguousSet;
  }
  return [];
}

inputAsArray('inputs/9.txt').then(arr => {
  const inputs = arr.map(num => +num);
  const preambleLength = 25;
  let invalidNum: number = 0;
  for (let i = preambleLength; i < inputs.length; i++) {
    const newPreamble = inputs.slice(i - preambleLength, i);
    if (!isValidNextNumber(newPreamble, inputs[i])) {
      invalidNum = inputs[i];
      break;
    }
  }
  const contiguousSet = findContiguousSet(inputs, invalidNum);
  contiguousSet.sort((a, b) => a - b);
  console.log('Part 1', invalidNum);
  console.log('Part 2', contiguousSet[0] + contiguousSet[contiguousSet.length - 1]);
});
