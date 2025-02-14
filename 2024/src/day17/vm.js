
class VM {
  constructor(){
    this.a = 0;
    this.b = 0;
    this.c = 0;
    this.instPtr = 0;

    this.program = undefined;
    this.instructions = undefined;
    
    this.outBuf = undefined;
  }

  /*
    0 adv -
      divide val in A by operand^2
      write to A
    1 bxl -
      bitwise XOR of B and operand (literal)
      write to B
    2 bst -
      combo operand % 8
      write to B
    3 jnz -
      if A == 0, do nothing.
        Else, jump to instruction at operand (literal)
        Instruction pointer does not increment by 2 after jnz
    4 bxc - 
      bitwise XOR of B and C
      write to B
    5 out - 
      calculate value of combo operand % 8
      output result
    6 bdv - 
      same as adv
      write to B
    7 cdv -
      same as adv
      write to C
    _*/
  step() {
    let opcode = this.instructions[this.instPtr];
    let operand = this.instructions[this.instPtr + 1];
    switch(opcode) {
      /* adv */
      case 0:
        this.a = Math.floor(this.a / (2 ** this.getCombo(operand)));
        this.instPtr += 2;
        break;
      /* bxl */
      case 1:
        this.b ^= operand;
        this.instPtr += 2;
        break;
      /* bst */
      case 2:
        this.b = this.getCombo(operand) % 8;
        this.instPtr += 2;
        break;
      /* jnz */
      case 3:
        if(this.a !== 0) {
          this.instPtr = operand;
        } else {
          this.instPtr += 2;
        }
        break;
      /* bxc */
      case 4:
        this.b ^= this.c;
        this.instPtr += 2;
        break;
      /* out */
      case 5:
        this.outBuf.push(this.getCombo(operand) % 8);
        this.instPtr += 2;
        break;
      /* bdv */
      case 6:
        this.b = Math.floor(this.a / (2 ** this.getCombo(operand)));
        this.instPtr += 2;
        break;
      /* cdv */
      case 7:
        this.c = Math.floor(this.a / (2 ** this.getCombo(operand)));
        this.instPtr += 2;
        break;
    }
    return this.instPtr < this.instructions.length;
  }

  getCombo(operand) {
    switch(operand) {
      case 0:
      case 1:
      case 2:
      case 3:
        return operand;
      case 4:
        return this.a;
      case 5:
        return this.b;
      case 6:
        return this.c;
      case 7:
        // invalid
    }
    return;
  }

  load(program) {
    this.a = program.registers.a;
    this.b = program.registers.b;
    this.c = program.registers.c;
    this.instructions = program.instructions.slice();
    this.program = program;
    this.outBuf = [];
  }
}

class Program {
  constructor(registers, instructions) {
    this.registers = {
      a: registers.a,
      b: registers.b,
      c: registers.c,
    };
    this.instructions = instructions.slice();
  }
}

module.exports = {
  VM,
  Program,
};
