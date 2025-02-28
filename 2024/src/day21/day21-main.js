const { Keypad } = require('./keypad');
const { Numpad } = require('./numpad');

const numpadKeyVals = [
  7, 8, 9,
  4, 5, 6,
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
  let numpad = new Numpad();
  
  /*
    clockwise starting w/ up:
      0,1,2,3 = up,right,down,left
  _*/
  let dirpad = new Keypad();
  // console.log(numpad.keys);
  // console.log(dirpad.keys);
  // numpad.press(0, 0);
  // numpad.press(1, 0);
  // numpad.press(2, 0);
  // numpad.press(0, 1);
  // numpad.press(1, 1);
  // numpad.press(2, 1);
  // // numpad.press(0, 2);
  // numpad.press(1, 2);
  // numpad.press(2, 2);
  let handleKeyPress = (val) => {
    console.log(`key: ${val}`);
  };
  let handleActivate = () => {
    console.log('activate');
  };
  numpad.onKeyPress(handleKeyPress);
  numpad.onActivate(handleActivate);
  for(let i = 0; i < numpad.numKeys(); ++i) {
    try {
      numpad.press(i);
    } catch(e) {
      console.error(e);
    }
  }
  return -1;
}
