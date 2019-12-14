var lcm = require('lcm');

// const moonPositions = [
//   {x: -1, y: 0, z: 2},
//   {x: 2, y: -10, z: -7},
//   {x: 4, y: -8, z: 8},
//   {x: 3, y: 5, z: -1},
// ];
// const moonPositions = [
//   {x: -8, y: -10, z: 0},
//   {x: 5, y: 5, z: 10},
//   {x: 2, y: -7, z: 3},
//   {x: 9, y: -8, z: -3},
// ];
const positionsSet = new Set();
const moonPositions = [
  {x: 6, y: 10, z: 10},
  {x: -9, y: 3, z: 17},
  {x: 9, y: -4, z: 14},
  {x: 4, y: 14, z: 4},
];
//const nSteps = Infinity;

let velocities = moonPositions.map(pos => ({ x: 0, y: 0, z: 0}));

const xPosArr = moonPositions.map(({ x }) => x);
const yPosArr = moonPositions.map(({ y }) => y);
const zPosArr = moonPositions.map(({ z }) => z);

const xVelArr = new Array(moonPositions.length).fill(0);
const yVelArr = new Array(moonPositions.length).fill(0);
const zVelArr = new Array(moonPositions.length).fill(0);



// const initialPos = JSON.parse(JSON.stringify(moonPositions));
// const initialVel = JSON.parse(JSON.stringify(velocities));
const initialPosArr = [ [...xPosArr], [...yPosArr], [...zPosArr] ];
const initialVelArr = [ [...xVelArr], [...yVelArr], [...zVelArr] ];
// const initialPosStr = JSON.stringify(initialPos);
// const initialVelStr = JSON.stringify(initialVel);

// console.log({ moonPositions, velocities });
// Each time step
const time1 = new Date();

function findRepeatingStep(poss, vels) {
  const initPos = [ ...poss ];
  const initVel = [ ...vels ];
  let i = 0;
  while (i < Infinity ) {
    vels = vels.map((vel, idx1) => {
      const pos1 = poss[idx1];
      poss.forEach((pos2, idx2) => {
        if (idx1 === idx2) return;
        if (pos1 > pos2) {
          vel--;
        } else if (pos1 < pos2) {
          vel++;
        }
      });
      return vel;
    });
    poss = poss.map((pos, i) => pos + vels[i]);
    i++;
    if (poss.every((pos1, i) => pos1 === initPos[i]) && vels.every((vel, i) => vel === initVel[i])) {
      return i;
    }
  }
}

const repeats = [];
initialPosArr.forEach((poss, i) => repeats.push(findRepeatingStep(poss, initialVelArr[i])));
console.log(repeats);
console.log(lcm(lcm(repeats[0], repeats[1]), repeats[2]));
// console.log(repeats.reduce((acc, el) => acc * el, 1));

const time2 = new Date();

console.log(time2 - time1);
// console.log(moonPositions.map(JSON.stringify));

// const totalEnergies = moonPositions.map((pos, i) => calculateKineticEnergy(velocities[i]) * calculatePotentialEnergy(pos));

// const totalEnergySystem = totalEnergies.reduce((acc, val) => acc + val, 0);

// console.log({ totalEnergySystem });

// function calculatePotentialEnergy(pos) {
//   return Object.values(pos).reduce((acc, val) => acc + Math.abs(val), 0);
// }
// function calculateKineticEnergy(vel) {
//   return Object.values(vel).reduce((acc, val) => acc + Math.abs(val), 0);
// }