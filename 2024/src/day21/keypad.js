
const { KeypadKey, KEYPAD_KEY_TYPE_ENUM } = require('./keypad-key');
const { KeypadError } = require('./keypad-error');

const KEYS_PER_ROW = 3;

module.exports = {
  Keypad,
};

function Keypad(keys) {
  let self = this;
  if(keys === undefined || !Array.isArray(keys)) {
    throw new KeypadError(`Expected keys to be type array, received: ${typeof keys}`);
  }
  self.keys = [
    [],
  ];
  self.keyCount = 0;
  self.keyPressFn = undefined;
  self.activateFn = undefined;
  self.keyPressFns = new Map();
  for(let i = 0; i < keys.length; ++i) {
    let keyVal = keys[i];
    self.addKey(keyVal);
  }
}

Keypad.prototype.numKeys = function() {
  return this.keyCount;
};
Keypad.prototype.getWidth = function() {
  return this.keys[0].length;
};
Keypad.prototype.getHeight = function() {
  return this.keys.length;
};

/**
 * 
 * @param {number} x 
 * @param {number | undefined} y 
 * @returns {KeypadKey}
 */
Keypad.prototype.getKeyAt = function(x, y) {
  let self = this;
  if(y === undefined) {
    /*
      if y is undefined, treat it as a position of a 1d array of keys
    _*/
    y = Math.floor(x / KEYS_PER_ROW);
    x = x % KEYS_PER_ROW;
  }
  let keypadKey = self.keys[y][x];
  return keypadKey;
};

Keypad.prototype.press = function(x, y) {
  let self = this;
  let keypadKey = self.getKeyAt(x, y);
  if(keypadKey === undefined) {
    throw new KeypadError(`No key at (${x}, ${y})`);
  }
  // console.log(keypadKey);
  let keyPressFn = self.keyPressFns.has(keypadKey.id)
    ? self.keyPressFns.get(keypadKey.id)
    : undefined
  ;
  keyPressFn?.(keypadKey);
};

/**
 * @param {string | number | undefined} keyVal
 */
Keypad.prototype.addKey = function(keyVal) {
  let self = this;
  if(self.keys[self.keys.length - 1].length >= KEYS_PER_ROW) {
    self.keys.push([]);
  }
  let keypadKey = new KeypadKey(keyVal);
  self.keys[self.keys.length - 1].push(keypadKey);
  self.keyCount++;
  // console.log(self);
  switch(keypadKey.type) {
    case KEYPAD_KEY_TYPE_ENUM.activate:
      self.keyPressFns.set(keypadKey.id, self.handleActivate.bind(self));
      break;
    case KEYPAD_KEY_TYPE_ENUM.val:
      self.keyPressFns.set(keypadKey.id, self.handleKeyPress.bind(self));
      break;
    case KEYPAD_KEY_TYPE_ENUM.empty:
      self.keyPressFns.set(keypadKey.id, self.handleEmptyKeyPress.bind(self));
  }
  return keypadKey;
};
/**
 * 
 * @param {() => void} cb
 */
Keypad.prototype.onActivate = function(cb) {
  let self = this;
  if(self.activateFn !== undefined) {
    throw new KeypadError('Numpad activate() function already registered');
  }
  self.activateFn = cb;
};
/**
 * 
 * @param {(keypadKey: any) => void} cb 
 */
Keypad.prototype.onKeyPress = function(cb) {
  let self = this;
  if(self.keyPressFn !== undefined) {
    throw new KeypadError('Numpad keyPress() function already registered');
  }
  self.keyPressFn = cb;
};
Keypad.prototype.handleKeyPress = function(keypadKey) {
  let self = this;
  self.keyPressFn?.(keypadKey.val);
};
Keypad.prototype.handleActivate = function() {
  let self = this;
  self.activateFn?.();
};
Keypad.prototype.handleEmptyKeyPress = function() {
  throw new KeypadError('Empty key pressed');
};
