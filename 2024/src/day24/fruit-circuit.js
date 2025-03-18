
const assert = require('assert');

const GATE_OP_MAP = {
  AND: 'AND',
  OR: 'OR',
  XOR: 'XOR',
};

/*
  util for visualizing and analyzing logic gates / circuits
_*/
let gateIdCounter = 0;
class FcGate {
  constructor(a, op, b, out) {
    this.a = a;
    this.op = op;
    this.b = b;
    this.out = out;

    this.id = gateIdCounter++;
  }
}

/* representing with a graph might help */
class FruitCircuit {
  constructor(gateTuples) {
    this.gates = [];
    gateTuples?.forEach(gateTuple => {
      let [ lhs, op, rhs, out ] = gateTuple;
      this.addGate(lhs, op, rhs, out);
    });
  }
  addGate(a, op, b, out) {
    let fcGate = new FcGate(a, op, b, out);
    this.gates.push(fcGate);
  }
  /* 
    Get gates where the wire is an output
  */
  _getSrcGates(wire) {
    let wireGates = [];
    this.gates.forEach(gate => {
      // if(gate.a === wire || gate.b === wire || gate.out === wire) {
      if(gate.out === wire) {
        wireGates.push(gate);
      }
    });
    return wireGates;
  }
  /* 
    Get gates where the wire is an input
  _*/
  _getDestGates(wire) {
    let wireGates = [];
    this.gates.forEach(gate => {
      if(gate.a === wire || gate.b === wire) {
        wireGates.push(gate);
      }
    });
    return wireGates;
  }

  checkOutWire2(outWire) {
    // console.log(`\n_outWire: ${outWire}`);
    /*
      For the initial gate connected to the out wire,
      There are 4 valid cases:
        1. both a and b wires are input bits, and don't lead to gates
        2. one input wire leads to a XOR, and the other leads to an AND
          - 2nd bit, the AND is the carry from bit 1
        3. one input wire leads to a XOR, and the other leads to an OR
          - the OR is the carry from the prev. bit
          - most output wires will be this case
        4. both a nd b wire lead to AND gates
          - one AND gate leads to input bits
          - one AND gate leads to previous carry
      All cases except the last case, the initial gate is a XOR.
      In the last case, the initial gate is an OR
    _*/
    let outGate = this.getSrcGate(outWire);
    if(
      outGate.op !== GATE_OP_MAP.XOR
      && outGate.op !== GATE_OP_MAP.OR
    ) {
      return [ outGate ];
    }
    if(outGate.op === GATE_OP_MAP.XOR) {
      if(this.checkFirstOutBit(outGate)) {
        return;
      }
      if(this.checkSecondBitCarry(outGate)) {
        return;
      }
      /* at this point, it should be a full adder */
      if(this.checkFullAdderOutBit(outGate)) {
        return;
      }
    }
    if(outGate.op === GATE_OP_MAP.OR) {
      if(this.checkLastOutBit(outGate)) {
        return;
      }
    }
    return [ outGate ];
  }

