
const { VM, Program } = require('./vm');
const assert = require('assert');

module.exports = {
  day17Part1,
  day17Part2,
};

/*
1,3,7,4,6,4,2,3,5 - correct
_*/
function day17Part1(inputLines) {
  let program = parseInput(inputLines);
  let vm = new VM();
  vm.load(program);
  while(vm.step());
  let outStr = vm.outBuf.join(',');
  return outStr;
}

/*
202367025818154 - correct
_*/
function day17Part2(inputLines) {
  let program = parseInput(inputLines);
  let aVal = seekInput2(program);
  let vm = new VM();
  vm.load(program);
  vm.a = aVal;
  while(vm.step());
  for(let i = 0; i < program.instructions.length; ++i) {
    /*
      Validate the correct A value by rerunning the program,
        test if the vm outputs the original program
    _*/
    assert(program.instructions[i] === vm.outBuf[i]);
  }
  return aVal;
}

function seekInput2(program) {
  let instructions = program.instructions.slice();
  let progPtr = instructions.length - 1;
  let doLoop = true;
  let aStack = [ 0n ];
  let kStack = [ ];
  let progSoFar = [];
  let backTrack = false;
  let vm = new VM();
  while(doLoop) {
    /*
      find the value of A that produces the current instruction
    _*/
    let k;
    if(backTrack) {
      backTrack = false;
      k = kStack.pop() + 1n;
      progSoFar.pop();
      aStack.pop();
      progPtr++;
    } else {
      k = 0n;
    }
    let currInst = instructions[progPtr];
    let currA = aStack[aStack.length - 1] * 8n;
    let advMag = false;
    while(k < 8n && !advMag) {
      let a = currA + k;
      vm.load(program);
      vm.a = a;
      while(vm.step());
      if(vm.outBuf[0] === currInst) {
        aStack.push(a);
        kStack.push(k);
        progSoFar.push(vm.outBuf[0]);
        advMag = true;
      } else {
        k++;
      }
    }
    if(advMag) {
      if(progPtr > 0) {
        progPtr--;
      } else {
        doLoop = false;
      }
    } else {
      backTrack = true;
    }
  }
  let aVal = aStack.pop();
  return aVal;
}

function parseInput(inputLines) {
  let parseRegisters = true;
  let parseProgram = false;
  let a, b, c;
  let program;
  let instructions = [];
  for(let i = 0; i < inputLines.length; ++i) {
    let inputLine = inputLines[i];
    if(parseRegisters) {
      if(inputLine.trim().length === 0) {
        parseRegisters = false;
        parseProgram = true;
      } else {
        let rx = /Register (?<label>[ABC]): (?<val>[0-9]+)+/;
        let rxExecRes = rx.exec(inputLine);
        let label = rxExecRes?.groups?.label;
        let val = +(rxExecRes?.groups?.val);
        switch(label) {
          case 'A':
            a = val;
            break;
          case 'B':
            b = val;
            break;
          case 'C':
            c = val;
            break;
          default:
            throw new Error(`Invalid register: ${inputLine}`);
        }
      }
    } else if(parseProgram) {
      /* parse program */
      let lineRx = /Program: (?<prog>(?:(?:[0-9]+),?)+)/g;
      let lineRxExecRes = lineRx.exec(inputLine);
      let progStr = lineRxExecRes?.groups?.prog;
      let rx = /[0-9]+/g;
      let rxIt = progStr.matchAll(rx);
      let rxItRes;
      while(!(rxItRes = rxIt.next()).done) {
        let progVal = +rxItRes.value;
        instructions.push(progVal);
      }
      parseProgram = false;
    }
  }
  program = new Program({ a, b, c }, instructions);
  return program;
}
