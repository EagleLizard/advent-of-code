
const Directions = require('../lib/geom/directions');
const { Point } = require('../lib/geom/point');
const { Dirpad } = require('./dirpad');
const { Keypad } = require('./keypad');
const { KEYPAD_KEY_TYPE_ENUM } = require('./keypad-key');

const directions = Directions.getDirectionPoints();

module.exports = {
  Robot,
};

function Robot(keypad) {
  let self = this;
  let origin = keypad.getOrigin();
  /** @type {Keypad}*/
  self.keypad = keypad;
  self.pos = new Point(origin.x, origin.y);
  self.dirpad = new Dirpad();
  self.dirpad.onKeyPress((keypadKey) => {
    if(keypadKey.type === KEYPAD_KEY_TYPE_ENUM.activate) {
      return self.handleActivate(keypadKey);
    } else {
      return self.handleKeyPress(keypadKey);
    }
  });
}

Robot.prototype.pathToKey = function(keyVal) {
  let self = this;
  // let keyAtArm = self.keypad.getKeyAt(self.pos.x, self.pos.y);
  // console.log(self.keypad);
  let destKeyPos = self.keypad.getKeyPos(keyVal);
  console.log('from:');
  console.log(self.pos);
  console.log('to:');
  console.log(destKeyPos);
  let keyPath = self.keypad.getKeyPath(self.pos, destKeyPos);
  // console.log({ keyPath });
  return keyPath;
};

Robot.prototype.pressKey = function(x, y) {
  let self = this;
  return self.dirpad.press(x, y);
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
