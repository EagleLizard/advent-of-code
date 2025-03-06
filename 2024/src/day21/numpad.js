
const { Keypad: Keypad2 } = require('./keypad');
const { KeypadError } = require('./keypad-error');
const { KEYPAD_KEY_TYPE_ENUM } = require('./keypad-key');

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
  self.keyPressFn = undefined;
  self.activateFn = undefined;
  self.keypad.onKeyPress((keypadKey) => {
    if(keypadKey.type === KEYPAD_KEY_TYPE_ENUM.activate) {
      return self.activateFn?.(keypadKey.val);
    } else {
      return self.keyPressFn?.(keypadKey.val);
    }
  });
}

Numpad.prototype.getMinPaths = function(sPos, ePos) {
  return this.keypad.getMinPaths(sPos, ePos);
};
Numpad.prototype.getKeyPaths = function(sPos, ePos) {
  return this.keypad.getKeyPaths(sPos, ePos);
};
Numpad.prototype.getKeyPath = function(sPos, ePos) {
  return this.keypad.getKeyPath(sPos, ePos);
};
Numpad.prototype.getKeyPos = function(keyVal) {
  return this.keypad.getKeyPos(keyVal);
};
Numpad.prototype.getKeyAt = function(x, y) {
  return this.keypad.getKeyAt(x, y);
};
Numpad.prototype.getOrigin = function() {
  return this.keypad.origin;
};
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
/**
 * 
 * @param {(keypadKey: KeypadKey) => void} cb 
 */
Numpad.prototype.onKeyPress = function(cb) {
  let self = this;
  if(self.keyPressFn !== undefined) {
    throw new KeypadError('Numpad keyPress() function already registered');
  }
  self.keyPressFn = cb;
};
Numpad.prototype.onActivate = function(cb) {
  let self = this;
  if(self.activateFn !== undefined) {
    throw new KeypadError('Numpad onActivate() function already registered');
  }
  self.activateFn = cb;
};
