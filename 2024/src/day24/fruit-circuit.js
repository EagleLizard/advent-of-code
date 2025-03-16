
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
    console.log(outWire);
    /* There should be 1 gate leading to an output */
    assert(outSrcGates.length === 1);
    let outSrcGate = outSrcGates[0];
    console.log(outSrcGate);
    /* An output gate should be connected to a XOR gate _*/
    if(outSrcGate.op === GATE_OP_MAP.XOR) {
      // valid
      console.log(`${outSrcGate.op} ${outWire} - valid`);
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
        console.log(`first input: ${outSrcGate.a} ${outSrcGate.op} ${outSrcGate.b} -> ${outSrcGate.out}`);
        // valid
        return;
      }
    }

    let inputWires = [ outSrcGate.a, outSrcGate.b ];
    inputWires.forEach(inputWire => {
      let srcGates = this.getSrcGates(inputWire);
      /* There should be 0-1 gates leading to an output */
      assert(srcGates.length === 1);
      let srcGate = srcGates[0];
      console.log(srcGate);
      /*
        One of the src gates leading to the output gate should be a XOR, where
          one input to the XOR is an x input and the other is a y input
      _*/
      if(srcGate.op === GATE_OP_MAP.XOR) {
        console.log(srcGate.op);
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
      /* The input bits should feed into AND gates for a carry _*/
    });
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
    return /^x\d+/.test(wire);
  }
  static checkYInput(wire) {
    return /^y\d+/.test(wire);
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