  checkFullAdderOutBit(outGate) {
    let xorGate = this.getAdderXorGate(outGate);
    if(xorGate === undefined) {
      return false;
    }
    /*
      The XOR gate should have input gates that match the outGate's
        output bit - e.g. x02 = y02 = z02
    _*/
    if(!this.checkAdderInOutWires(xorGate, outGate)) {
      return false;
    }
    /* 
      the XOR gate input wires should both lead to the same AND gate
        for the carry-out
    _*/
    let inputCarryGate = this.getAdderInputCarryGate(xorGate);
    if(inputCarryGate === undefined) {
      return false;
    }
    /*
      The XOR gate output should lead to an AND gate for the carry
    _*/
    let xorCarryGate = this.getAdderXorCarryGate(xorGate, outGate);
    if(xorCarryGate === undefined) {
      return false;
    }
    /*
      There should be two carry gates, both ands, and both should have
        an output wire that leads to the same OR gate for the carry
    _*/
    let inputCarryOrGate = this.getAdderCarryOrGate(inputCarryGate.out);
    if(inputCarryOrGate === undefined) {
      return false;
    }
    let xorCarryOrGate = this.getAdderCarryOrGate(xorCarryGate.out);
    if(xorCarryOrGate === undefined) {
      return false;
    }
    if(inputCarryOrGate.id !== xorCarryOrGate.id) {
      return false;
    }
    return true;
  }
  getAdderCarryOrGate(carryGateWire) {
    let carryDestGates = this.getDestGates(carryGateWire);
    if(
      carryDestGates.length !== 1
      || carryDestGates[0].op !== GATE_OP_MAP.OR
    ) {
      return;
    }
    return carryDestGates[0];
  }
  getAdderXorCarryGate(xorGate, outGate) {
    let xorDestGates = this.getDestGates(xorGate.out).filter(gate => {
      return gate.id !== outGate.id;
    });
    if(xorDestGates.length !== 1) {
      return;
    }
    if(xorDestGates[0].op !== GATE_OP_MAP.AND) {
      return;
    }
    let xorCarryGate = xorDestGates[0];
    return xorCarryGate;
  }
  getAdderXorGate(outGate) {
    let aSrcGate = this.getSrcGate(outGate.a);
    let bSrcGate = this.getSrcGate(outGate.b);
    let hasValidGates = (
      aSrcGate.op === GATE_OP_MAP.XOR
      && bSrcGate.op === GATE_OP_MAP.OR
    ) || (
      aSrcGate.op === GATE_OP_MAP.OR
      && bSrcGate.op === GATE_OP_MAP.XOR
    );
    if(!hasValidGates) {
      return;
    }
    let xorGate = (aSrcGate.op === GATE_OP_MAP.XOR)
      ? aSrcGate
      : bSrcGate
    ;
    return xorGate;
  }
  getAdderInputCarryGate(xorGate) {
    let xorAGates = this.getDestGates(xorGate.a).filter(gate => {
      return gate.id !== xorGate.id;
    });
    let xorBGates = this.getDestGates(xorGate.b).filter(gate => {
      return gate.id !== xorGate.id;
    });
    if(
      (xorAGates.length !== 1 || xorBGates.length !== 1)
      || (xorAGates[0].id !== xorBGates[0].id)
      || (xorAGates[0].op !== GATE_OP_MAP.AND)
    ) {
      return;
    }
    return xorAGates[0];
  }
  checkAdderInOutWires(xorGate, outGate) {
    let inANum = FruitCircuit.wireNum(xorGate.a);
    let inBNum = FruitCircuit.wireNum(xorGate.b);
    let outZNum = FruitCircuit.wireNum(outGate.out);
    let hasValidInOutWires = (
      inANum === inBNum
      && inBNum === outZNum
    );
    return hasValidInOutWires;
  }

  checkLastOutBit(outGate) {
    let aSrcGate = this.getSrcGate(outGate.a);
    let bSrcGate = this.getSrcGate(outGate.b);
    let hasAndGates = (
      aSrcGate.op === GATE_OP_MAP.AND
      && bSrcGate.op === GATE_OP_MAP.AND
    );
    return hasAndGates;
  }

  checkFirstOutBit(outGate) {
    let hasInputBits = (
      FruitCircuit.checkInput(outGate.a)
      && FruitCircuit.checkInput(outGate.b)
    );
    if(!hasInputBits) {
      return false;
    }
    let aNum = FruitCircuit.wireNum(outGate.a);
    let bNum = FruitCircuit.wireNum(outGate.b);
    let outNum = FruitCircuit.wireNum(outGate.out);
    let isFirstOutBit = (
      aNum === bNum
      && bNum === outNum
    );
    return isFirstOutBit;
  }
  checkSecondBitCarry(outGate) {
    let aSrcGate = this.getSrcGate(outGate.a);
    let bSrcGate = this.getSrcGate(outGate.b);
    let hasCarryGates = (
      aSrcGate.op === GATE_OP_MAP.XOR
      && bSrcGate.op === GATE_OP_MAP.AND
    ) || (
      aSrcGate.op === GATE_OP_MAP.AND
      && bSrcGate.op === GATE_OP_MAP.XOR
    );
    if(!hasCarryGates) {
      return false;
    }
    let xorGate, andGate;
    if(aSrcGate.op === GATE_OP_MAP.XOR) {
      xorGate = aSrcGate;
      andGate = bSrcGate;
    } else {
      xorGate = bSrcGate;
      andGate = aSrcGate;
    }
    /*
      inputs of XOR gate should be 2nd input bits (01)
      inputs of AND gate should be 1st input gits (00)
    _*/
    let xorANum = FruitCircuit.wireNum(xorGate.a);
    let xorBNum = FruitCircuit.wireNum(xorGate.b);
    let andANum = FruitCircuit.wireNum(andGate.a);
    let andBNum = FruitCircuit.wireNum(andGate.b);
    return (
      xorANum === 1
      && xorBNum === 1
      && andANum === 0
      && andBNum === 0
    );
  }

