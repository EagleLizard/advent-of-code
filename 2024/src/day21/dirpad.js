
const { Keypad } = require('./keypad');

const DIRPAD_KEY_VALS = [
  undefined, 0, 'A',
  3, 2, 1
];

module.exports = {
  Dirpad,
};

function Dirpad() {
  let self = this;
  self.keypad = new Keypad(DIRPAD_KEY_VALS);
}

Dirpad.prototype.getKeyPath = function(sPos, ePos) {
  return this.keypad.getKeyPath(sPos, ePos);
};
Dirpad.prototype.getKeyPos = function(keyVal) {
  return this.keypad.getKeyPos(keyVal);
};
Dirpad.prototype.getKeyAt = function(x, y) {
  return this.keypad.getKeyAt(x, y);
};
Dirpad.prototype.getOrigin = function() {
  return this.keypad.origin;
};
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
/**
 * 
 * @param {(keypadKey: KeypadKey) => void} cb 
 * @returns 
 */
Dirpad.prototype.onKeyPress = function(cb) {
  return this.keypad.onKeyPress(cb);
};
