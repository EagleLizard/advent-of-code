
class VM {
  constructor(){
    this.a = 0n;
    this.b = 0n;
    this.c = 0n;
    this.instPtr = 0n;

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
    let operand = this.instructions[this.instPtr + 1n];

    switch(opcode) {
      /* adv */
      case 0n:
        this.a = this.a / (2n ** this.getCombo(operand));
        this.instPtr += 2n;
        break;
      /* bxl */
      case 1n:
        this.b = this.b ^ operand;
        this.instPtr += 2n;
        break;
      /* bst */
      case 2n:
        this.b = this.getCombo(operand) % 8n;
        this.instPtr += 2n;
        break;
      /* jnz */
      case 3n:
        if(this.a !== 0n) {
          this.instPtr = operand;
        } else {
          this.instPtr += 2n;
        }
        break;
      /* bxc */
      case 4n:
        this.b ^= this.c;
        this.instPtr += 2n;
        break;
      /* out */
      case 5n:
        this.outBuf.push(this.getCombo(operand) % 8n);
        this.instPtr += 2n;
        break;
      /* bdv */
      case 6n:
        this.b = this.a / (2n ** this.getCombo(operand));
        this.instPtr += 2n;
        break;
      /* cdv */
      case 7n:
        this.c = this.a / (2n ** this.getCombo(operand));
        this.instPtr += 2n;
        break;
    }
    if(this.instPtr >= this.instructions.length) {
      return false;
    }
    return {
      opcode,
      operand,
    };
    // return this.instPtr < this.instructions.length;
  }

  getCombo(operand) {
    switch(operand) {
      case 0n:
      case 1n:
      case 2n:
      case 3n:
        return operand;
      case 4n:
        return this.a;
      case 5n:
        return this.b;
      case 6n:
        return this.c;
      case 7n:
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
    this.instPtr = 0n;
  }
}

class Program {
  constructor(registers, instructions) {
    this.registers = {
      a: BigInt(registers.a),
      b: BigInt(registers.b),
      c: BigInt(registers.c),
    };
    this.instructions = instructions.slice().map(n => BigInt(n));
  }
}

module.exports = {
  VM,
  Program,
};
