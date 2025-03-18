
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

  checkInWires(outWire) {
    let wireNum = FruitCircuit.wireNum(outWire);
    if(wireNum === 0) {
      /*
        the 00 bit is different
      _*/
      return;
    }
    let inXorGates = this.gates.filter(gate => {
      return gate.op === GATE_OP_MAP.XOR && (
        FruitCircuit.wireNum(gate.a) === wireNum
        || FruitCircuit.wireNum(gate.b) === wireNum
      );
    });
    if(inXorGates.length !== 1) {
      if(inXorGates.length === 0 && wireNum === 45) {
        /* The last bit won't have any input gates */
        return;
      }
      return inXorGates;
    }
    let inXorGate = inXorGates[0];
    let inAndGates = this.gates.filter(gate => {
      return gate.op === GATE_OP_MAP.AND && (
        FruitCircuit.wireNum(gate.a) === wireNum
        || FruitCircuit.wireNum(gate.b) === wireNum
      );
    });
    assert.strictEqual(inAndGates.length, 1);
    if(inAndGates.length !== 1) {
      return inAndGates;
    }
    let inAndGate = inAndGates[0];
    /*
      input AND should lead to OR (for carry to next bit)
        unless it's the 00 wire
    _*/
    let andDestGates = this.getDestGates(inAndGate.out);
    if(andDestGates.length !== 1) {
      // console.log('andDestGates:');
      // console.log(andDestGates);
      return andDestGates;
    }
    let andDestGate = andDestGates[0];
    assert.strictEqual(andDestGate.op, GATE_OP_MAP.OR);
    /*
      input XOR should lead to XOR and AND
    _*/
    let xorDestGates = this.getDestGates(inXorGate.out).toSorted((a, b) => {
      if(a.op > b.op) {
        return 1;
      } else if(a.op < b.op) {
        return -1;
      } else {
        return 0;
      }
    });
    if(xorDestGates.length !== 2) {
      return xorDestGates;
    }
    let [ xorAndGate, xorXorGate ] = xorDestGates;
    let errGates = [];
    if(xorAndGate.op !== GATE_OP_MAP.AND) {
      // return [ xorAndGate ];
      errGates.push(xorAndGate);
    }
    if(xorXorGate.op !== GATE_OP_MAP.XOR) {
      // return [ xorXorGate ];
      errGates.push(xorXorGate);
    }
    if(errGates.length > 0) {
      // console.log({ errGates });
    }
    /*
      The XOR XOR gate output wire should be the original out wire
    _*/
    if(xorXorGate.out !== outWire) {
      errGates.push(xorXorGate);
    }

    /*
      The xorAndGate should connect to the same OR gat as the input andDestGate
    _*/
    // console.log({
    //   xorAndGate,
    // });
    let xorAndDestGates = this.getDestGates(xorAndGate.out);
    if(xorAndDestGates.length !== 1) {
      // errGates.push(xorAndGate);
      errGates.push(inXorGate);
      // return errGates;
    }
    let xorAndDestGate = xorAndDestGates[0];
    if(xorAndDestGate?.id !== andDestGate.id) {
      // console.log({
      //   xorAndDestGate,
      //   andDestGate,
      // });
    }
    // console.log({ xorAndDestGates });

    if(errGates.length > 0) {
      return errGates;
    }
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
  GATE_OP_MAP,
};
