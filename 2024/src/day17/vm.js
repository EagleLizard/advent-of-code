
class VM {
  constructor(a, b, c){
    this.a = a;
    this.b = b;
    this.c = c;
    this.instPtr = 0;
  }
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
  calculate balue of combo operand % 8
  output result
6 bdv - 
  same as adv
  write to B
7 cdv -
  same as adv
  write to C
_*/
class Instruction {
  constructor(opcode, operand) {
    this.opcode = opcode;
    this.operand = operand;
  }
}

module.exports = {
  VM,
  Instruction,
};
