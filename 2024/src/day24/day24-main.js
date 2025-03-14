
const { FruitDevice } = require('./fruit-device');

module.exports = {
  day24Part1,
  day24Part2,
};

function day24Part2(inputLines) {
  let day24Input = parseInput(inputLines);
  let inputWires = day24Input.inputWires;
  let gates = day24Input.gates;
  let fruitDevice = new FruitDevice(inputWires, gates);
  let xBits = fruitDevice.getXBits();
  let xVal = bitsToInt(xBits);
  let yBits = fruitDevice.getYBits();
  let yVal = bitsToInt(yBits);
  let targetOutput = xVal + yVal;
  let targetOutputBits = targetOutput.toString(2).split('').map(bit => +bit).toReversed();
  // console.log(`targetOutput: ${targetOutput.toLocaleString()}`);
  console.log(`targetOutput: ${targetOutput}`);
  console.log(`${targetOutputBits.join('')}`);
  
  let clockCount = 0;
  let gatesToUpdate;
  let prevOutBits = fruitDevice.getZBits();
  console.log(prevOutBits.map(bit => (bit === -1) ? '|' : bit).join(''));
  while((gatesToUpdate = fruitDevice.getGatesToUpdate()).length > 0) {
    // console.log(clockCount);
    /* get the gates that would be updated */
    gatesToUpdate.forEach(gate => {
      let nextVal = fruitDevice.getGateRes(gate);
      if(/^z/i.test(gate.out)) {
        // console.log(gateStr(gate));
        // console.log(`${fruitDevice.getWireVal(gate.lhs)} ${FruitDevice.opStr(gate.op)} ${fruitDevice.getWireVal(gate.rhs)} -> ${nextVal}`);
      }
      fruitDevice.setWireVal(gate.out, nextVal);
    });
    let zBits = fruitDevice.getZBits();
    let zBitStr = zBits.map(bit => (bit === -1) ? '|' : bit).join('');
    if(!prevOutBits.every((outBit, idx) => outBit === zBits[idx])) {
      // console.log(`${targetOutputBits.join('')}`);
      console.log(`${zBitStr} - ${clockCount}`);
      prevOutBits = zBits;
    }
    clockCount++;
    if(clockCount > 0) {
      // break;
    }
  }

  return -1;
}

function gateUpdateStr(gate, lVal, rVal, oVal) {
  return `${gate.lhs} ${lVal} ${FruitDevice.opStr(gate.op)} ${gate.rhs} ${rVal} -> ${gate.out} ${oVal}`;
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
