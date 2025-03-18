
const { FruitCircuit, GATE_OP_MAP } = require('./fruit-circuit');
const { FruitDevice, Wire } = require('./fruit-device');

module.exports = {
  day24Part1,
  day24Part2,
};

/* 
bks,hnd,nrn,tdv,tjp,z09,z16,z23 - correct
*/
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
  console.log('checkOutWire2():');
  let testWires = [
    'z00',
    'z01',
    'z02',
    // 'z23',
    // 'z45',

    'z09',
    // 'z17',
    // 'z37',
  ];
  testWires.forEach(testWire => {
    // let res = fruitCircuit.checkOutWire2(testWire);
    // if(res !== undefined) {
    //   console.log(res);
    // }
  });

  let problemGateMap = new Map();
  outWires.forEach(outWire => {
  // testWires.forEach(outWire => {
    let outRes = fruitCircuit.checkOutWire2(outWire);
    if(outRes !== undefined) {
      console.log(`${outWire}`);
      console.log(outRes);
      outRes.forEach(outErrGate => {
        problemGateMap.set(outErrGate.id, outErrGate);
      });
    }
    let inRes = fruitCircuit.checkInWires(outWire);
    if(inRes !== undefined) {
      console.log(`${outWire} (in)`);
      console.log(inRes);
      inRes.forEach(outErrGate => {
        problemGateMap.set(outErrGate.id, outErrGate);
      });
    }
  });
  let problemGates = [ ...problemGateMap.values() ];
  /*
    Now we can try and brute force the swaps
  _*/
  let pairs = getPairs(problemGates);
  // console.log(problemGates);
  // pairs.forEach(pair => {
  //   console.log(pair.map(gate => gate.id));
  // });
  console.log(pairs.length);

  return -1;
}

function checkFruitCircuitSwaps(fruitCircuit, swaps) {
  swaps.forEach(swapTuple => {
    let [ gate1, gate2 ] = swapTuple;
    let temp = gate1.out;
    gate1.out = gate2.out;
    gate2.out = temp;
  });
  /* test */
  let outWires = fruitCircuit.gates.filter(gate => {
    return FruitCircuit.checkZInput(gate.out);
  }).map(gate => {
    return gate.out;
  });
  let validCircuit = true;
  for(let i = 0; i < outWires.length; ++i) {
    let outWire = outWires[i];
    let outRes = fruitCircuit.checkOutWire2(outWire);
    if(outRes !== undefined) {
      validCircuit = false;
      // console.log(outRes.length);
      break;
    }
    let inRes = fruitCircuit.checkInWires(outWire);
    if(inRes !== undefined) {
      validCircuit = false;
      break;
    }
  }
  if(validCircuit) {
    console.log(swaps);
  }

  /* undo the swaps */
  swaps.forEach(swapTuple => {
    let [ gate1, gate2 ] = swapTuple;
    let temp = gate1.out;
    gate1.out = gate2.out;
    gate2.out = temp;
  });
}

function getPairCombos(elems, n) {
  let combos = [];
  helper([], 0);
  return combos;
  function helper(curr, start) {
    if(curr.length === n) {
      combos.push(curr.slice());
      return;
    }
    for(let i = start; i < elems.length; ++i) {
      curr.push(elems[i]);
      helper(curr, i + 1);
      curr.pop();
    }
  }
}

function getPairs(gates) {
  let pairs = [];
  for(let i = 0; i < gates.length - 1; ++i) {
    for(let k = i + 1; k < gates.length; ++k) {
      pairs.push([ gates[i], gates[k] ]);
    }
  }
  return pairs;
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
