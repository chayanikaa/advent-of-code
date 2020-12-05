import { promises as fs } from 'fs';

interface Parsed {
  min: number,
  max: number,
  alphabet: string,
  password: string,
}

async function inputAsArray() {
	const buffer = await fs.readFile('inputs/2.txt');
	const str = buffer.toString();
	const asArray = str.split('\n');
	// console.log(asArray)
	return asArray;
}

function parseInput(str: string): Parsed {
  const [min, max] = str.split('-').map(el => parseInt(el, 10));
  const alphabet = str.split(' ')[1].substring(0,1);
  const password = str.split(': ')[1];

  return {
    min, max, alphabet, password,
  }
}

function isValid1(input: Parsed): boolean {
  let reqCount = 0;
  for (let char of input.password) {
    if (char === input.alphabet) {
      reqCount++;
    }
    if (reqCount > input.max) {
      return false;
    }
  }
  if (reqCount >= input.min && reqCount <= input.max ) {
    return true;
  }
  return false;
}

function isValid2(input: Parsed): boolean {
  const char1 = input.password.substring(input.min - 1, input.min);
  const char2 = input.password.substring(input.max - 1, input.max);
  return [char1, char2].filter(char => char === input.alphabet).length === 1;
}

inputAsArray().then(arr => {
  console.log(arr.map(parseInput).filter(isValid2).length);
})
