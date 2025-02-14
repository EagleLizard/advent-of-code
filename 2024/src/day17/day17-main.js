
const { VM, Program } = require('./vm');

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

function day17Part2(inputLines) {
  let program = parseInput(inputLines);
  console.log(program.instructions.join(','));
  // seekInput(program);
  runProgDescA(program, 4048);
  return -1;
}

function runProgDescA(program, initA) {
  let vm = new VM();
  let a = initA;
  while(a > 0) {
    // console.log(a);
    vm.load(program);
    vm.a = a;
    while(vm.step());
    let outBuf = vm.outBuf;
    // console.log(outBuf);
    console.log(`${a} - 0o${a.toString(8)} - ${outBuf.join(',')}`);
    a -= 0o1000;
  }
}

function seekInput(program) {
  /* 
    Find the value of A that will produce the last 2 digits of
      the program.
    Store that value of A, then pop the digits from the stack
  _*/
  let vm = new VM();
  let instStack = program.instructions.slice();
  let aVals = [];
  let iterCount = 0;
  while(instStack.length > 0) {
    let currInst = instStack.splice(-2);
    let outBuf = [];
    let i = 0;
    console.log({ currInst });
    while(true) {
      vm.load(program);
      vm.a = i;
      while(vm.step());
      outBuf = vm.outBuf;
      if(
        (outBuf.length === 2)
        && (outBuf[0] === currInst[0])
        && (outBuf[1] === currInst[1])
      ) {
        aVals.push(i);
        break;
      }
      i++;
      // i += 0o10;
    }
    console.log(aVals);
    console.log(aVals.map(val => val.toString(8)));
    iterCount++;
    // if(iterCount > 2) {
    //   break;
    // }
  }
}

function runProg(program, a, vm) {
  vm = vm ?? new VM();
  vm.load(program);
  vm.a = a;
  while(vm.step());
  return vm.outBuf;
}

function opcodeStr(opcode) {
  return {
    [0]: 'adv',
    [1]: 'bxl',
    [2]: 'bst',
    [3]: 'jnz',
    [4]: 'bxc',
    [5]: 'out',
    [6]: 'bdv',
    [7]: 'cdv',
  }[opcode];
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
