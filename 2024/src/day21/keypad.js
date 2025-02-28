const { Point } = require('../lib/geom/point');

const KEYPAD_KEY_TYPE_ENUM = {
  empty: 0,
  val: 1, 
  activate: 2,
};

const KEYS_PER_ROW = 3;

module.exports = {
  KEYPAD_KEY_TYPE_ENUM,
  Keypad,
  KeypadKey,
  KeypadError,
};

function Keypad() {
  let self = this;
  self.keys = [
    [],
  ];
  self.onKeyPressFns = new Map();
  self.numKeys = 0;
}

Keypad.prototype.getWidth = function() {
  let self = this;
  let width = self.keys[0].length;
  return width;
};
Keypad.prototype.getHeight = function() {
  let self = this;
  let height = self.keys.length;
  return height;
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

/**
 * 
 * @param {number} x 
 * @param {number | undefined} y 
 */
Keypad.prototype.press = function(x, y) {
  let self = this;
  let keypadKey = self.getKeyAt(x, y);
  if(keypadKey === undefined) {
    throw new KeypadError(`No key at (${x}, ${y})`);
  }
  let keyPressFn = self.onKeyPressFns.has(keypadKey.id)
    ? self.onKeyPressFns.get(keypadKey.id)
    : undefined
  ;
  keyPressFn?.(keypadKey);
};

/**
 * @param {number} x
 * @param {number} y
 * @param {(key: KeypadKey) => void} cb 
 */
Keypad.prototype.onKeyPress = function(x, y, cb) {
  let self = this;
  let keypadKey = self.getKeyAt(x, y);
  if(keypadKey === undefined) {
    throw new KeypadError(`No key at (${x}, ${y})`);
  }
  if(self.onKeyPressFns.has(keypadKey.id)) {
    throw new KeypadError(`Key at (${x}, ${y}) already has onKeyPress() registered`);
  }
  self.onKeyPressFns.set(keypadKey.id, cb);
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
  self.numKeys++;
  let x = self.keys[self.keys.length - 1].length - 1;
  let y = self.keys.length - 1;
  let keyPos = new Point(x, y);
  return keyPos;
  // return keypadKey;
};

let keypadKeyIdCounter = 0;

/**
 * @class
 */
function KeypadKey(keyValue) {
  let self = this;
  // /** @property {string} type */
  self.type = KEYPAD_KEY_TYPE_ENUM.val;
  if(keyValue === undefined) {
    self.type = KEYPAD_KEY_TYPE_ENUM.empty;
  } else if(keyValue === 'A') {
    self.type = KEYPAD_KEY_TYPE_ENUM.activate;
  }
  self.val = keyValue;
  self.id = keypadKeyIdCounter++;
}

function KeypadError(message) {
  let self = this;
  Error.captureStackTrace(self, KeypadError);
  self.message = message;
  self.name = 'KeypadError';
}

KeypadError.prototype = Object.create(Error.prototype);
KeypadError.prototype.constructor = KeypadError;
