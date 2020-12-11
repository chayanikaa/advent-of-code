import { inputAsArray } from './utils/util';

function canConnect(outletJoltage = 0, adapterJoltage: number): boolean {
  const diff = adapterJoltage - outletJoltage;
  if ([1, 2, 3].includes(diff)){
    return true;
  }
  return false;
}

function countPossibilities(joltages: number[],
  targetI = joltages.length - 1, resultMap = new Map()): number {
  const target = joltages[targetI];

  if (resultMap.has(targetI)) {
    return resultMap.get(targetI);
  }

  const possibleChildrenArr = [
    canConnect(joltages[targetI - 1], target) ? targetI - 1 : -1,
    canConnect(joltages[targetI - 2], target) ? targetI - 2 : -1,
    canConnect(joltages[targetI - 3], target) ? targetI - 3 : -1,
  ];

  const possibleChildren = possibleChildrenArr.filter(indx => indx >= 0);

  if (possibleChildren.length === 0) {
    return 1;
  }

  resultMap.set(targetI, possibleChildren.reduce((acc, curr) => {
    return acc + countPossibilities(joltages, curr, resultMap);
  }, 0));

  return resultMap.get(targetI);
}

inputAsArray('inputs/10.txt').then(inputs => {
  const bagJoltages = inputs.map(input => +input).sort((a,b) => a-b);
  const builtInJoltage = bagJoltages[bagJoltages.length - 1] + 3;
  const joltages = [ 0, ...bagJoltages, builtInJoltage]
  console.time();
  console.log('part 1', part1(bagJoltages));
  console.timeEnd();
  console.time();
  console.log('part 2', countPossibilities(joltages));
  console.timeEnd();

});


function part1(bagJoltages: number[]) {
  const builtInJoltage = Math.max(...bagJoltages) + 3;
  const diffs = [ ...bagJoltages, builtInJoltage].map((joltage, i) => {
    if (i === 0) {
      return joltage - 0;
    }
    return joltage - bagJoltages[i-1];
  });

  return diffs.filter(diff => diff === 1).length * diffs.filter(diff => diff === 3).length;
}
