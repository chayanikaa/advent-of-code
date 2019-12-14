const fs = require('fs');

// const encodedImageData = '123456789012';
// const height = 2;
// const width = 3;

// const encodedImageData = '123456789012000000';
// const height = 2;
// const width = 3;

const encodedImageData = fs.readFileSync('./day-8-ip.txt').toString();

const height = 6;
const width = 25;

const digits = encodedImageData.split('').map(parseFloat);
console.log(digits.length);


// console.log(digits.length);
const depth = digits.length / (height * width);

// console.log(depth);

const resultLayer = getLayerWithFewestZero({ digits, height, width, depth });

const finalAnswer = resultLayer.filter(dig => dig === 1).length * resultLayer.filter(dig => dig === 2).length;

console.log({ finalAnswer });


function getLayerWithFewestZero({ digits, height, width, depth }) {
  const decoded = decodeImageData({ digits, height, width, depth });

  // const layerData = decoded.flat();

  // const zeroData = countZeroes(layerData);

  // console.log(layerData.length);
  const nZeroes = countZeroes(decoded);
  console.log({ nZeroes });
  // console.log(decoded.length);
  const minZeroes = Math.min(...nZeroes);
  return decoded[nZeroes.indexOf(minZeroes)];
}

function countZeroes(layerData) {
  return layerData.map(layer => layer.filter(digit => digit === 0).length);
}

function decodeImageData({ digits, height, width, depth }) {
  // console.log({ digits, height, width, depth });
  let currHeight = 0, currWidth = 0, currDepth = 0;
  const perLayer = height * width;
  const result = [];

  while (currDepth < depth) {
    result.push([]);
    while (currHeight < height) {
      while (currWidth < width) {
        result[currDepth].push(digits[ currDepth * perLayer + currHeight * width + currWidth ]);
        // result[currDepth][currHeight][currWidth] = digits[ currDepth * perLayer + currHeight * width + currWidth ];
        currWidth++;
      }
      currWidth = 0;
      currHeight++;
    }
    currHeight = 0;
    currDepth++;
  }

  return result;
}

