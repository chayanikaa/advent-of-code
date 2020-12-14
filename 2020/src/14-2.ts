import { inputAsArray } from './utils/util';

function getAllPossibilities(
  address: string,
  index: number = 0,
): string[] {
  if (index >= address.length) {
    return [ address ];
  }
  if (address[index] === 'X') {
    const newAddresses = [
      `${address.substring(0, index)}0${address.substring(index + 1)}`,
      `${address.substring(0, index)}1${address.substring(index + 1)}`,
    ];
    return newAddresses.flatMap(newAdd => [ ...getAllPossibilities(newAdd, index + 1) ]);
  }
  return getAllPossibilities(address, index + 1);
}

function applyValue(instruction: string,
  mask: string[],
  memory: Map<number, number>) {
    const address = +instruction.split(/[\[\]]/g)[1];
    const value = +instruction.split(' = ')[1];

    const addressBin = address.toString(2).padStart(36, '0');

    const staticAddressChanged = addressBin.split('').map((val, i) => {
      const maskBit = mask[i];
      if (maskBit === '0') {
        return val;
      }
      if (maskBit === '1') {
        return '1';
      }
      if (maskBit === 'X') {
        return 'X';
      }
    }).join('');

    const addresses = getAllPossibilities(staticAddressChanged, 0);
  
    addresses.forEach(add => {
      memory.set(
        parseInt(add, 2),
        value,
      )
    });

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

  console.log('Part 2', sum);
  console.timeEnd();
});