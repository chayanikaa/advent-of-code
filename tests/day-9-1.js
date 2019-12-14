const fs = require('fs');

var assert = require('assert');
var chai = require('chai');
var expect = chai.expect;

const {
  runProgram
} = require('../int-computer.js');

const fullProgram = fs.readFileSync('./day-9-ip.txt').toString().split(',').map(parseFloat);
const fullProgram2 = fs.readFileSync('./day-9-ip-2.txt').toString().split(',').map(parseFloat);


describe('runProgram with opcode 9', () => {
  it('example one', () => {
    const program = [109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99];
    const output = [];
    runProgram([...program], [], output);
    console.log(output);
    expect(output).to.eql(program);
  });

  it('example two', () => {
    const program = [1102,34915192,34915192,7,4,7,99,0];
    const output = [];
    runProgram(program, [], output);
    expect(output[0].toString().length).to.eql(16);
  });

  it('large number', () => {
    const program = [104,1125899906842624,99];
    const output = [];
    runProgram(program, [], output);
    expect(output[0]).to.eql(program[1]);
  })

  it('main ip', () => {
    const program = [ ...fullProgram ];
    const output = [];
    runProgram(program, [1], output);
    console.log(output);
    expect(output[0]).to.eql(3512778005);
  });

  it('main ip: boost mode', () => {
    const program = [ ...fullProgram ];
    const output = [];
    runProgram(program, [2], output);
    console.log(output);
    expect(output[0]).to.eql(35920);
  }).timeout(50000);

  it('main ip 2: test mode', () => {
    const program = [ ...fullProgram2 ];
    console.log(program);
    const output = [];
    runProgram(program, [1], output);
    console.log(output);
    expect(output[0]).to.eql(3512778005);
  });
});
