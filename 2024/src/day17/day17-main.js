
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
  // runProgDescA(program, 4048);
  let a;
  a = 0o3763;
  a = 0o5; // 0
  a = 0o7; // 2
  // a = 0o10; // 1,5
  // a = 0o14; // 1,5
  // a = 0o17; // 2,5
  // a = 0o20; // 5,7
  // a = 0o23; // 2,7
  // a = 0o24; // 1,7
  // a = 0o30; // 1,6
  // a = 0o34; // 1,6
  // a = 0o37; // 2,6
  // a = 0o40; // 5,1
  // a = 0o44; // 0,1
  // a = 0o45; // 2,1
  // a = 0o46; // 3,1
  // a = 0o47; // 2,1
  // a = 0o50; // 1,0
  // a = 0o52; // 2,0
  // a = 0o53; // 4,0
  // a = 0o54; // 0,0
  // a = 0o55; // 2,0
  // a = 0o57; // 2,0
  // a = 0o60; // 5,3
  // a = 0o62; // 1,3
  // a = 0o63; // 2,4
  a = 0o64; // 0,3
  a = 0o54; // 0,0
  a = 0o44; // 0,1
  a = 0o32; // 4,6
  a = 0o15; // 0,5
  
  a = 0o640; // 5,0,3
  a = 0o564; // 0,3,1
  a = 0o56; // 3,0
  a = 0o560; // 5,3,0
  a = 0o5600; // 5,5,3,0
  a = 0o56006; // 3,5,5,3,0
  a = 0o560064; // 0,3,5,5,3,0
  a = 0o5600644; // 4,0,3,5,5,3,0
  // a = 0o5600645033031057;
  runPrintRegister(program, a);
  seekInput(program);
  return -1;
}

function seekInput(program) {
  /* 
    Find the value of A that produces the last 2 instructions   
  _*/
  let instructions = program.instructions.slice();
  let lastInst = instructions.splice(-2);
  console.log({
    lastInst,
  });
  let i = 0;
  let doLoop = true;
  let vm = new VM();
  while(doLoop) {
    vm.load(program);
    vm.a = i;
    while(vm.step());
    if(
      (lastInst[0] === vm.outBuf[0])
      && (lastInst[1] === vm.outBuf[1])
    ) {
      doLoop = false;
    } else {
      i++;
    }
  }
  let initA = i;
  console.log(initA);
  console.log(initA.toString(8));
  /* 
    All future values of A will begin with the octal that produced the last instruction,
      and additional outputs will be prefixed by appending in octal
  _*/
  console.log((initA * 8).toString(8));
  doLoop = true;
  i = 0;
  let currA = initA;
  let progSoFar = [ ...lastInst ];
  // console.log({ progSoFar });
  while(doLoop && (instructions.length > 0)) {
    let nextInst = instructions.pop();
    progSoFar.unshift(nextInst);
    let nextA = currA * 8;
    let k = 0;
    let doLoop2 = true;
    while(doLoop2) {
      let a = nextA + k;
      vm.load(program);
      vm.a = a;
      while(vm.step());
      if(
        (vm.outBuf[0] === nextInst)
        && (vm.outBuf.every((bufVal, bufIdx) => {
          return bufVal === progSoFar[bufIdx];
        }))
      ) {
        console.log({ progSoFar: progSoFar.join(',') });
        console.log(vm.outBuf.join());
        doLoop2 = false;
      } else {
        k++;
        if(k > 7) {
          /* 
            We should only seek so far as the current octal digit,
              as additional octal digits in the A register will
              result in additional output
          */
          throw new Error(`k: ${k}, i: ${i}`);
        }
      }
    }
    currA = nextA + k;
    i++;
    if(i > 10) {
      console.log(i);
      break;
    }
  }
  console.log(currA);
  console.log(currA.toString(8));
}

function runPrintRegister(program, aVal) {
  let vm = new VM();
  console.log(program.instructions.toReversed().join(','));
  vm.load(program);
  vm.a = aVal;
  let doLoop = true;
  let prevA = undefined;
  while(doLoop) {
    if(vm.a !== prevA) {
      console.log({
        a: vm.a,
      });
      console.log(`0o${vm.a.toString(8)}`);
      // console.log(`${vm.a.toString(2)}`);
      prevA = vm.a;
    }
    let res = vm.step();
    if(res === false) {
      doLoop = false;
    }
  }
  console.log(vm.outBuf);
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
