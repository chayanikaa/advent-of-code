import { inputAsArray } from './utils/util';

type Rules = Record<string, number[][]>

function parseRules(input: string[]) {
  const rules: Rules = {};
  for (let line of input) {
    if (line === '') {
      break;
    }
    const [field, rangeString] = line.split(': ');
    const rangeStrings = rangeString.split(' or ');
    rules[field] = rangeStrings.map(str => str.split('-').map(part => +part));
  }
  return rules;
}

function findInvalidValues(rules: Rules, input: string[]) {
  let i = input.indexOf('nearby tickets:') + 1;
  const invalid = [];
  const validRanges = Object.values(rules).flat();
  while(i < input.length) {
    const ticketValues = input[i].split(',').map(val => +val);
    // console.log(ticketValues, validRanges);
    const invalidVals = ticketValues.filter(val => {
      return !validRanges.some(range => val >= range[0] && val <= range[1])
    });
    // console.log(invalidVals);
    invalid.push(...invalidVals);
    i++;
  }
  return invalid.reduce((acc, cur) => acc + cur, 0);

}

inputAsArray('inputs/16.txt').then((arr) => {
  const rules = parseRules(arr);
  // console.log(rules);
  
	console.time();
	console.log('Part 1', findInvalidValues(rules, arr));
	console.timeEnd();
	console.time();
	console.log('Part 2');
	console.timeEnd();
});
