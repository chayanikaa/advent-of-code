// 206938-679128

const isValidPass = num => {
  const digits = num.toString().split('').map(parseFloat);
  let prev, duplicate;
  return digits.every(dig => {
    if (prev != null) {
      if (dig < prev) {
        return false;
      }
      if (prev === dig) {
        if (digits.filter(digit => digit === prev).length === 2) {
          duplicate = true;
        }
      }
    }
    prev = dig;
    return true;
  }) && duplicate;
};

let i = 206938;
let nValid = 0;

// console.log(isValidPass(123799));

while (i < 679128) {
  if (isValidPass(i)) {
    nValid++;
  }
  i++;
}

console.log(nValid);