import { inputAsArray } from './utils/util';
import { promises as fs } from 'fs';

const requiredFields = ['byr', 'iyr', 'eyr', 'hgt', 'hcl',
'ecl', 'pid'];
const optionalFields = ['cid'];

function isValid2(passport: any) {
  // console.log(passport);
  const byr = parseInt(passport.byr, 10);
  if (isNaN(byr) || byr < 1920 || byr > 2002) {
    return false;
  }
  const iyr = parseInt(passport.iyr, 10);
  if (isNaN(iyr) || iyr < 2010 || iyr > 2020) {
    return false;
  }
  const eyr = parseInt(passport.eyr, 10);
  if (isNaN(eyr)|| eyr < 2020 || eyr > 2030) {
    return false;
  }
  const hgt: string = passport.hgt;
  if (!/^\d+(cm|in)$/.test(hgt)) {
    return false;
  }
  const hgtNum = parseInt(hgt, 10);
  // console.log(hgtNum, hgt.substring(hgt.length - 2));
  if (hgt.substring(hgt.length - 2) === 'cm') {
    if (isNaN(hgtNum) || hgtNum < 150 || hgtNum > 193) {
      return false;
    }
  } else {
    if (isNaN(hgtNum) || hgtNum < 59 || hgtNum > 76) {
      return false;
    }
  }
  const hcl: string = passport.hcl;
  if (!/^#[0-9a-f]{6}$/.test(hcl)) {
    return false;
  }
  const ecl = passport.ecl;
  if (!['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(ecl)) {
    return false;
  }
  const pid = passport.pid;
  if (!/^[0-9]{9}$/.test(pid)) {
    return false;
  }
  return true;
}

function isValid(passport: Object) {
  if (requiredFields.some(reqField => {
    return !Object.keys(passport).includes(reqField);
  })) {
    return false;
  }
  return true;
}

async function readPassports() {
  const buffer = await fs.readFile('inputs/4.txt');
  const str = buffer.toString();
  let passStrings = str.split('\n\n');
  // console.log(passStrings);
  return passStrings.map(passStr => {
    const passParts = [ ...passStr.split('\n') ];
    // console.log(passParts);
    const nonFlatArr = [ ...passParts.map(passPart => passPart.split(' ')) ];
    const fieldArr = nonFlatArr.reduce((acc, arr) => {
      return [ ...acc, ...arr];
    }, []);
    const obj: any = {};
    fieldArr.forEach(fieldStr => {
      const entry = fieldStr.split(':');
      obj[entry[0]] = entry[1];
    });
    return obj;
  });
}

readPassports().then(passports => {
  console.log('Part 1', passports.filter(isValid).length);
  console.log('Part 2', passports.filter(isValid2).length);
});
