
const { VM, Program } = require('./vm');

module.exports = {
  day17Part1,
};

function day17Part1(inputLines) {
  let program = parseInput(inputLines);
  let vm = new VM();
  vm.load(program);
  while(vm.step());
  let outStr = vm.outBuf.join(',');
  return outStr;
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
