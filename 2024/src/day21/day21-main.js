
const { Dirpad } = require('./dirpad');
const { Numpad } = require('./numpad');

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
  // let numpad = new Numpad();
  let numpad2 = new Numpad();
  let dirpad = new Dirpad();

  numpad2.onActivate(() => {
    console.log('activate');
  });
  numpad2.onKeyPress((keyVal) => {
    console.log(`keyVal: ${keyVal}`);
  });

  dirpad.onActivate(() => {
    console.log('dirpad activate');
  });
  dirpad.onKeyPress((keyVal) => {
    console.log(`dirpad.onKeyPress keyVal: ${keyVal}`);
  });

  for(let i = 0; i < numpad2.numKeys(); ++i) {
    try {
      numpad2.press(i);
    } catch(e) {
      console.error(e);
    }
  }

  for(let i = 0; i < dirpad.numKeys(); ++i) {
    try {
      dirpad.press(i);
    } catch(e) {
      console.error(e);
    }
  }

  return -1;
}
