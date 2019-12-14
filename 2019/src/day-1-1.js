const fs = require('fs');

const ip = fs.readFileSync('../data/day-1-ip.txt').toString();

const nums = ip.split('\n').map(parseFloat);
// const nums = [14];

const calcFuel = mass => {
  let fuel = Math.max((Math.floor(mass / 3) - 2), 0);
  if (fuel <= 0) {
    return 0;
  }
  fuel += calcFuel(fuel);
  return fuel
}

let sum = nums.reduce((acc, cur) => acc + calcFuel(cur), 0);

console.log(sum);