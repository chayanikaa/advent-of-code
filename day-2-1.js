const fs = require('fs');

const ip = fs.readFileSync('./day-2-ip.txt').toString().split(',').map(parseFloat);

// ip[1] = 12;
// ip[2] = 2;

//const ip = [1,1,1,4,99,5,6,0,99];

console.log(ip);

let i = 0;

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

console.log(ip);