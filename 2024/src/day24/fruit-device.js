
class FruitDevice {
  constructor(inputWireTuples, gateTuples) {
    this.wires = new Map();
    this.gates = [];
    inputWireTuples?.forEach(inputWireTuple => {
      let [ wireStr, val ] = inputWireTuple;
      this.addInputWire(wireStr, val);
    });
    gateTuples?.forEach(gateTuple => {
      let [ lhs, op, rhs, outWire ] = gateTuple;
      this.addGate(lhs, op, rhs, outWire);
    });
  }

  clock() {
    /* get gates that have valid inputs */
    let inputGates = this.getGatesWithInputs();
    let gateUpdates = [];
    for(let i = 0; i < inputGates.length; ++i) {
      let gate = inputGates[i];
      let res = this.getGateRes(gate);
      let currOutVal = this.getWireVal(gate.out);
      if(currOutVal !== res) {
        // console.log(`${gate.lhs} ${FruitDevice.opStr(gate.op)} ${gate.rhs} => ${gate.out}`);
        gateUpdates.push([ gate.out, res ]);
        this.setWireVal(gate.out, res);
      }
    }
    return gateUpdates.length > 0;
  }

  getGateRes(fdGate) {
    let lVal = this.getWireVal(fdGate.lhs);
    let rVal = this.getWireVal(fdGate.rhs);
    let op = fdGate.op;
    let res;
    switch(op) {
      case 'AND':
        res = (lVal === 1 && rVal === 1) ? 1 : 0;
        break;
      case 'OR':
        res = (lVal === 1 || rVal === 1) ? 1 : 0;
        break;
      case 'XOR':
        res = (rVal !== lVal) ? 1 : 0;
        break;
      default:
        throw new Error(`Unexpected op: ${op}`);
    }
    return res;
  }
  getWireVal(wireKey) {
    return this.wires.get(wireKey).val;
  }
  setWireVal(wireKey, val) {
    return this.wires.get(wireKey).val = val;
  }

  getXBits() {
    let xBits = [ ...this.wires.values() ]
      .filter(wire => /^x/i.test(wire.key))
      .toSorted(Wire.compAsc)
      .map(wire => wire.val)
    ;
    return xBits;
  }
  getYBits() {
    let yBits = [ ...this.wires.values() ]
      .filter(wire => /^y/i.test(wire.key))
      .toSorted(Wire.compAsc)
      .map(wire => wire.val)
    ;
    return yBits;
  }
  getZBits() {
    let zBits = [ ...this.wires.values() ]
      .filter(wire => /^z/i.test(wire.key))
      .toSorted(Wire.compAsc)
      .map(wire => wire.val)
    ;
    return zBits;
  }

  getOutput() {
    let outputWires = [ ...this.wires.values() ]
      .filter(wire => /^z/i.test(wire.key))
      .toSorted(Wire.compAsc)
    ;
    let outputNum = 0;
    outputWires.forEach((outputWire, idx) => {
      if(outputWire.val === 1) {
        outputNum += 2 ** idx;
      }
    });
    return outputNum;
  }

  getGatesToUpdate() {
    let gatesToUpdate = this.getGatesWithInputs()
      .filter(gate => {
        let currOutVal = this.getWireVal(gate.out);
        return currOutVal !== this.getGateRes(gate);
      });
    return gatesToUpdate;
  }

  getGatesWithInputs() {
    let inputWires = this.getInputs();
    let inputKeySet = new Set(inputWires.map(wire => wire.key));
    let inputGates = this.gates.filter(fdGate => {
      return inputKeySet.has(fdGate.lhs) && inputKeySet.has(fdGate.rhs);
    });
    return inputGates;
  }

  getInputs() {
    let inputs = [ ...this.wires.values() ].filter(wire => {
      return wire.val > -1;
    });
    return inputs;
  }

  getInputGates(srcGate) {
    let self = this;
    let inputGates = [];
    let inputWires = [ srcGate.lhs, srcGate.rhs ];
    inputWires.forEach(inputWire => {
      let foundGate = this.gates.find(gate => {
        return gate.out === inputWire;
      });
      if(foundGate !== undefined) {
        inputGates.push(foundGate);
      }
    });
    // helper(srcGate);
    return inputGates;
    function helper(outGate) {
      if(outGate === undefined) {
        return;
      }
      let lGate = self.gates.find(gate => {
        return gate.out === outGate.lhs;
      });
      let rGate = self.gates.find(gate => {
        return gate.out === outGate.rhs;
      });
      helper(lGate);
      helper(rGate);
      if(lGate !== undefined) {
        inputGates.push(lGate);
      }
      if(rGate !== undefined) {
        inputGates.push(rGate);
      }
    }
  }

  addInputWire(wireStr, val) {
    let wire;
    wireStr = wireStr.trim();
    if(this.wires.has(wireStr)) {
      throw new Error(`Attempt to add wire input that already exists: ${wireStr}`);
    }
    wire = new Wire(wireStr, val);
    this.wires.set(wireStr, wire);
  }
  addGate(lhs, op, rhs, outWire) {
    let fdGate;
    if(!this.wires.has(lhs)) {
      // throw new Error(`Attempt to add gate with no lhs: ${lhs}`);
      this.addInputWire(lhs);
    }
    if(!this.wires.has(rhs)) {
      // throw new Error(`Attempt to add gate with no rhs: ${rhs}`);
      this.addInputWire(rhs);
    }
    if(!this.wires.has(outWire)) {
      this.addInputWire(outWire);
    }
    fdGate = new FdGate(lhs, op, rhs, outWire);
    this.gates.push(fdGate);
  }

  static opStr(op) {
    return {
      AND: '&',
      OR: '|',
      XOR: '^',
    }[op];
  }
}

module.exports = {
  FruitDevice,
};

function FdGate(lhs, op, rhs, outWire) {
  let self = this;
  self.lhs = lhs;
  self.op = op;
  self.rhs = rhs;
  self.out = outWire;
}

function Wire(wireKey, val) {
  let self = this;
  self.key = wireKey;
  /* -1 indicates no value _*/
  self.val = val ?? -1;
}

Wire.compAsc = (a, b) => {
  if(a.key > b.key) {
    return 1;
  } else if(a.key < b.key) {
    return -1;
  } else {
    return 0;
  }
};
