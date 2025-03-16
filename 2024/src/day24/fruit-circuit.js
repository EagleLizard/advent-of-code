
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
  getSrcGates(wire) {
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
  getDestGates(wire) {
    let wireGates = [];
    this.gates.forEach(gate => {
      if(gate.a === wire || gate.b === wire) {
        wireGates.push(gate);
      }
    });
    return wireGates;
  }

  checkOutWire(outWire) {
    let outSrcGates = this.getSrcGates(outWire);
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

    let aSrcGates = this.getSrcGates(outSrcGate.a);
    let bSrcGates = this.getSrcGates(outSrcGate.b);
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
    // console.log({
    //   xorANum,
    //   xorBNum,
    //   srcZNum,
    // });

    // let inputWires = [ outSrcGate.a, outSrcGate.b ];
    let inputWires = [];

    for(let i = 0; i < inputWires.length; ++i) {
      let inputWire = inputWires[i];
      let srcGates = this.getSrcGates(inputWire);
      console.log(srcGates);
      /* There should be 0-1 gates leading to an output */
      if(srcGates.length !== 1) {
        /*
          invalid
        _*/
        return false;
      }
      assert(srcGates.length === 1);
      let srcGate = srcGates[0];
      // console.log(srcGate);
      /*
        One of the src gates leading to the output gate should be a XOR, where
          one input to the XOR is an x input and the other is a y input
      _*/
      if(srcGate.op === GATE_OP_MAP.XOR) {
        // console.log(srcGate.op);
        if(FruitCircuit.checkInputGate(srcGate)) {
          /*
            the input wire nums of this gate should match the source output gate
          _*/
          let an = FruitCircuit.wireNum(srcGate.a);
          let bn = FruitCircuit.wireNum(srcGate.b);
          let zn = FruitCircuit.wireNum(outSrcGate.out);
          if((an === bn) && (bn === zn)) {
            // valid
            console.log(`inputs: ${srcGate.a} ${srcGate.op} ${srcGate.b}`);
            console.log(`output: ${outSrcGate.out}`);
            // console.log(this.getDestGates(outSrcGate.out));
          }
        }
      }
      /*
        The 2nd bit will have a carry input from the first bit
      _*/
      if(srcGate.op === GATE_OP_MAP.AND) {
        let an = FruitCircuit.wireNum(srcGate.a);
        let bn = FruitCircuit.wireNum(srcGate.b);
        if(an === 0 && bn === 0) {
          /* valid, 2nd bit carry */
          console.log(`2nd bit carry: ${srcGate.a} ${srcGate.op} ${srcGate.b} -> ${srcGate.out}`);
        }
      }
    }

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
    let aDestGates = this.getDestGates(outSrcGate.a);
    let bDestGates = this.getDestGates(outSrcGate.b);
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
      AND: '&',
      OR: '|',
      XOR: '^',
    }[op];
  }
}

function gateStr(gate) {
  return `${gate.lhs} ${FruitCircuit.opStr(gate.op)} ${gate.rhs} -> ${gate.out}`;
}

module.exports = {
  FruitCircuit,
};
