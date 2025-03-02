
const Directions = require('../lib/geom/directions');
const { Point } = require('../lib/geom/point');
const { Dirpad } = require('./dirpad');
const { Keypad } = require('./keypad');
const { KeypadError } = require('./keypad-error');
const { KEYPAD_KEY_TYPE_ENUM, ACTIVATE_KEY_VAL } = require('./keypad-key');

const directions = Directions.getDirectionPoints();

let robotIdCounter = 0;
let keyPressFnIdCounter = 0;

module.exports = {
  Robot,
};

function Robot(keypad) {
  let self = this;
  self.id = robotIdCounter++;
  /** @type {Numpad | Dirpad}*/
  self.keypad = undefined;
  // let origin = keypad.getOrigin();
  // self.pos = new Point(origin.x, origin.y);
  self.pos = undefined;
  self.keyPressFns = new Map();
  self.dirpad = new Dirpad();
  self.dirpad.onKeyPress((keypadKey) => {
    let kpFns = [ ...self.keyPressFns.values() ];
    for(let i = 0; i < kpFns.length; ++i) {
      kpFns[i](keypadKey, self);
    }
    if(keypadKey.type === KEYPAD_KEY_TYPE_ENUM.activate) {
      return self.handleActivate(keypadKey);
    } else {
      return self.handleKeyPress(keypadKey);
    }
  });
  if(keypad !== undefined) {
    self.setKeypad(keypad);
  }
}

Robot.prototype.resetArm = function() {
  let self = this;
  let origin = self.keypad.getOrigin();
  self.pos.x = origin.x;
  self.pos.y = origin.y;
};

Robot.prototype.findMinCodePaths = function(codeKeyVals, minPathLen) {
  /*
    to get all possible paths, we need to get:
      1. all paths to from each point to the next point
      2. get every path permutation
  _*/
  let self = this;

  let codeKeyPts = [
    self.keypad.getOrigin(),
  ];
  for(let i = 0; i < codeKeyVals.length; ++i) {
    codeKeyPts.push(self.keypad.getKeyPos(codeKeyVals[i]));
  }
  let keyPtPairs = [];
  for(let i = 0; i < codeKeyPts.length - 1; ++i) {
    let pt = codeKeyPts[i];
    let nPt = codeKeyPts[i + 1];
    keyPtPairs.push([ pt, nPt ]);
  }
  // keyPtPairs.forEach(ptTuple => {
  //   console.log(`${self.keypad.getKeyAt(ptTuple[0].x, ptTuple[0].y).val} -> ${self.keypad.getKeyAt(ptTuple[1].x, ptTuple[1].y).val}`);
  // });
  let pairPaths = [];
  for(let i = 0; i < keyPtPairs.length; ++i) {
    let [ sPos, ePos ] = keyPtPairs[i];
    let keyPaths = self.keypad.getKeyPaths(sPos, ePos);
    console.log(`${self.keypad.getKeyAt(sPos.x, sPos.y).val} -> ${self.keypad.getKeyAt(ePos.x, ePos.y).val}`);
    for(let k = 0; k < keyPaths.length; ++k) {
      /*
        every key on the keypad must also be pressed with the current
          dirpad via 'activate'
      _*/
      keyPaths[k].push(ACTIVATE_KEY_VAL);
    }
    pairPaths.push(keyPaths);
  }

  let possiblePaths = [];
  minPathLen = minPathLen ?? Infinity;
  helper(pairPaths);
  return possiblePaths;

  function helper(keyPaths, pathsSoFar) {
    pathsSoFar = pathsSoFar ?? [];
    let sfPathLen = 0;
    for(let k = 0; k < pathsSoFar.length; ++k) {
      sfPathLen += pathsSoFar[k].length;
    }
    if(sfPathLen > minPathLen) {
      return;
    }
    if(keyPaths.length === 0) {
      let foundPath = [];
      /* flatten moves */
      for(let i = 0; i < pathsSoFar.length; ++i) {
        let currMoves = pathsSoFar[i];
        for(let k = 0; k < currMoves.length; ++k) {
          foundPath.push(currMoves[k]);
        }
      }
      if(foundPath.length < minPathLen) {
        minPathLen = foundPath.length;
      }
      // possiblePaths.push(pathsSoFar.slice());
      possiblePaths.push(foundPath);
      return;
    }

    let currPaths = keyPaths[0];
    let restPaths = keyPaths.slice(1);
    for(let i = 0; i < currPaths.length; ++i) {
      let currPath = currPaths[i];
      // console.log(currPath);
      pathsSoFar.push(currPath);
      helper(restPaths, pathsSoFar);
      pathsSoFar.pop();
    }
  }
};

Robot.prototype.findMinCodePath = function(codeKeyVals) {
  let self = this;
  let codeKeyPts = [
    self.keypad.getOrigin(),
  ];
  for(let i = 0; i < codeKeyVals.length; ++i) {
    codeKeyPts.push(self.keypad.getKeyPos(codeKeyVals[i]));
  }
  let keyPtPairs = [];
  for(let i = 0; i < codeKeyPts.length - 1; ++i) {
    let pt = codeKeyPts[i];
    let nPt = codeKeyPts[i + 1];
    keyPtPairs.push([ pt, nPt ]);
  }
  let pairPaths = [];
  for(let i = 0; i < keyPtPairs.length; ++i) {
    let [ sPos, ePos ] = keyPtPairs[i];
    let foundPath = self.keypad.getKeyPath(sPos, ePos);
    foundPath.push(ACTIVATE_KEY_VAL);
    pairPaths.push(foundPath);
  }
  /* flatten */
  let foundMinPath = [];
  for(let i = 0; i < pairPaths.length; ++i) {
    let pairPath = pairPaths[i];
    for(let k = 0; k < pairPath.length; ++k) {
      let mv = pairPath[k];
      foundMinPath.push(mv);
    }
  }
  return foundMinPath;
};

Robot.prototype.onKeyPress = function(cb) {
  let self = this;
  let kpfId = keyPressFnIdCounter++;
  self.keyPressFns.set(kpfId, cb);
  return () => {
    return self.keyPressFns.delete(kpfId);
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
  let destKeyPos = self.keypad.getKeyPos(keyVal);
  let keyPath = self.keypad.getKeyPath(self.pos, destKeyPos);
  return keyPath;
};

Robot.prototype.getKeyPaths = function(keyVal) {
  let self = this;
  let destKeyPos = self.keypad.getKeyPos(keyVal);
  let keyPaths = self.keypad.getKeyPaths(self.pos, destKeyPos);
  return keyPaths;
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
