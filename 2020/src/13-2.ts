import { inputAsArray } from './utils/util';

interface Bus {
  id: bigint,
  offset: bigint,
}

function getBuses(input: string): Bus[] {
  return input.split(',').map((id, i) => {
    if (id === 'x') {
      return null as any;
    }
    return {
      id: BigInt(id),
      offset: BigInt(i)
    }
  }).filter(bus => bus !== null);
}

function findInverse(mul: bigint, modulus: bigint) {
  let i = 1n;
  while ((( mul * i ) % modulus) !== 1n) {
    i++;
  }
  return i;
}

function calculateChineseRemainder(buses: Bus[]): bigint {
  const N = buses.reduce((acc, cur) => acc * cur.id, 1n);
  // console.log({ N });
  return N - (buses.map(bus => {
    const partial = N / bus.id;
    const inverse = findInverse(partial % bus.id, bus.id);
    // console.log({
    //   id: bus.id,
    //   offset: bus.offset,
    //   partial,
    //   inverse,
    //   partialMod: partial % bus.id,
    //   partialResult: bus.offset * partial * inverse,
    // });
    return bus.offset * partial * inverse;
  }).reduce((acc, cur) => acc + cur, 0n) % N);
}

inputAsArray('inputs/13.txt').then(inputs => {
  const buses = getBuses(inputs[1]);

  console.time();
  console.log('Part 2', calculateChineseRemainder(buses));
  console.timeEnd();
});