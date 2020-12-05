import { inputAsArray } from './utils/util';

function countTreesForSlope(arr:string[], slopeX:number, slopeY:number) {
  let nextX = 0;
  let treeCount = 0;
  let y = 0;
  for (y = 0; y < arr.length; y+=slopeY) {
    if (arr[y][nextX] === '#') {
      treeCount++;
    }
    nextX = (nextX + slopeX) % arr[0].length;
  }
  return treeCount;
}

inputAsArray('inputs/3.txt').then(arr => {
  console.log('Part 1', countTreesForSlope(arr, 3, 1));
  console.log('Part 2',
    countTreesForSlope(arr, 1, 1)
    * countTreesForSlope(arr, 3, 1)
    * countTreesForSlope(arr, 5, 1)
    * countTreesForSlope(arr, 7, 1)
    * countTreesForSlope(arr, 1, 2)
    );
})
