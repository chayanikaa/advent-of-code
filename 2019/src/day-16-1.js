const inputStr = '59705379150220188753316412925237003623341873502562165618681895846838956306026981091618902964505317589975353803891340688726319912072762197208600522256226277045196745275925595285843490582257194963750523789260297737947126704668555847149125256177428007606338263660765335434914961324526565730304103857985860308906002394989471031058266433317378346888662323198499387391755140009824186662950694879934582661048464385141787363949242889652092761090657224259182589469166807788651557747631571357207637087168904251987880776566360681108470585488499889044851694035762709053586877815115448849654685763054406911855606283246118699187059424077564037176787976681309870931';

let input = [];//inputStr.split('').map(Number);

// let i = 0;

// while (i < 10000) {
//   input.push(...inputStr.split('').map(Number));
//   i++;
// }

const baseInput = [0, 1, 0, -1];

const messageOffset = input.slice(0, 7);
console.log(messageOffset);

const multiplierArray = input.map((_, i) => {
  const arr = baseInput.flatMap(mul => new Array(i + 1).fill(mul));
  const resultArr = [];
  console.log(arr.length, input.length);
  while (resultArr.length < (input.length + 1)) {
    resultArr.push(...arr);
  }
  arr.shift();
  return arr;
});

// console.log(multiplierArray);
// console.log(getResultAfterNPhases(input, 100).join(''));

function getResultAfterNPhases(input, nPhases) {
  let phase = 0;
  while (phase < nPhases) {
    input = input.map((digit, i) => {
      const result = input.reduce((acc, el, elIdx) => acc + el * multiplierArray[i][elIdx], 0);
      return Number(result.toString().split('').pop());
    });
    phase++;
  }
  return input;
}
