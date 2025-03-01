
const { Dirpad } = require('./dirpad');
const { Numpad } = require('./numpad');
const { Robot } = require('./robot');

const numpadKeyVals = [
  7, 8, 9,
  4, 5, 6,
  1, 2, 3,
  undefined, 0, 'A',
];
const dirpadKeyVal = [
  undefined, 0, 'A',
  3, 2, 1
];

module.exports = {
  day21Part1,
};

function day21Part1(inputLines) {
  let day21Input = parseInput(inputLines);
  let codes = day21Input.codes;
  let numpad = new Numpad();
  let pressedNumKeys = [];
  numpad.onKeyPress((val) => {
    console.log(val);
    pressedNumKeys.push(val);
  });
  numpad.onActivate((val) => {
    pressedNumKeys.push(val);
    console.log(pressedNumKeys);
  });
  let r1 = new Robot(numpad);
  let r2 = new Robot(r1.dirpad);
  let r3 = new Robot(r2.dirpad);
  let dirpad = r3.dirpad;
  // let r1Moves = r1.pathToKey(0);
  // for(let i = 0; i < r1Moves.length; ++i) {
  //   let r1Mv = r1Moves[i];
  //   let r2Moves = r2.pathToKey(r1Mv);
  //   console.log('r2Moves');
  //   console.log(r2Moves);
  // }
  let robots = [
    r1,
    r2,
    r3,
  ];
  
  // r2.pressKey(0, 1); // L
  // r2.pressKey(1, 1); // D
  // r2.pressKey(0, 1); // L
  // r2.pressKey(2, 0); // A
  // /* inner robot L */
  // r2.pressKey(2, 1); // R
  // r2.pressKey(2, 1); // R
  // r2.pressKey(1, 0); // U
  // r2.pressKey(2, 0); // A
  // /* inner robot A */

  /*
  robot.pressKey(0, 1); // L
  robot.pressKey(2, 0); // A
  robot.pressKey(1, 0); // U
  robot.pressKey(2, 0); // A
  robot.pressKey(2, 1); // R
  robot.pressKey(1, 0); // U
  robot.pressKey(1, 0); // U
  robot.pressKey(2, 0); // A
  robot.pressKey(1, 1); // D
  robot.pressKey(1, 1); // D
  robot.pressKey(1, 1); // D
  robot.pressKey(2, 0); // A
  _*/
  return -1;
}

function getMovesToNumpad(robots, code) {
  
}

function parseInput(inputLines) {
  let codes = [];
  for(let i = 0; i < inputLines.length; ++i) {
    let inputLine = inputLines[i];
    let code = [];
    for(let k = 0; k < inputLine.length; ++k) {
      let c = inputLine[k];
      if(/[0-9]/.test(c)) {
        code.push(+c);
      } else {
        code.push(c);
      }
    }
    codes.push(code);
  }
  let res = {
    codes,
  };
  return res;
}