  /*
    Get the gates the wire is going to
  _*/
  getDestGates(wire) {
    let outGates = this.gates.filter(gate => {
      return gate.a === wire || gate.b === wire;
    });
    return outGates;
  }

  /*
    Get the gate the wire came from
  _*/
  getSrcGate(wire) {
    let inputGates = this.gates.filter(gate => gate.out === wire);
    assert(inputGates.length <= 1);
    // assert.equal(inputGates.length, 1);
    return inputGates[0];
  }

  hasInputGate(wire) {
    return this.gates.find(gate => gate.out === wire) !== undefined;
  }

  checkOutWire(outWire) {
    let outSrcGates = this._getSrcGates(outWire);
    // console.log(outWire);
    /* There should be 1 gate leading to an output */
    assert(outSrcGates.length === 1);
    let outSrcGate = outSrcGates[0];
    // console.log(outSrcGate);
    /* An output gate should be connected to a XOR gate _*/
    if(outSrcGate.op === GATE_OP_MAP.XOR) {
      // valid
      // console.log(`${outSrcGate.op} ${outWire} - valid`);
    }
    /*
      If it's the first output gate, the input wires won't connect to
        other gates - they should be the first input gates
    _*/
    if(FruitCircuit.checkInputGate(outSrcGate)) {
      let an = FruitCircuit.wireNum(outSrcGate.a);
      let bn = FruitCircuit.wireNum(outSrcGate.b);
      let zn = FruitCircuit.wireNum(outSrcGate.out);
      if(an === 0 && bn === 0 && zn === 0) {
        // console.log(`first input: ${outSrcGate.a} ${outSrcGate.op} ${outSrcGate.b} -> ${outSrcGate.out}`);
        // valid
        return true;
      }
    }
    let hasSrcXor = false;
    let hasSrcCarry = false;

    let aSrcGates = this._getSrcGates(outSrcGate.a);
    let bSrcGates = this._getSrcGates(outSrcGate.b);
    if(aSrcGates.length !== 1) {
      /* invalid _*/
      return false;
    }
    if(bSrcGates.length !== 1) {
      /* invalid _*/
      return false;
    }
    let aSrcGate = aSrcGates[0];
    let bSrcGate = bSrcGates[0];
    // console.log({ aSrcGate });
    // console.log({ bSrcGate });
    /* 
      expect one gate to be a XOR, and the other gate to be an OR
        for the carry bit
    _*/
    let srcXorGate, srcOrGate;
    if(aSrcGate.op === GATE_OP_MAP.XOR && bSrcGate.op === GATE_OP_MAP.OR) {
      srcXorGate = aSrcGate;
      srcOrGate = bSrcGate;
    } else if(bSrcGate.op === GATE_OP_MAP.XOR && aSrcGate.op === GATE_OP_MAP.OR) {
      srcXorGate = bSrcGate;
      srcOrGate = aSrcGate;
    } else if(aSrcGate.op === GATE_OP_MAP.AND || bSrcGate.op === GATE_OP_MAP.AND) {
      /*
        The 2nd output bit will have a carry from the first output bit
      _*/
      let andGate = (aSrcGate.op === GATE_OP_MAP.AND)
        ? aSrcGate
        : bSrcGate
      ;
      let otherGate = (andGate.id === aSrcGate.id) ? bSrcGate : aSrcGate;
      /*
        The other gate should be a XOR in this case
      _*/
      if(otherGate.op !== GATE_OP_MAP.XOR) {
        /* invalid */
        console.log({
          andGate,
          otherGate,
        });
        return false;
      } else {
        // console.log({
        //   outSrcGate,
        //   andGate,
        //   otherGate,
        // });
        /*
          In this case, the AND should have the carry from the 1st
            set of inputs - x00, y00
          The XOR should be the 2nd set of inputs - x01, y01
        _*/
        let andANum = FruitCircuit.wireNum(andGate.a);
        let andBNum = FruitCircuit.wireNum(andGate.b);
        let otherANum = FruitCircuit.wireNum(otherGate.a);
        let otherBNum = FruitCircuit.wireNum(otherGate.b);
        let srcZNum = FruitCircuit.wireNum(outWire);
        /* Check that the AND gate has inputs from the 1st 2 input bits _*/
        return (
          FruitCircuit.checkInputGate(andGate)
          && (andANum === 0)
          && (andBNum === 0)
        ) && (
          FruitCircuit.checkInputGate(otherGate)
          && (otherANum === 1)
          && (otherBNum === 1)
          && (srcZNum === 1)
        );
      }
    } else {
      /* invalid */
      console.log({
        outSrcGate,
        aSrcGate,
        bSrcGate,
      });
      return false;
    }

    // console.log({ srcOrGate });
    /*
      The OR gate should be connected to two AND gates.
        since this is part of the previous circuits carry,
        might not need to check it right now.
    _*/

    /*
      The XOR gate should have 2 input wires that are a or b inputs,
        the a and b input numbers should be equal,
        the src z out wire gate should equal the a and b input numbers
    _*/
    let xorANum = FruitCircuit.wireNum(srcXorGate.a);
    let xorBNum = FruitCircuit.wireNum(srcXorGate.b);
    let srcZNum = FruitCircuit.wireNum(outWire);
    if(
      (
        xorANum === undefined
        || xorBNum === undefined
      ) || !(
        xorANum === xorBNum
        && xorBNum === srcZNum
      )
    ) {
      /* invalid */
      return false;
    }
    /*
      The XOR gate will lead to the src output gate,
        and it should also lead to an AND gate for the carry
    _*/
    let xorDestGates = this._getDestGates(srcXorGate.out)
      .filter(xorDestGate => {
        /* filter out the source gate */
        return xorDestGate.id !== outSrcGate.id;
      })
    ;
    // console.log({
    //   xorDestGates,
    // });
    if(xorDestGates.length !== 1) {
      /* invalid (?) _*/
      console.log('invalid:');
      console.log({
        xorDestGates,
      });
      return false;
    }
    let xorDestGate = xorDestGates[0];
    /*
      The XOR dest gate should be an AND for the carry-out
    _*/
    if(xorDestGate.op !== GATE_OP_MAP.AND) {
      /* invalid (?) */
      console.log({ xorDestGate });
      return false;
    }
    /*
      The inputs to the XOR AND gate should be the XOR gate itself,
        and the gate from the previous carry - which should be an OR
    _*/
    let xdAndASrcGates = this._getSrcGates(xorDestGate.a);
    let xdAndBSrcGates = this._getSrcGates(xorDestGate.b);
    console.log({
      xdAndASrcGates,
      xdAndBSrcGates,
    });

    // console.log({
    //   xorANum,
    //   xorBNum,
    //   srcZNum,
    // });

    /*
      The input bits should feed into 2 gates each,
        Unless: the output bit is the last output bit (?)
        Those 2 bits are
          1. AND gate for a carry
          2. XOR gate for output bit
        The dest gates should be the same for both input bits
    _*/
    // let inputWiresDestGates = [];
    // let inputWiresDestGates = inputWires.map(inputWire => {
    //   return this.getDestGates(inputWire);
    // });
    let aDestGates = this._getDestGates(outSrcGate.a);
    let bDestGates = this._getDestGates(outSrcGate.b);
    /*
      both input wires should have the same destination gates,
        the XOR to the output gate, plus the AND to the carry-out
    _*/
    let srcGateInputsMatch = (
      (aDestGates.length === bDestGates.length)
      && aDestGates.every(aDestGate => {
        let foundBDestGate = bDestGates.find(bDestGate => {
          return aDestGate.id === bDestGate.id;
        });
        return foundBDestGate !== undefined;
      })
    );
    if(!srcGateInputsMatch) {
      // invalid
      console.error(outSrcGate);
      throw new Error('input wires have different destination gates');
    }
    /*
      Every set of input wires to the out gate will lead to:
        1. itself 
          a. XOR
          b. OR if last output bit
       2.
          a. AND to the carry-out
          b. [none] if the last output bit
    _*/
    let inputDestGates = aDestGates.filter(aDestGate => {
      /* filter out the source output gate */
      return aDestGate.id !== outSrcGate.id;
    });
    // console.log(outSrcGate);
    // console.log(inputDestGates);
    let validLastOutputBit = (
      inputDestGates.length === 0
      && outSrcGate.op === GATE_OP_MAP.OR
    );
    let validInputToCarryOut = (
      inputDestGates.length === 1
      && inputDestGates[0].op === GATE_OP_MAP.AND
    );
    if(!validLastOutputBit && !validInputToCarryOut) {
      // invalid
      // console.log('invalid - inputDestGates:');
      // console.log(inputDestGates);
      return false;
    }
    if(inputDestGates.length === 0 && outSrcGate.op === GATE_OP_MAP.OR) {
      // valid, last output bit
    } else if(inputDestGates.length === 1 && inputDestGates[0].op === GATE_OP_MAP.AND) {
      // valid, input wire leads to subsequent carry-out
    } else {
      // invalid
      console.log('invalid - inputDestGates:');
      console.log(inputDestGates);
      return false;
    }
    return true;
    /*
      If it's the last bit, it could be the carry from the previous steps.
        If it is the carry from a previous step, 
    _*/
    // console.log(aDestGates);
    
  }

