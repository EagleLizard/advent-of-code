
const { FruitCircuit } = require('./fruit-circuit');
const { FruitDevice, Wire } = require('./fruit-device');

module.exports = {
  day24Part1,
  day24Part2,
};

function day24Part2(inputLines) {
  let day24Input = parseInput(inputLines);
  let inputWires = day24Input.inputWires;
  let gates = day24Input.gates;
  let fruitCircuit = new FruitCircuit(gates);

  let outWires = fruitCircuit.gates.filter(gate => {
    return FruitCircuit.checkZInput(gate.out);
  }).map(gate => gate.out)
    .toSorted(FruitCircuit.wireCompAsc)
  ;
  // console.log(outputWires);
  outWires.forEach(outWire => {
    // console.log(outputWire);
    // let res = fruitCircuit.checkOutWire(outWire);
    // if(res !== true) {
    //   console.log(outWire);
    // }
  });

  // fruitCircuit.checkOutWire('z00');
  // fruitCircuit.checkOutWire('z01');
  // fruitCircuit.checkOutWire('z02');
  // fruitCircuit.checkOutWire('z03');
  // fruitCircuit.checkOutWire('z23');
  // fruitCircuit.checkOutWire('z45');

  console.log('checkOutWire2():');
  
  outWires.forEach(outWire => {
    // fruitCircuit.checkOutWire2(outWire);
  });

  let testWires = [
    'z00',
    'z01',
    'z02',
    'z23',
    'z45',
  ];
  testWires.forEach(testWire => {
    let res = fruitCircuit.checkOutWire2(testWire);
    if(res !== undefined) {
      console.log(res);
    }
  });
  // fruitCircuit.checkOutWire2('z00');
  // fruitCircuit.checkOutWire2('z01');
  // fruitCircuit.checkOutWire2('z02');
  // fruitCircuit.checkOutWire2('z45');
  /*
    each output should be connected to one XOR
    one input wire of XOR should connect to 2 input bits
    one input wire of XOR should connect to a carry bit
  _*/
  // console.log(fruitCircuit.getGates('rqf'));
  // console.log(fruitCircuit.getGates('rjt'));

  return -1;
}

function gateStr(gate) {
  return `${gate.lhs} ${FruitDevice.opStr(gate.op)} ${gate.rhs} -> ${gate.out}`;
}

function bitsToInt(bitArr) {
  let n = 0;
  for(let i = 0; i < bitArr.length; ++i) {
    if(bitArr[i] === 1) {
      n += 2 ** i;
    }
  }
  return n;
}

/*
  53190357879014 - correct
_*/
function day24Part1(inputLines) {
  let day24Input = parseInput(inputLines);
  let inputWires = day24Input.inputWires;
  let gates = day24Input.gates;
  let fruitDevice = new FruitDevice(inputWires, gates);

  while(fruitDevice.clock());
  let output = fruitDevice.getOutput();
  return output;
}

function parseInput(inputLines) {
  let parseInputWires = true;
  let inputWires = [];
  let gates = [];
  inputLines.forEach(inputLine => {
    if(parseInputWires) {
      if(/\w+: (?:0|1)/.test(inputLine)) {
        let [ wire, valStr ] = inputLine.split(': ');
        inputWires.push([ wire, +valStr ]);
      } else {
        parseInputWires = false;
      }
    } else {
      /* parse gates */
      if(/\w+ \w+ \w+ -> \w+/.test(inputLine)) {
        let [ opStr, outWire ] = inputLine.split(' -> ');
        let [ lhs, op, rhs ] = opStr.split(' ');
        gates.push([ lhs, op, rhs, outWire ]);
      }
    }
  });
  let res = {
    inputWires,
    gates,
  };
  return res;
}
