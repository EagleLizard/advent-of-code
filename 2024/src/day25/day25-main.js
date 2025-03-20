
const TUMBLER_CHAR_ENUM = {
  empty: '.',
  filled: '#',
};

const TUMBLER_PIN_VALS = {
  empty: 0,
  filled: 1,
};

const TUMBLER_CHAR_MAP = {
  [TUMBLER_CHAR_ENUM.empty]: TUMBLER_PIN_VALS.empty,
  [TUMBLER_CHAR_ENUM.filled]: TUMBLER_PIN_VALS.filled,
};

module.exports = {
  day25Part1,
};

/* 
19310 - too high
2691 - correct
_*/
function day25Part1(inputLines) {
  let day25Input = parseInput2(inputLines);
  let keys = day25Input.keys;
  let locks = day25Input.locks;
  let keyLockFitCount = 0;
  for(let i = 0; i < locks.length; i++) {
    for(let k = 0; k < keys.length; k++) {
      let keyFits = tryKey(locks[i], keys[k]);
      if(keyFits) {
        keyLockFitCount++;
      }
    }
  }
  return keyLockFitCount;
}

function tryKey(lock, key) {
  return lock.every((pinRow, y) => {
    return pinRow.every((pin, x) => {
      return (pin + key[y][x]) < 2;
    });
  });
}

function parseInput2(inputLines) {
  let locks = [];
  let keys = [];
  let currPart = [];
  for(let i = 0; i < inputLines.length; i++) {
    let line = inputLines[i];
    if(line.length === 0) {
      parsePart();
    } else {
      currPart.push(line);
    }
  }
  parsePart();
  let res = {
    locks,
    keys,
  };
  return res;
  function parsePart() {
    if(currPart.length < 1) {
      return;
    }
    let parsedPart = [];
    let isLock = false;
    for(let i = 0; i < currPart.length; i++) {
      let line = currPart[i];
      let row = [];
      for(let k = 0; k < line.length; ++k) {
        let c = line[k];
        let pin = TUMBLER_CHAR_MAP[c];
        row.push(pin);
      }
      if(i === 0) {
        isLock = row.every(pin => pin === TUMBLER_PIN_VALS.filled);
      }
      parsedPart.push(row);
    }
    if(isLock) {
      locks.push(parsedPart);
    } else {
      keys.push(parsedPart);
    }
    currPart = [];
  }
}

function parseInput(inputLines) {
  let locks = [];
  let keys = [];
  let parseLock = false;
  let parseKey = false;
  let currPart = [];
  for(let i = 0; i < inputLines.length; ++i) {
    let line = inputLines[i];
    if(!parseLock && !parseKey) {
      if(/^#+$/.test(line)) {
        parseLock = true;
      } else if(/^\.+$/.test(line)) {
        parseKey = true;
      }
    }
    if(line.length > 0) {
      currPart.push(line);
    }
    if(parseLock && /^\.+$/.test(line)) {
      parseLock = false;
      let lockHeights = getHeights(currPart);
      locks.push(lockHeights);
      currPart = [];
    }
    if(parseKey && /^#+$/.test(line)) {
      parseKey = false;
      let keyHeights = getHeights(currPart);
      keys.push(keyHeights);
      currPart = [];
    }
  }
  let res = {
    locks,
    keys,
  };
  return res;
}

function getHeights(tumblerPart) {
  let w = tumblerPart[0].length;
  let cols = [];
  for(let i = 0; i < w; ++i) {
    cols.push(0);
  }
  for(let i = 1; i < tumblerPart.length - 1; ++i) {
    let row = tumblerPart[i];
    for(let k = 0; k < row.length; ++k) {
      let c = row[k];
      if(c === TUMBLER_CHAR_ENUM.filled) {
        cols[k]++;
      }
    }
  }
  return cols;
}