  /* Check if a gate is connected to 2 inputs */
  static checkInputGate(gate) {
    let isInputGate = (
      (FruitCircuit.checkXInput(gate.a) && FruitCircuit.checkYInput(gate.b))
      || (FruitCircuit.checkXInput(gate.b) && FruitCircuit.checkYInput(gate.a))
    );
    return isInputGate;
  }
  static checkInput(wire) {
    return FruitCircuit.checkXInput(wire) || FruitCircuit.checkYInput(wire);
  }
  static checkXInput(wire) {
    return /^x\d+/i.test(wire);
  }
  static checkYInput(wire) {
    return /^y\d+/i.test(wire);
  }
  static checkZInput(wire) {
    return /^z\d+/i.test(wire);
  }
  static wireNum(wire) {
    if(!/^(?:x|y|z)\d+/.test(wire)) {
      return undefined;
    }
    return +wire.substring(1);
  }
  static checkWireNumsMatch(wires, val) {
    let wireNums = [];
    let wiresMatch = true;
    for(let i = 0; i < wires.length; ++i) {
      let wire = wires[i];
      let wireNum = FruitCircuit.wireNum(wire);
      if(wireNum === undefined) {
        return undefined;
      }
      if(i > 0) {
        wiresMatch = (val === undefined)
          ? wireNum === wireNums[0]
          : wireNum === val
        ;
      }
      if(!wiresMatch) {
        break;
      }
      wireNums.push(wireNum);
    }
    return wiresMatch;
  }
  static wireCompAsc(a, b) {
    if(a > b) {
      return 1;
    } else if (a < b) {
      return -1;
    } else {
      return 0;
    }
  }

  static opStr(op) {
    return {
      // AND: '&',
      // OR: '|',
      // XOR: '^',
      AND: 'AND',
      OR: 'OR ',
      XOR: 'XOR',
    }[op];
  }
}

function gateStr(gate) {
  // return `${gate.a} ${gate.op} ${gate.b} -> ${gate.out}`;
  return `${gate.a} ${FruitCircuit.opStr(gate.op)} ${gate.b} -> ${gate.out}`;
}

module.exports = {
  FruitCircuit,
};
