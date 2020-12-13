import { inputAsArray } from './utils/util';

function getBusIds(input: string): number[] {
  return input.split(',').filter(id => id !== 'x').map(id => +id);
}

function findTimeAfterArrival(arrival: number, busId: number): number {
  return Math.ceil(arrival / busId) * busId;
}

inputAsArray('inputs/13.txt').then(inputs => {
  const arrivalTime = +inputs[0];
  const busIds = getBusIds(inputs[1]);

  const arrivalTimes = busIds.map(id => findTimeAfterArrival(arrivalTime, id))
  const minArrivalTime = Math.min(...arrivalTimes);
  const minBusId = busIds[arrivalTimes.indexOf(minArrivalTime)];

  console.time();
  console.log('Part 1', minBusId * (minArrivalTime - arrivalTime));
  console.timeEnd();
});