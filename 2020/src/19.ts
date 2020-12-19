import { inputAsArray } from './utils/util';

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

function findPossibilities(rules: Rule[], idx: number, seed?: string): string[] {
  
  const rule = rules[idx];
  if (rule.char) {
    return [ rule.char ];
  }
  if (rule.sequences) {
    return rule.sequences.flatMap(sequence => {
      // console.log(idx, sequence);
      return sequence.reduce((acc: string[], cur) => {
        let newAcc: string[] = [];
        const curPossibilities: string[] = findPossibilities(rules, cur);
        curPossibilities.forEach(curPoss => {
          newAcc.push(
            ...acc.map(accPoss => `${accPoss}${curPoss}`)
          );
        });
        return newAcc;
      }, ['']);
    });
  }
  return [];
}



inputAsArray('inputs/19.txt', 'none').then((arr) => {
  const [ rulesStr, messagesStr ] = arr[0].split('\n\n');
  const rules = parseRules(rulesStr.split('\n'));
  const possibilities = findPossibilities(rules, 0, '');
  // console.log(possibilities);
  const matches = messagesStr.split('\n').filter(msg => {
    return possibilities.includes(msg);
  }).length;
  console.log(matches);
});