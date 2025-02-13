
const { VM, Instruction } = require('./vm');

module.exports = {
  day17Part1,
};

function day17Part1(inputLines) {
  let day17Input = parseInput(inputLines);
  let vm = day17Input.vm;
  let instructions = day17Input.instructions;
  console.log(vm);
  console.log(instructions);
  return -1;
}

function parseInput(inputLines) {
  let parseRegisters = true;
  let parseProgram = false;
  let a, b, c;
  let vm;
  let instructions = [];
  for(let i = 0; i < inputLines.length; ++i) {
    let inputLine = inputLines[i];
    if(parseRegisters) {
      if(inputLine.trim().length === 0) {
        parseRegisters = false;
        parseProgram = true;
        vm = new VM(a, b, c);
      } else {
        let rx = /Register (?<label>[ABC]): (?<val>[0-9])+/;
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
      let progVals = [];
      let rxItRes;
      while(!(rxItRes = rxIt.next()).done) {
        let progVal = +rxItRes.value;
        progVals.push(progVal);
      }
      for(let k = 0; k < progVals.length; k += 2) {
        let opcode = progVals[k];
        let operand = progVals[k + 1];
        let inst = new Instruction(opcode, operand);
        instructions.push(inst);
      }
      parseProgram = false;
    }
  }
  let res = {
    vm,
    instructions,
  };
  return res;
}
