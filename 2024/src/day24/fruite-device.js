
class FruitDevice {
  constructor() {
    this.wires = new Map();
    this.gates = [];
  }

  clock() {
    /* find all gates for inputs */
    let inputs = this.getInputs();
    // console.log(inputs);
    /* get gates that accept inputs */
    let inputGates = this.getInputGates(inputs);
    // console.log(inputGates);
    let gateUpdates = [];
    for(let i = 0; i < inputGates.length; ++i) {
      let gate = inputGates[i];
      let res = this.getGateRes(gate);
      let currOutVal = this.getWireVal(gate.out);
      // console.log(`${gate.out}: ${currOutVal} -> ${res}`);
      if(currOutVal !== res) {
        gateUpdates.push([ gate.out, res ]);
        this.setWireVal(gate.out, res);
      }
    }
    // console.log(gateUpdates);
    return gateUpdates.length > 0;
    // inputGates.forEach(fdGate => this.execGate(fdGate));
    
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

  getOutput() {
    let outputWires = [ ...this.wires.values() ]
      .filter(wire => /^z/i.test(wire.key))
      .toSorted((a, b) => {
        if(a.key > b.key) {
          return 1;
        } else if(a.key < b.key) {
          return -1;
        } else {
          return 0;
        }
      })
    ;
    // 53190357879014n
    // console.log(outputWires);
    // let outputNum = 0n;
    // for(let i = 0n; i < outputWires.length; ++i) {
    //   if(outputWires[i].val === 1) {
    //     outputNum += 2n ** i;
    //   }
    // }
    let outputNum = 0;
    outputWires.forEach((outputWire, idx) => {
      if(outputWire.val === 1) {
        outputNum += 2 ** idx;
      }
    });
    return outputNum;
    // console.log(outputBits);
    // return outputBits;
  }

  getInputGates(inputWires) {
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
