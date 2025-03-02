
const { KeypadKey, KEYPAD_KEY_TYPE_ENUM } = require('./keypad-key');
const { KeypadError } = require('./keypad-error');
const { Point } = require('../lib/geom/point');
const Directions = require('../lib/geom/directions');
const { Queue } = require('../lib/datastruct/queue');

const directions = Directions.getDirectionPoints();

const KEYS_PER_ROW = 3;

let onKeyPressIdCounter = 0;

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
  for(let y = 0; y < self.keys.length; ++y) {
    for(let x = 0; x < self.keys[y].length; ++x) {
      if(self.keys[y][x].val === keyVal) {
        return new Point(x, y);
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
    if(pos.x === ePos.x && pos.y === ePos.y) {

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
          soFar: [ ...soFar, d ],
        });
      }
    }
  }
};

Keypad.prototype.getKeyPaths = function(sPos, ePos) {
  let self = this;
  let foundPaths = [];
  let w = self.getWidth();
  let h = self.getHeight();
  /**@type {Map<number, boolean>[]} */
  let visited = [];
  for(let y = 0; y < self.keys.length; ++y) {
    visited.push(new Map());
  }
  visited[sPos.y].set(sPos.x, true);
  helper(sPos);
  return foundPaths;
  function helper(pos, soFar) {
    soFar = soFar ?? [];
    if(pos.x === ePos.x && pos.y === ePos.y) {
      let foundPath = soFar.slice();
      foundPaths.push(foundPath);
      return;
    }
    for(let d = 0; d < directions.length; ++d) {
      let dPt = directions[d];
      let nx = pos.x + dPt.x;
      let ny = pos.y + dPt.y;
      if(
        (ny >= 0 && ny < h)
        && (nx >= 0 && nx < w)
        && !(visited[ny].has(nx) && visited[ny].get(nx))
        && (self.keys[ny][nx] !== KEYPAD_KEY_TYPE_ENUM.empty)
      ) {
        let nPos = new Point(nx, ny);
        soFar.push(d);
        visited[ny].set(nx, true);
        helper(nPos, soFar);
        visited[ny].delete(nx);
        soFar.pop();
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
  // console.log({x, y});
  let keypadKey = self.keys[y][x];
  return keypadKey;
};

Keypad.prototype.press = function(x, y) {
  let self = this;
  let keypadKey = self.getKeyAt(x, y);
  if(keypadKey === undefined) {
    throw new KeypadError(`No key at (${x}, ${y})`);
  }
  self.handleKeyPress(keypadKey);
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
  if(keypadKey.type === KEYPAD_KEY_TYPE_ENUM.activate) {
    let y = self.keys.length - 1;
    let x = self.keys[y].length - 1;
    self.origin = new Point(x, y);
  }
  return keypadKey;
};
/**
 * 
 * @param {(keypadKey: KeypadKey) => void} cb 
 */
Keypad.prototype.onKeyPress = function(cb) {
  let self = this;
  let okpId = onKeyPressIdCounter++;
  self.keyPressFns.set(okpId, cb);
  return () => {
    return self.keyPressFns.delete(okpId);
  };
};
Keypad.prototype.handleKeyPress = function(keypadKey) {
  let self = this;
  if(keypadKey.type === KEYPAD_KEY_TYPE_ENUM.empty) {
    throw new KeypadError('Empty key pressed');
  }
  let kpFns = [ ...self.keyPressFns.values() ];
  for(let i = 0; i < kpFns.length; ++i) {
    let kpFn = kpFns[i];
    kpFn(keypadKey);
  }
};
Keypad.prototype.handleEmptyKeyPress = function() {
  throw new KeypadError('Empty key pressed');
};
