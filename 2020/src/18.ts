import { inputAsArray } from './utils/util';

function evaluateExpression(exp: (string | number)[]): number {
  const brackets = {
    opening: [] as number[],
    closing: [] as number[],
  };

  let unMatched: number[] = [];
  
  exp.forEach((element, i) => {
    if (element === '(') {
      unMatched.push(i);
    }
    if (element === ')') {
      const opening = unMatched.pop();
      brackets.opening.push(opening as number);
      brackets.closing.push(i);
    }
  });

  const pair =  [ brackets.opening[0], brackets.closing[0]]

  let newExp = exp;

  if (brackets.opening.length) {
    const result = evaluateExpression(
      newExp.slice(pair[0] + 1, pair[1])
    );
    newExp = [ ...newExp.slice(0, pair[0]),
      result,
      ...newExp.slice(pair[1] + 1, newExp.length)];
    return evaluateExpression(newExp);
  }

  // eval left to right
  while (newExp.length > 1) {
    let i = 0;
    let op, num1, num2;
    while (i < newExp.length && newExp.length > 1) {
      if (num1 != null && op == null) {
        if (!['+', '*'].includes(newExp[i] as any)) {
          throw new Error(`Something is wrong 1 ${newExp[i]}`);
        }
        op = newExp[i];
      } else if (num1 != null && op != null) {
        if (isNaN(parseInt(newExp[i] as any))) {
          throw new Error(`Something is wrong 2 ${newExp[i]} ${newExp}`);
        }
        num2 = newExp[i];
      } else {
        num1 = newExp[i];
      }
      if (num1 && num2 && op) {
        const result = op === '*'
          ? (num1 as any) * (num2 as any) :
          (num1 as any) + (num2 as any);
        
        newExp = [ result, ...newExp.slice(i + 1, newExp.length)];
        i = 0;
        num1 = undefined;
        num2 = undefined;
        op = undefined;
      } else {
        i++;
      }
    }
  }

  return parseInt(newExp[0] as any);
}

inputAsArray('inputs/18.txt').then((arr) => {
  const mappedExpressions = arr
    .map(exp => exp.replace(/ /g, '').split('')
    .map(el => ['(', ')', '+', '*'].includes(el) ? el : +el));
  const results = mappedExpressions.map(evaluateExpression);
  console.log('Part 1', results.reduce((acc, cur) => acc + cur, 0));
});