
const { FruitDevice } = require('./fruite-device');

module.exports = {
  day24Part1,
};

/*
  53190357879014 - correct
_*/
function day24Part1(inputLines) {
  let day24Input = parseInput(inputLines);
  let fruitDevice = new FruitDevice();
  day24Input.inputWires.forEach(inputWire => {
    let [ wireStr, val ] = inputWire;
    fruitDevice.addInputWire(wireStr, val);
  });
  day24Input.gates.forEach(gate => {
    let [ lhs, op, rhs, outWire ] = gate;
    fruitDevice.addGate(lhs, op, rhs, outWire);
  });
  // console.log(fruitDevice);
  // fruitDevice.clock();
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
