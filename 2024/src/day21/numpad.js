const { Keypad, KeypadKey, KEYPAD_KEY_TYPE_ENUM, KeypadError } = require('./keypad');

const NUMPAD_KEY_VALS = [
  7, 8, 9,
  4, 5, 6,
  undefined, 0, 'A',
];

module.exports = {
  Numpad,
};

function Numpad() {
  let self = this;
  self.keyPressFn = undefined;
  self.activateFn = undefined;
  self.keypad = new Keypad();
  for(let i = 0; i < NUMPAD_KEY_VALS.length; ++i) {
    let keyVal = NUMPAD_KEY_VALS[i];
    let keyPos = self.keypad.addKey(keyVal);
    let keypadKey = self.keypad.getKeyAt(keyPos.x, keyPos.y);
    switch(keypadKey.type) {
      case KEYPAD_KEY_TYPE_ENUM.activate:
        self.keypad.onKeyPress(keyPos.x, keyPos.y, self.handleActivate.bind(self));
        break;
      case KEYPAD_KEY_TYPE_ENUM.val:
        self.keypad.onKeyPress(keyPos.x, keyPos.y, self.handleKeyPress.bind(self));
        break;
      case KEYPAD_KEY_TYPE_ENUM.empty:
        self.keypad.onKeyPress(keyPos.x, keyPos.y, self.handleEmptyKeyPress.bind(self));
        break;
    }
  }
}

Numpad.prototype.getWidth = function() {
  let self = this;
  return self.keypad.getWidth();
};
Numpad.prototype.getHeight = function() {
  let self = this;
  return self.keypad.getHeight();
};
Numpad.prototype.numKeys = function() {
  let self = this;
  return self.keypad.numKeys;
};

Numpad.prototype.press = function(x, y) {
  let self = this;
  self.keypad.press(x, y);
};

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
    throw new KeypadError('Numpad activate() function already registered');
  }
  self.activateFn = cb;
};

/**
 * 
 * @param {KeypadKey} keypadKey
 */
Numpad.prototype.handleKeyPress = function(keypadKey) {
  let self = this;
  self.keyPressFn?.(keypadKey.val);
};

Numpad.prototype.handleActivate = function() {
  let self = this; 
  self.activateFn?.();
};

Numpad.prototype.handleEmptyKeyPress = function() {
  throw new KeypadError('Empty key pressed');
};
