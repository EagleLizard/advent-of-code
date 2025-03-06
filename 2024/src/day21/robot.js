
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
  self.getKeyPathsMemoCache = new Map();
  self.getKeyPosMemoCache = {};
}

Robot.prototype.resetArm = function() {
  let self = this;
  let origin = self.keypad.getOrigin();
  self.pos.x = origin.x;
  self.pos.y = origin.y;
};

Robot.prototype.getKeyPathsMemo = function() {
  let self = this;
  // let cache = new Map();
  let cache = self.getKeyPathsMemoCache;
  return function(sPos, ePos) {
    let cacheKey = getCacheKey(sPos, ePos);
    if(cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }
    let res = self.keypad.getKeyPaths(sPos, ePos);
    cache.set(cacheKey, res);
    return res;
  };
  function getCacheKey(sPos, ePos) {
    return `${sPos.x},${sPos.y}-${ePos.x},${ePos.y}`;
  }
};

Robot.prototype.getMinPathsMemo = function() {
  let self = this;
  let cache = new Map();
  return function(sPos, ePos) {
    let cacheKey = getCacheKey(sPos, ePos);
    if(cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }
    let res = self.keypad.getMinPaths(sPos, ePos);
    cache.set(cacheKey, res);
    return res;
  };
  function getCacheKey(sPos, ePos) {
    return `${sPos.x},${sPos.y}-${ePos.x},${ePos.y}`;
  }
};
Robot.prototype.getKeyPosMemo = function() {
  let self = this;
  let cache = {};
  // let cache = self.getKeyPosMemoCache;
  return function(codeKey) {
    if(cache[codeKey]) {
      // return JSON.parse(cache[codeKey]);
      return cache[codeKey];
    }
    let res = self.keypad.getKeyPos(codeKey);
    // cache[codeKey] = JSON.stringify(res);
    cache[codeKey] = res;
    return res;
  };
};

Robot.prototype.findMinCodePaths3 = function(srcCodeKeyVals, minPathLen) {
  // console.log(srcCodeKeyVals.join(''));
  let self = this;
  let origin = self.keypad.getOrigin();
  let foundPaths = [];
  let getKeyPaths = self.getKeyPathsMemo();
  let getMinPaths = self.getMinPathsMemo();
  let getKeyPos = self.getKeyPosMemo();
  // minPathLen = minPathLen ?? Infinity;
  minPathLen = Infinity;
  // helper(srcCodeKeyVals.length - 1);
  helper(0);
  let minPaths = [];
  for(let i = 0; i < foundPaths.length; ++i) {
    let foundPath = foundPaths[i];
    if(foundPaths[i].length <= minPathLen) {
      // console.log(movesToStr(foundPath));
      minPaths.push(foundPath);
    }
  }
  return minPaths;
  function helper(ckIdx, pathSoFar) {
    pathSoFar = pathSoFar ?? [];
    if(pathSoFar.length > minPathLen) {
      return;
    }
    // if(ckIdx < 0) {
    if(ckIdx > (srcCodeKeyVals.length - 1)) {
      if(pathSoFar.length < minPathLen) {
        minPathLen = pathSoFar.length;
      }
      if((foundPaths.length % 1e4) === 0) {
        console.log(movesToStr(pathSoFar));
      }
      foundPaths.push(pathSoFar);
      return;
    }
    let codeKey = srcCodeKeyVals[ckIdx];
    // let pos = self.keypad.getKeyPos(codeKey);
    let pos = getKeyPos(codeKey);
    let prevPos = (ckIdx === 0)
      ? origin
      // : self.keypad.getKeyPos(srcCodeKeyVals[ckIdx - 1])
      : getKeyPos(srcCodeKeyVals[ckIdx - 1])
    ;
    // let ckPaths = getMinPaths(prevPos, pos);
    // let ckPaths = self.keypad.getMinPaths(prevPos, pos);
    let ckPaths = getKeyPaths(prevPos, pos);
    // let ckPaths = self.keypad.getKeyPaths(prevPos, pos);
    for(let i = 0; i < ckPaths.length; ++i) {
      let ckPath = ckPaths[i];
      // let nPsf = [ ...ckPath, ACTIVATE_KEY_VAL, ...pathSoFar ];
      let nextPathLen = pathSoFar.length + ckPath.length + 1;
      if(nextPathLen > minPathLen) {
        return;
      }
      // let nPsf = pathSoFar.concat(ckPath).concat([ ACTIVATE_KEY_VAL ])
      let nPsf = [ ...pathSoFar, ...ckPath, ACTIVATE_KEY_VAL ];
      helper(ckIdx + 1, nPsf);
    }
    // helper(ckIdx - 1);
  }
};
/* 
<<vA>>^A<A>AvA<^AA>A<vAAA>^A
<<vA>>^A<A>A<AAv>A^A<vAAA>^A
_*/
Robot.prototype.findMinCodePaths2 = function(srcCodeKeyVals) {
  let self = this;
  let initSPos = self.keypad.getOrigin();
  let minPathLen = Infinity;
  helper([], initSPos, srcCodeKeyVals);
  return [];
  function helper(pathSoFar, sPos, codeKeys) {
    if(pathSoFar.length > minPathLen) {
      return;
    }
    if(codeKeys.length === 0) {
      if(pathSoFar.length < minPathLen) {
        minPathLen = pathSoFar.length;
      }
      console.log(movesToStr(pathSoFar));
      return;
    }
    // console.log({ sPos });
    // console.log(codeKeys);
    // console.log(movesToStr(pathSoFar));
    /*
      get paths from pos to key
    _*/
    let codeKey = codeKeys[0];
    let ckPt = self.keypad.getKeyPos(codeKey);
    let ckPaths = self.keypad.getKeyPaths(sPos, ckPt);
    let nextCodeKeys = codeKeys.slice(1);
    for(let ckp = 0; ckp < ckPaths.length; ++ckp) {
      let ckPath = ckPaths[ckp];
      let nPathSoFar = [ ...pathSoFar, ...ckPath, ACTIVATE_KEY_VAL ];
      helper(nPathSoFar, ckPt, nextCodeKeys);
    }
    // helper(ckPt, codeKeys.slice(1));
  }
};

function movesToStr(moves) {
  return moves.map(moveToChar).join('');
}
function moveToChar(move) {
  return '^>v<'[move] ?? move ?? ' ';
}

Robot.prototype.findMinCodePaths = function(codeKeyVals, minPathLen) {
  /*
    to get all possible paths, we need to get:
      1. all paths to from each point to the next point
      2. get every path permutation
  _*/
  let self = this;
  /*
    assume a starting point of origin
  _*/
  let codeKeyPts = [ self.keypad.getOrigin() ];
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
    let keyPaths = self.keypad.getKeyPaths(sPos, ePos);
    // console.log(`${self.keypad.getKeyAt(sPos.x, sPos.y).val} -> ${self.keypad.getKeyAt(ePos.x, ePos.y).val}`);
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
  let firstShortPath = self.findMinCodePath(codeKeyVals);
  minPathLen = minPathLen ?? firstShortPath.length;
  helper(pairPaths);
  return possiblePaths;

  function helper(keyPaths, pathsSoFar) {
    // console.log('keyPaths');
    // console.log(keyPaths);
    // console.log('pathsSoFar');
    // console.log(pathsSoFar);
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
      // console.log(foundPath.map(mv => {
      //   return '^>v<'[mv] ?? mv ?? ' ';
      // }).join(''));
      // possiblePaths.push(pathsSoFar.slice());
      console.log(movesToStr(foundPath));
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
