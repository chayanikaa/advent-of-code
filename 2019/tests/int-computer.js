const fs = require('fs');

var assert = require('assert');
var chai = require('chai');
var expect = chai.expect;

const {
  runProgram
} = require('../src/int-computer');

const origIP = fs.readFileSync('2019/data/day-5-ip.txt').toString().split(',').map(parseFloat);

describe('runProgram', () => {
  it('should process simple request correctly 1', () => {
    const program = [1,1,1,4,99,5,6,0,99];
    const result = runProgram(program);
    expect(result.exitCode).to.eql(99);
    expect(program).to.eql([30,1,1,4,2,5,6,0,99]);
  });

  it('should process simple request correctly 2', () => {
    const program = [1002,4,3,4,33];
    const result = runProgram(program);
    expect(result.exitCode).to.eql(99);
  });

  it('should produce correct diagnostic code: day 5, 1', () => {
    const program = [...origIP];
    const output = [];
    const result = runProgram(program, [1], output);
    expect(result.exitCode).to.eql(99);
    expect(output.pop()).to.eql(4601506);
  });

  it('should produce correct diagnostic code: day 5, 1', () => {
    const program = [...origIP];
    const output = [];
    const result = runProgram(program, [5], output);
    expect(result.exitCode).to.eql(99);
    expect(output.pop()).to.eql(5525561);
  });

  it('should process simple conditional: equal', () => {
    const program = [3,9,8,9,10,9,4,9,99,-1,8];
    const output = [];
    const result = runProgram(program, [8], output);
    expect(result.exitCode).to.eql(99);
    expect(output.pop()).to.eql(1);
  });

  it('should process simple conditional: equal', () => {
    const program = [3,9,8,9,10,9,4,9,99,-1,8];
    const output = [];
    const result = runProgram(program, [2], output);
    expect(result.exitCode).to.eql(99);
    expect(output.pop()).to.eql(0);
  });

  it('should process simple conditional: less than', () => {
    const program = [3,9,7,9,10,9,4,9,99,-1,8];
    const output = [];
    const result = runProgram(program, [2], output);
    expect(result.exitCode).to.eql(99);
    expect(output.pop()).to.eql(1);
  });

  it('should process simple conditional: less than', () => {
    const program = [3,9,7,9,10,9,4,9,99,-1,8];
    const output = [];
    const result = runProgram(program, [9], output);
    expect(result.exitCode).to.eql(99);
    expect(output.pop()).to.eql(0);
  });

  it('should process simple conditional: equal, immediate mode', () => {
    const program = [3,3,1108,-1,8,3,4,3,99];
    const output = [];
    const result = runProgram(program, [9], output);
    expect(result.exitCode).to.eql(99);
    expect(output.pop()).to.eql(0);
  });

  it('should process simple conditional: equal, immediate mode', () => {
    const program = [3,3,1108,-1,8,3,4,3,99];
    const output = [];
    const result = runProgram(program, [8], output);
    expect(result.exitCode).to.eql(99);
    expect(output.pop()).to.eql(1);
  });

  it('should process simple conditional: less than, immediate', () => {
    const program = [3,3,1107,-1,8,3,4,3,99];
    const output = [];
    const result = runProgram(program, [2], output);
    expect(result.exitCode).to.eql(99);
    expect(output.pop()).to.eql(1);
  });

  it('should process simple conditional: less than, immediate', () => {
    const program = [3,3,1107,-1,8,3,4,3,99];
    const output = [];
    const result = runProgram(program, [9], output);
    expect(result.exitCode).to.eql(99);
    expect(output.pop()).to.eql(0);
  });

  it('jump test, checking is input is 0, position, 0 input', () => {
    const program = [3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9];
    const output = [];
    const result = runProgram(program, [0], output);
    expect(result.exitCode).to.eql(99);
    expect(output.pop()).to.eql(0);
  });

  it('jump test, checking is input is 0, position, non 0 input', () => {
    const program = [3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9];
    const output = [];
    const result = runProgram(program, [34], output);
    expect(result.exitCode).to.eql(99);
    expect(output.pop()).to.eql(1);
  });

  it('jump test, checking is input is 0, immediate, 0 input', () => {
    const program = [3,3,1105,-1,9,1101,0,0,12,4,12,99,1];
    const output = [];
    const result = runProgram(program, [0], output);
    expect(result.exitCode).to.eql(99);
    expect(output.pop()).to.eql(0);
  });

  it('jump test, checking is input is 0, immediate, non 0 input', () => {
    const program = [3,3,1105,-1,9,1101,0,0,12,4,12,99,1];
    const output = [];
    const result = runProgram(program, [34], output);
    expect(result.exitCode).to.eql(99);
    expect(output.pop()).to.eql(1);
  });

  it('processes jump example correctly: input 8', () => {
    const program = [3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,
      1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,
      999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99];
    const output = [];
    const result = runProgram(program, [8], output);
    expect(result.exitCode).to.eql(99);
    expect(output.pop()).to.eql(1000);
  });

  it('processes jump example correctly: input less than 8', () => {
    const program = [3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,
      1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,
      999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99];
    const output = [];
    const result = runProgram(program, [7], output);
    expect(result.exitCode).to.eql(99);
    expect(output.pop()).to.eql(999);
  });

  it('processes jump example correctly: input greater than 8', () => {
    const program = [3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,
      1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,
      999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99];
    const output = [];
    const result = runProgram(program, [1000], output);
    expect(result.exitCode).to.eql(99);
    expect(output.pop()).to.eql(1001);
  });
});