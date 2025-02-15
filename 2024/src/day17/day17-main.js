
const { VM, Program } = require('./vm');
const { VmError } = require('../lib/errors/vm-error');
const assert = require('assert');

module.exports = {
  day17Part1,
  // day17Part2,
  day17Part2: day17Part2_2,
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
function day17Part2_2(inputLines) {
  let program = parseInput(inputLines);
  let aVal = seekInput2(program);
  let vm = new VM();
  vm.load(program);
  vm.a = aVal;
  while(vm.step());
  for(let i = 0; i < program.instructions.length; ++i) {
    assert(program.instructions[i] === vm.outBuf[i]);
  }
  return aVal;
}

function seekInput2(program) {
  let instructions = program.instructions.slice();
  console.log(instructions.join(','));
  let progPtr = instructions.length - 1;
  let doLoop = true;
  // let currA = 0;
  let aStack = [ 0n ];
  let kStack = [ ];
  let progSoFar = [];
  let iterCount = 0;
  let backTrack = false;
  while(doLoop) {
    /*
      find the value of A that produces the current instruction
    _*/
    // let k = 0n;
    let k;
    if(backTrack) {
      backTrack = false;
      k = kStack.pop() + 1n;
      // aStack.pop();
      progSoFar.pop();
      aStack.pop();
      progPtr++;
    } else {
      k = 0n;
    }
    let currInst = instructions[progPtr];
    console.log({currInst});
    // let currA = aStack[aStack.length - 1] * 8n;
    let currA = aStack[aStack.length - 1] * 8n;
    let advMag = false;
    while(k < 8n && !advMag) {
      let a = currA + k;
      let vm = new VM();
      vm.load(program);
      vm.a = a;
      while(vm.step());
      if(vm.outBuf[0] === currInst) {
        console.log(vm.outBuf.join(','));
        aStack.push(a);
        kStack.push(k);
        progSoFar.push(vm.outBuf[0]);
        advMag = true;
      } else {
        k++;
      }
    }
    if(advMag) {
      console.log({
        // aStack,
        a: aStack[aStack.length - 1],
        aOct: aStack[aStack.length - 1].toString(8),
        kStack: kStack.join(','),
        progSoFar: progSoFar.toReversed().join(','),
      });
      console.log(progPtr);
      if(progPtr > 0) {
        progPtr--;
      } else {
        doLoop = false;
      }
    } else {
      console.log('backtrack');
      backTrack = true;
    }
    if(iterCount++ > 35) {
      doLoop = false;
    }
  }
  // console.log(aStack);
  let aVal = aStack.pop();
  return aVal;
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
  a = 0o56006446; // 1,4,0,3,5,5,3,0
  a = 0o5600644607; // 4,5,1,4,0,3,5,5,3,0
  a = 0o5600644613; // 4,5,1,4,0,3,5,5,3,0
  a = 0o5600644617; // 4,5,1,4,0,3,5,5,3,0
  a = 0o5600644625; // 1,1,1,4,0,3,5,5,3,0
  a = 0o5600644626; // 0,1,1,4,0,3,5,5,3,0
  a = 0o5600644627; // 4,1,1,4,0,3,5,5,3,0
  a = 0o5600644630; // 1,2,1,4,0,3,5,5,3,0
  a = 0o5600644631; // 5,2
  a = 0o5600644633; // 0,2
  a = 0o5600644635; // 1,2
  a = 0o5600644637; // 4,2
  a = 0o5600644640; // 5,0
  a = 0o5600644646; // 0,0
  a = 0o5600644647; // 4,0
  a = 0o5600644650; // 1,3
  a = 0o5600644651; // 5,3
  a = 0o5600644653; // 4,3
  a = 0o5600644657; // 4,3
  a = 0o5600644660; // 5,1
  a = 0o5600644662; // 1,1
  a = 0o5600644664; // 4,1
  a = 0o5600644666; // 0,1
  a = 0o5600644667; // 4,1
  a = 0o5600644670; // 1,6
  a = 0o5600644671; // 5,6
  a = 0o5600644674; // 4,6
  a = 0o5600644677; // 4,6
  a = 0o5600644700; // 5,1
  a = 0o5600644702; // 7,1
  a = 0o5600644710; // 1,5
  a = 0o5600644711; // 5,5
  a = 0o56006446; // 1,4,0,3,5,5,3,0
  a = 0o56006470; //
  // a = 0o5600645033031057;
  // runPrintRegister(program, BigInt(a));
  try {
    seekInput(program);
  } catch(e) {
    if(e instanceof VmError) {
      console.log(`${e.name}: ${e.message}\n${e.stack?.split('\n')[1]}`);
    }
  }
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
    vm.a = BigInt(i);
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
  let initA = BigInt(i);
  console.log(initA);
  console.log(initA.toString(8));
  /* 
    All future values of A will begin with the octal that produced the last instruction,
      and additional outputs will be prefixed by appending in octal
  _*/
  console.log((initA * 8n).toString(8));
  doLoop = true;
  i = 0n;
  let currA = initA;
  let progSoFar = [ ...lastInst ];
  let kStack = [];
  // console.log({ progSoFar });
  while(doLoop && (instructions.length > 0)) {
    let nextInst = instructions.pop();
    progSoFar.unshift(nextInst);
    let nextA = currA * 8n;
    let k = 0n;
    let doLoop2 = true;
    let backTrack = false;
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
        console.log(a);
        console.log(`0o${a.toString(8)}`);
        console.log(`k: ${k}`);
        // console.log({ progSoFar: progSoFar.join(',') });
        // console.log(vm.outBuf);
        console.log(vm.outBuf.join());
        doLoop2 = false;
        kStack.push(k);
      } else {
        k++;
        if(k > 7n) {
          /* 
            We should only seek so far as the current octal digit,
              as additional octal digits in the A register will
              result in additional outputs
          _*/
          doLoop2 = false;
          backTrack = true;
          // throw new Error(`k: ${k}, i: ${i}`);
        }
      }
    }
    if(backTrack) {
      console.log({
        nextInst,
        progSoFar: progSoFar.join(','),
        // progSoFarN: progSoFar,
        kStack: kStack,
      });
      backTrack = false;
      throw new VmError(`k: ${k}, i: ${i}`);
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
  // console.log(program.instructions.toReversed().join(','));
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
  console.log(vm.outBuf.join(','));
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
