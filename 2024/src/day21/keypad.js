
const { KeypadKey, KEYPAD_KEY_TYPE_ENUM } = require('./keypad-key');
const { KeypadError } = require('./keypad-error');
const { Point } = require('../lib/geom/point');
const Directions = require('../lib/geom/directions');
const { Queue } = require('../lib/datastruct/queue');

const directions = Directions.getDirectionPoints();

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
  self.origin = undefined;
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

Keypad.prototype.getKeyPos = function(keyVal) {
  let self = this;
  let fx, fy;
  for(let y = 0; y < self.keys.length; ++y) {
    for(let x = 0; x < self.keys[y].length; ++x) {
      if(self.keys[y][x].val === keyVal) {
        fx = x;
        fy = y;
        return new Point(fx, fy);
      }
    }
  }
};
Keypad.prototype.getKeyPath = function(sPos, ePos) {
  /*
  may be overkill, but going to do a BFS or similar
  _*/
  let self = this;
  let w = self.getWidth();
  let h = self.getHeight();
  let visited = [];
  for(let y = 0; y < self.keys.length; ++y) {
    visited.push(new Map());
  }
  let queue = new Queue();
  queue.push({
    pos: sPos,
    soFar: [],
  });
  while(!queue.empty()) {
    let currItem = queue.pop();
    let pos = currItem.pos;
    let soFar = currItem.soFar;
    // console.log(pos);
    if(pos.x === ePos.x && pos.y === ePos.y) {
      // console.log(pos);
      // console.log(soFar);
      return soFar;
    }
    visited[pos.y].set(pos.x, true);
    for(let d = 0; d < directions.length; ++d) {
      let dPt = directions[d];
      let ax = pos.x + dPt.x;
      let ay = pos.y + dPt.y;
      if(
        ay >= 0
        && ay < h
        && ax >= 0
        && ax < w
        && !(visited[ay].has(ax) && visited[ay].get(ax))
        && (self.keys[ay][ax].type !== KEYPAD_KEY_TYPE_ENUM.empty)
      ) {
        queue.push({
          pos: new Point(ax, ay),
          soFar: [ ...soFar, d],
        });
      }
    }
  }
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
  // console.log({x, y})
  let keypadKey = self.keys[y][x];
  return keypadKey;
};

Keypad.prototype.press = function(x, y) {
  let self = this;
  let keypadKey = self.getKeyAt(x, y);
  if(keypadKey === undefined) {
    throw new KeypadError(`No key at (${x}, ${y})`);
  }
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
  let x, y;
  y = self.keys.length - 1;
  if(self.keys[y].length >= KEYS_PER_ROW) {
    self.keys.push([]);
    y++;
  }
  let keypadKey = new KeypadKey(keyVal);
  self.keys[y].push(keypadKey);
  x = self.keys[y].length - 1;
  self.keyCount++;
  // console.log(self);
  switch(keypadKey.type) {
    case KEYPAD_KEY_TYPE_ENUM.activate:
      self.origin = new Point(x, y);
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
 * @param {(keypadKey: KeypadKey) => void} cb 
 */
Keypad.prototype.onKeyPress = function(cb) {
  let self = this;
  if(self.keyPressFn !== undefined) {
    throw new KeypadError('Keypad keyPress() function already registered');
  }
  self.keyPressFn = cb;
};
Keypad.prototype.handleKeyPress = function(keypadKey) {
  return this.keyPressFn?.(keypadKey);
};
Keypad.prototype.handleEmptyKeyPress = function() {
  throw new KeypadError('Empty key pressed');
};
