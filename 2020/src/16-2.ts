import { inputAsArray } from './utils/util';

type Rules = Record<string, number[][]>;

type Data = {
  rules: Rules,
  mine: number[],
  nearby: number[][],
};

function parseInput(input: string[]): Data {
  const rules = parseRules(input);
  return {
    rules,
    mine: myTicket(input),
    nearby: validNearby(rules, input),
  };
}

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

function myTicket(input: string[]) {
  let i = input.indexOf('your ticket:') + 1;
  return input[i].split(',').map(val => +val);
}

function validNearby(rules: Rules, input: string[]) {
  let i = input.indexOf('nearby tickets:') + 1;
  const validRanges = Object.values(rules).flat();
  const validNearby: number[][] = [];
  while(i < input.length) {
    const ticketValues = input[i].split(',').map(val => +val);
    const invalid = ticketValues.some(val => {
      return !validRanges.some(range => val >= range[0] && val <= range[1])
    });
    if (!invalid) {
      validNearby.push(ticketValues)
    }
    i++;
  }
  return validNearby;
}

function isInvalid(ranges: number[][], val: number) {
  const result = !ranges.some(range => val >= range[0] && val <= range[1]);
  return result;
}

function findFieldOrder(data: Data) {
  const fields = [];
  const { nearby, mine, rules } = data;
  const matchedFields: Record<string, number[]> = {};
  Object.keys(rules).forEach((field, fieldI) => {
    nearby[0].forEach((col, colI) => {
      let isField = true;
      let i = 0;
      while(i < nearby.length) {
        if (isInvalid(rules[field], nearby[i][colI])) {
          isField = false;
          break;
        }
        i++;
      }
      if (isField) {
        if (matchedFields[field]) {
          matchedFields[field].push(colI);
        } else {
          matchedFields[field] = [ colI ];
        }
        return true;
      }
    })
  });
  return Object.entries(matchedFields).map((([field, cols]) => ({
    field: field,
    cols: cols
  })));
}

interface MatchedField {
  field: string;
  cols: number[];
}


inputAsArray('inputs/16.txt').then((arr) => {
  console.time();
  const data = parseInput(arr);
  const fieldOrder = findUniqueFields(findFieldOrder(data)) as MatchedField[];
	console.log('Part 2', fieldOrder.reduce((acc: number, curr) => {
    if (curr.field.indexOf('departure') === 0) {
      return acc * data.mine[curr.cols[0]];
    }
  return acc;
}, 1));
	console.timeEnd();
});

function findUniqueFields(matchedFields: MatchedField[]) {
  let newMatchedFields = matchedFields;
  while (!newMatchedFields.every(matchedField => matchedField.cols.length === 1)) {

    let uniqueMap: Map<string, number> = new Map();
    let uniqueSet: Map<number, string> = new Map();

    newMatchedFields.forEach(matched => {
      if(matched.cols.length === 1) {
        uniqueSet.set(matched.cols[0], matched.field);
        uniqueMap.set(matched.field, matched.cols[0]);
      }
    });
    newMatchedFields = newMatchedFields.map(matched => {
      if (uniqueMap.has(matched.field)) {
        return matched;
      } else {
        return {
          field: matched.field,
          cols: matched.cols.filter(col => !uniqueSet.has(col))
        }
      }
    });
  }
  return newMatchedFields;
}
