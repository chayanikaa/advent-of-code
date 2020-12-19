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

function isValid(rules: Rule[], msg: string, ruleIdx: number | undefined, rest: number[]): boolean | undefined {
  if (ruleIdx == undefined) return !msg;
  const rule = rules[ruleIdx];

  if (rule.char) {
    if (msg[0] === rule.char && isValid(rules, msg.substring(1), rest.shift(), rest)) {
      return true;
    }
    
  } else {
    return rule.sequences && rule.sequences.some(seq => {
      const [ newRule, ...newRest ] = seq;
      return isValid(rules, msg, newRule, [ ...newRest, ...rest]);
    });
  } 
}

inputAsArray('inputs/19.txt', 'none').then((arr) => {
  const [ rulesStr, messagesStr ] = arr[0].split('\n\n');
  const rules = parseRules(rulesStr.split('\n'));

  const matches1 = messagesStr.split('\n').filter(msg => {
    return isValid(rules, msg, 0, []);
  }).length;

  console.log('Part 1', matches1);

  rules[8] = { sequences: [
    [42], [42, 8],
  ]};

  rules[11] = { sequences: [
    [42, 31], [42, 11, 31],
  ]};

  const matches2 = messagesStr.split('\n').filter(msg => {
    return isValid(rules, msg, 0, []);
  }).length;
  console.log('Part 2', matches2);
});