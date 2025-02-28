const { Keypad, KEYPAD_KEY_TYPE_ENUM, KeypadError } = require('./keypad-key');
const { Keypad: Keypad2 } = require('./keypad');

const DIRPAD_KEY_VALS = [
  undefined, 0, 'A',
  3, 2, 1
];

module.exports = {
  Dirpad,
};

function Dirpad() {
  let self = this;
  self.keypad = new Keypad2(DIRPAD_KEY_VALS);
}

Dirpad.prototype.getWidth = function() {
  return this.keypad.getWidth();
};
Dirpad.prototype.getHeight = function() {
  return this.keypad.getHeight();
};
Dirpad.prototype.numKeys = function() {
  return this.keypad.numKeys();
};
Dirpad.prototype.press = function(x, y) {
  return this.keypad.press(x, y);
};
Dirpad.prototype.onKeyPress = function(cb) {
  return this.keypad.onKeyPress(cb);
};
Dirpad.prototype.onActivate = function(cb) {
  return this.keypad.onActivate(cb);
};
