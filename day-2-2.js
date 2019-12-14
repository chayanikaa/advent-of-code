const fs = require('fs');

const orig = fs.readFileSync('./day-2-ip.txt').toString().split(',').map(parseFloat);

// ip[1] = 12;
// ip[2] = 2;

//const ip = [1,1,1,4,99,5,6,0,99];

// console.log(ip);

let x = 0;
let y = 0;
let ip;

do {
  ip = [...orig];
  let i = 0;
  if (y === 99) {
    x++;
    y = 0;
  } else {
    y++;
  }
  ip[1] = x;
  ip[2] = y;
  while(i < ip.length) {
    if (ip[i] === 1) {
      ip[ ip[i+3] ] = ip[ ip[i+1] ] + ip[ ip[i+2] ];
    }
    else if (ip[i] === 2) {
      ip[ ip[i+3] ] = ip[ ip[i+1] ] * ip[ ip[i+2] ];
    }
    else if (ip[i] === 99) {
      break;
    }
    i += 4;
  }
  console.log(ip[0], x, y);
} while (ip[0] !== 19690720 && x < 100 && y < 100)


console.log(ip[0], x, y);