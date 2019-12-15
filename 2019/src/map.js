class Map2D {
  constructor (defaultValue = undefined) {
    this.array = [];
    this.defaultValue = defaultValue;
  }
  set(x, y, value) {
    let yArr = this.array[y];
    if (!yArr) {
      yArr = [];
      this.array[y] = yArr;
    }
    this.array[y][x] = value;
  }

  get(x, y) {
    return this.array[y] && this.array[y][x] || this.defaultValue;
  }
}

function getMatrix(map, defaultValue = 0) {
  const xPosArr = [], yPosArr = [];
  [...map.keys()].forEach(pos => {
    const formattedPos = pos.split(',').map(parseFloat);
    xPosArr.push(formattedPos[0]);
    yPosArr.push(formattedPos[1]);
  });
  const minX = Math.min(...xPosArr);
  const maxX = Math.max(...xPosArr);
  const minY = Math.min(...yPosArr);
  const maxY = Math.max(...yPosArr);

  // console.log( {minX, minY, maxX, maxY} );

  const matrix = [];
  const xOffset = 0 - minX;
  const yOffset = 0 - minY;

  let x = minX, y = minY;

  while (y <= maxY) {
    matrix[y + yOffset] = [];
    x = minX;
    while (x <= maxX) {
      const value = map.get(`${x},${y}`);
      matrix[y + yOffset][x + xOffset] = value || defaultValue;
      x++;
    }
    y++;
  }

  return matrix;
}

module.exports = {
  Map2D,
  getMatrix,
}