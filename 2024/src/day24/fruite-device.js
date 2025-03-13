
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
  }

  getInputGates(inputWires) {
    let inputKeySet = new Set(inputWires.map(wire => wire.key));
    let inputGates = this.gates.filter(fdGate => {
      return inputKeySet.has(fdGate.lhs) && inputKeySet.has(fdGate.rhs);
    });
    console.log(inputGates);
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
