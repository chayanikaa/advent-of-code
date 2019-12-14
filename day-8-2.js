const fs = require('fs');

// const encodedImageData = '0222112222120000';
// const height = 2;
// const width = 2;

const encodedImageData = fs.readFileSync('./day-8-ip.txt').toString();
const height = 6;
const width = 25;

const digits = encodedImageData.split('').map(parseFloat);
const depth = digits.length / (height * width);

const final = computeFinalImage({ digits, height, width, depth});
 
renderLayer({ layer: final, height, width });

function renderLayer({ layer, height, width }) {
  let currHeight = 0;
  const map = [' ', '0'];
  // const map = ['  ', '\u2591\u2591'];
    const rendered = layer.map(pixel => map[pixel]);
    while (currHeight < height) {
      console.log(rendered.slice(currHeight * width, (currHeight + 1) * width).join(''));
      currHeight++;
    }
}

function computeFinalImage({ digits, depth, height, width }) {
  const decoded = decodeImageData({ digits, depth, height, width });
  const final = [];
  let i = 0;

  while (i < width * height) {
    let pixel = 2;
    let nLayer = 0;
    while (pixel === 2 && nLayer < depth) {
      pixel = decoded[nLayer][i];
      nLayer++;
    }
    final[i] = pixel;
    i++;
  }
  return final;
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

