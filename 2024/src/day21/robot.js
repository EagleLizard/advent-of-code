
const Directions = require('../lib/geom/directions');
const { Point } = require('../lib/geom/point');
const { Dirpad } = require('./dirpad');
const { Keypad } = require('./keypad');
const { KeypadError } = require('./keypad-error');
const { KEYPAD_KEY_TYPE_ENUM } = require('./keypad-key');

const directions = Directions.getDirectionPoints();

let robotIdCounter = 0;

module.exports = {
  Robot,
};

function Robot() {
  let self = this;
  self.id = robotIdCounter++;
  /** @type {Numpad | Dirpad}*/
  self.keypad = undefined;
  // let origin = keypad.getOrigin();
  // self.pos = new Point(origin.x, origin.y);
  self.pos = undefined;
  self.keyPressFn = undefined;
  self.dirpad = new Dirpad();
  self.dirpad.onKeyPress((keypadKey) => {
    self.keyPressFn?.(keypadKey);
    if(keypadKey.type === KEYPAD_KEY_TYPE_ENUM.activate) {
      return self.handleActivate(keypadKey);
    } else {
      return self.handleKeyPress(keypadKey);
    }
  });
}

Robot.prototype.onKeyPress = function(cb) {
  let self = this;
  if(self.keyPressFn !== undefined) {
    throw new KeypadError('Robot onKeyPress() function already registered');
  }
  self.keyPressFn = cb;
  return () => {
    self.keyPressFn = undefined;
  };
};

Robot.prototype.setKeypad = function(keypad) {
  let self = this;
  self.keypad = keypad;
  self.origin = self.keypad.getOrigin();
  self.pos = new Point(self.origin.x, self.origin.y);
};

Robot.prototype.pathToKey = function(keyVal) {
  let self = this;
  // let keyAtArm = self.keypad.getKeyAt(self.pos.x, self.pos.y);
  // console.log(self.keypad);
  let destKeyPos = self.keypad.getKeyPos(keyVal);
  // console.log('from:');
  // console.log(self.pos);
  // console.log(self.keypad.getKeyAt(self.pos.x, self.pos.y));
  // console.log('to:');
  // console.log(destKeyPos);
  let keyPath = self.keypad.getKeyPath(self.pos, destKeyPos);
  // console.log({ keyPath });
  return keyPath;
};

// Robot.prototype.pressKey = function(x, y) {
Robot.prototype.pressKey = function(keyVal) {
  let self = this;
  let keyPos = self.dirpad.getKeyPos(keyVal);
  return self.dirpad.press(keyPos.x, keyPos.y);
};
Robot.prototype.handleActivate = function(keypadKey) {
  /* push the button under the arm */
  let self = this;
  return self.keypad.press(self.pos.x, self.pos.y);
};
Robot.prototype.handleKeyPress = function(keypadKey) {
  /* move the arm */
  let self = this;
  let dPt = directions[keypadKey.val];
  self.pos.x += dPt.x;
  self.pos.y += dPt.y;
};
