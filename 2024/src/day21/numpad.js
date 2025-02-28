
const { Keypad: Keypad2 } = require('./keypad');

const NUMPAD_KEY_VALS = [
  7, 8, 9,
  4, 5, 6,
  1, 2, 3,
  undefined, 0, 'A',
];

module.exports = {
  Numpad,
};

function Numpad() {
  let self = this;
  self.keypad = new Keypad2(NUMPAD_KEY_VALS);
}

Numpad.prototype.getWidth = function() {
  return this.keypad.getWidth();
};
Numpad.prototype.getHeight = function() {
  return this.keypad.getHeight();
};
Numpad.prototype.numKeys = function() {
  return this.keypad.numKeys();
};

Numpad.prototype.press = function(x, y) {
  return this.keypad.press(x, y);
};
Numpad.prototype.onKeyPress = function(cb) {
  return this.keypad.onKeyPress(cb);
};
Numpad.prototype.onActivate = function(cb) {
  return this.keypad.onActivate(cb);
};
