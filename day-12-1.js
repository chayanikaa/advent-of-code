const moonPositions = [
  {x: -1, y: 0, z: 2},
  {x: 2, y: -10, z: -7},
  {x: 4, y: -8, z: 8},
  {x: 3, y: 5, z: -1},
];
// const moonPositions = [
//   {x: -8, y: -10, z: 0},
//   {x: 5, y: 5, z: 10},
//   {x: 2, y: -7, z: 3},
//   {x: 9, y: -8, z: -3},
// ];
// const positionsSet = new Set();
// const moonPositions = [
//   {x: 6, y: 10, z: 10},
//   {x: -9, y: 3, z: 17},
//   {x: 9, y: -4, z: 14},
//   {x: 4, y: 14, z: 4},
// ];
//const nSteps = Infinity;

let velocities = moonPositions.map(pos => ({ x: 0, y: 0, z: 0}));

let i = 0;

const initialPos = JSON.parse(JSON.stringify(moonPositions));
const initialVel = JSON.parse(JSON.stringify(velocities));

const initialPosStr = JSON.stringify(initialPos);
const initialVelStr = JSON.stringify(initialVel);

// console.log({ moonPositions, velocities });
// Each time step
const time1 = new Date();
while (i < Infinity ) {
  velocities.forEach((vel, idx1) => {
    const pos1 = moonPositions[idx1];
    moonPositions.forEach((pos2, idx2) => {
      if (idx1 === idx2) return;
      Object.keys(vel).forEach(key => {
        if (pos1[key] > pos2[key]) {
          vel[key]--;
        } else if (pos1[key] < pos2[key]) {
          vel[key]++;
        }
      })
    });
  });
  moonPositions.forEach((pos, i) => {
    Object.keys(pos).forEach(key => {
      pos[key] = pos[key] + velocities[i][key];
    });
  });
  i++;
  if (moonPositions[0].x === initialPos[0].x && velocities[0].x === initialVel[0].x) {
    const velStr = JSON.stringify(velocities);
    // console.log({ i });
    if (velStr === initialVelStr) {
      const posStr = JSON.stringify(moonPositions);
      if (posStr === initialPosStr) {
        console.log({ i });
        break;
      }
    }
  }
  
  // console.log(moonPositions.map(JSON.stringify));
}

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