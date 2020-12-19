import { inputAsArray } from './utils/util';

import { promises as fs } from 'fs';

interface Rule {
  char?: string;
  sequences?: number[][];
}

function parseRules(rulesStrs: string[]): Rule[] {
  const rules: Rule[] = [];
  rulesStrs.forEach(str => {
    const [ idxStr, ruleStr ] = str.split(': ');
    rules[+idxStr] = {};
    const char = ruleStr.match(/([a-z])/ig);
    if (char) {
      rules[+idxStr].char = char[0];
    } else {
      const sequencesStrs = ruleStr.split(' | ');
      rules[+idxStr].sequences =
        sequencesStrs.map(sequencesStr => sequencesStr.split(' ').map(s => +s));
    }
    
  });
  return rules;
}

function findPossibilities(rules: Rule[],
  idx: number,
  covered: number[] = [],
  maxDepth = 1): string[] {
  console.log({ idx, covered: covered[idx], maxDepth });
  if (covered[idx]) {
    covered[idx] = covered[idx] + 1;
  } else {
    covered[idx] = 1;
  }
  const rule = rules[idx];
  // console.log(idx);
  if (rule.char) {
    return [ rule.char ];
  }
  if (rule.sequences) {
    return rule.sequences.flatMap(sequence => {
      // console.log(idx, sequence);
      return sequence.reduce((acc: string[], cur) => {
        
        let newAcc: string[] = [];
        let curPossibilities: string[] = [ '' ];
        console.log({ cur, covered: covered[cur], maxDepth });
        if (!covered[cur] || covered[cur] && covered[cur] <= maxDepth) {
          curPossibilities = findPossibilities(rules, cur, covered, maxDepth);
        }
       
        console.log({ curPossibilities, cur, acc });
        curPossibilities.forEach(curPoss => {
          newAcc.push(
            ...acc.map(accPoss => `${accPoss}${curPoss}`)
          );
        });
        console.log('newAcc', newAcc);
        // console.log(Math.max( ...newAcc.map(accStr => accStr.length)));
        return newAcc;
      }, ['']);
    });
  }
  return [];
}



inputAsArray('inputs/19.txt', 'none').then((arr) => {
  const [ rulesStr, messagesStr ] = arr[0].split('\n\n');
  const rules = parseRules(rulesStr.split('\n'));
  const possibilities = findPossibilities(rules, 42, [], 1);
  console.log(possibilities);
  const matches = messagesStr.split('\n').filter(msg => {
    return possibilities.includes(msg);
  }).length;
  console.log({ matches });
  // console.log(JSON.stringify(rules, null, 2));
});