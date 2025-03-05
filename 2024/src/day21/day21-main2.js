
const { Point } = require('../lib/geom/point');
const Directions = require('../lib/geom/directions');
const KeypadPaths = require('./keypad-paths');

const directions = Directions.getDirectionPoints();

const getNumpadPaths = KeypadPaths.getNumpadPathsMemo();
const getDirpadPaths = KeypadPaths.getDirpadPathsMemo();

module.exports = {
  day21Part1,
};

function day21Part1(inputLines) {
  let day21Input = parseInput(inputLines);
  let codes = day21Input.codes;
  let complexitySum = 0;
  for(let i = 0; i < codes.length; ++i) {
    let code = codes[i];
    console.log(code);
    let codeStr = code.str;
    let codeKeys = code.keys;
    let shortSeqLen = getSequenceLength(codeKeys, 1);
    let complexity = shortSeqLen * code.num;
    complexitySum += complexity;
    if(i > -1) {
      // break;
    }
  }
  return complexitySum;
}
/* 
Part 1: 202648 | 367000.941875 ms
_*/
function getSequenceLength(codeKeys, numBots) {
  let numpad = getNumpad();
  let dirpad = getDirpad();
  codeKeys = [ 'A', ...codeKeys ];
  console.log(codeKeys);
  /*
    find all of the shortest poths to each key and back to the 
      activate button
  _*/
  // getPathsToKeysIt(codeKeys);

  let numpadPaths = getPathsToKeys(codeKeys);
  let minPathLen = Infinity;
  for(let i = 0; i < numpadPaths.length; ++i) {
    let npPath = [ 'A', ...numpadPaths[i] ];
    let dirpadPaths = getPathsToDirpadKeys(npPath);
    // dirpadPaths.forEach(dirpadPath => {
    //   console.log(movesToStr(dirpadPath));
    // });
    // let dirpadPaths = getPathsToDirpadKeys2(npPath);
    for(let dpp = 0; dpp < dirpadPaths.length; ++dpp) {
      let dpPath = [ 'A', ...dirpadPaths[dpp] ];
      let dirpadDirpadPaths = getPathsToDirpadKeys(dpPath, minPathLen);
      for(let dpdp = 0; dpdp < dirpadDirpadPaths.length; ++dpdp) {
        if(dirpadDirpadPaths[dpdp].length < minPathLen) {
          minPathLen = dirpadDirpadPaths[dpdp].length;
        }
      }
    }
  }
  console.log({ minPathLen });
  return minPathLen;
  // let npViaDpPaths = getPathsToNumpadViaDirpadKeys(codeKeys);
}

function getPathsToDirpadKeys(srcCodeKeys, minPathLen) {
  // console.log(movesToStr(codeKeys));
  // let minPathLen = Infinity;
  minPathLen = minPathLen ?? Infinity;
  let foundPaths = [];
  helper(0);
  foundPaths = foundPaths.filter(foundPath => {
    return foundPath.length <= minPathLen;
  });
  return foundPaths;
  function helper(keyIdx, soFar) {
    soFar = soFar ?? [];
    if(soFar.length > minPathLen) {
      return;
    }
    if(keyIdx > srcCodeKeys.length - 2) {
      if(soFar.length < minPathLen) {
        minPathLen = soFar.length;
        // console.log(movesToStr(soFar));
      }
      if((foundPaths.length % 1e4) === 0) {
        // process.stdout.write(`${movesToStr(soFar)}\n`);
      }
      foundPaths.push(soFar);
      return;
    }
    let from = srcCodeKeys[keyIdx];
    let to = srcCodeKeys[keyIdx + 1];
    // let pathsToCode = getDirpadDirPaths(from, to);
    let pathsToCode = getDirpadPaths(from, to);
    for(let ptc = 0; ptc < pathsToCode.length; ++ptc) {
      // let currPtc = [ ...pathsToCode[ptc], 'A' ];
      if((soFar.length + pathsToCode[ptc].length + 1) <= minPathLen) {
        helper(keyIdx + 1, [ ...soFar, ...pathsToCode[ptc], 'A' ]);
      }
    }
  }
}

function getDirpadDirPaths(from, to) {
  let fx, fy;
  let tx, ty;
  let dirpad = getDirpad();
  let visited = [];
  for(let y = 0; y < dirpad.length; ++y) {
    visited[y] = [];
    for(let x = 0; x < dirpad[y].length; ++x) {
      visited[y][x] = false;
      let keyVal = dirpad[y][x];
      if(keyVal === from) {
        fx = x;
        fy = y;
      }
      if(keyVal === to) {
        tx = x;
        ty = y;
      }
    }
  }
  let w = dirpad[0].length;
  let h = dirpad.length;
  let sPos = new Point(fx, fy);
  let ePos = new Point(tx, ty);
  let foundPaths = [];
  visited[sPos.y][sPos.x] = true;
  helper(sPos, []);
  return foundPaths;
  function helper(pos, soFar) {
    soFar = soFar ?? [];
    if(pos.x === ePos.x && pos.y === ePos.y) {
      foundPaths.push([ ...soFar ]);
      return;
    }
    for(let d = 0; d < directions.length; ++d) {
      let dPt = directions[d];
      let nx = pos.x + dPt.x;
      let ny = pos.y + dPt.y;
      if(
        (ny >= 0 && ny < h)
        && (nx >= 0 && nx < w)
        && !visited[ny][nx]
      ) {
        visited[ny][nx] = true;
        soFar.push(d);
        helper(new Point(nx, ny), soFar);
        soFar.pop();
        visited[ny][nx] = false;
      }
    }
  }
}

function getPathsToKeys(codeKeys) {
  let minPathLen = Infinity;
  let foundPaths = [];
  helper(0);
  foundPaths = foundPaths.filter(foundPath => {
    return foundPath.length <= minPathLen;
  });
  return foundPaths;
  function helper(keyIdx, soFar) {
    soFar = soFar ?? [];
    if(soFar.length > minPathLen) {
      return;
    }
    if(keyIdx > codeKeys.length - 2) {
      if(soFar.length < minPathLen) {
        minPathLen = soFar.length;
      }
      if(soFar.length <= minPathLen) {
        // process.stdout.write(`${soFar.map(moveToChar).join('')}\n`);
        foundPaths.push(soFar);
      }
      return;
    }
    let from = codeKeys[keyIdx];
    let to = codeKeys[keyIdx + 1];
    // let pathsToCode = getNumpadDirPaths(from, to);
    let pathsToCode = getNumpadPaths(from, to);
    // console.log(`ptc len: ${pathsToCode.length}, keyIdx: ${keyIdx}, soFar len: ${soFar.length}`);
    for(let ptc = 0; ptc < pathsToCode.length; ++ptc) {
      let currPtc = [ ...pathsToCode[ptc], 'A' ];
      helper(keyIdx + 1, [ ...soFar, ...currPtc ]);
    }
  }
}

function getPathsToKeys2(codeKeys) {
  let minPathLen = Infinity;
  let foundPaths = [];
  helper(0);
  foundPaths = foundPaths.filter(foundPath => {
    return foundPath.length <= minPathLen;
  });
  return foundPaths;
  function helper(keyIdx, soFar) {
    soFar = soFar ?? [];
    if(soFar.length > minPathLen) {
      return;
    }
    if(keyIdx > codeKeys.length - 2) {
      if(soFar.length < minPathLen) {
        minPathLen = soFar.length;
      }
      if(soFar.length <= minPathLen) {
        // process.stdout.write(`${soFar.map(moveToChar).join('')}\n`);
        foundPaths.push(soFar);
      }
      return;
    }
    let from = codeKeys[keyIdx];
    let to = codeKeys[keyIdx + 1];
    // console.log(`from: ${from} to ${to}`);
    let ptcIt = getNumpadDirPathsIterator(from, to);
    let ptcItRes;
    while(!(ptcItRes = ptcIt.next()).done) {
      let currPtc = [ ...ptcItRes.value, 'A' ];
      // console.log(currPtc.map(moveToChar).join(''));
      helper(keyIdx + 1, [ ...soFar, ...currPtc ]);
    }
  }
}

function movesToStr(moves) {
  let mvStr = '';
  for(let i = 0; i < moves.length; ++i) {
    mvStr += moveToChar(moves[i]);
  }
  return mvStr;
}
function moveToChar(move) {
  return '^>v<'[move] ?? move ?? ' ';
}

/*
for finding paths from key to key on numpad,
  via a dirpad
_*/
function* getNumpadDirPathsIterator(from, to) {
  let fx, fy;
  let tx, ty;
  let numpad = getNumpad();
  for(let y = 0; y < numpad.length; ++y) {
    for(let x = 0; x < numpad[y].length; ++x) {
      let keyVal = numpad[y][x];
      if(keyVal === from) {
        fx = x;
        fy = y;
      }
      if(keyVal === to) {
        tx = x;
        ty = y;
      }
    }
  }
  let w = numpad[0].length;
  let h = numpad.length;
  let sPos = new Point(fx, fy);
  let ePos = new Point(tx, ty);

  let visited = [];
  for(let y = 0; y < numpad.length; ++y) {
    visited[y] = [];
    for(let x = 0; x < numpad[y].length; ++x) {
      visited[y][x] = false;
    }
  }
  visited[sPos.y][sPos.x] = true;
  yield* helper(sPos, []);
  function* helper(pos, soFar) {
    soFar = soFar ?? [];
    if(pos.x === ePos.x && pos.y === ePos.y) {
      let foundPath = [ ...soFar ];
      yield foundPath;
      // return;
    }
    for(let d = 0; d < directions.length; ++d) {
      let dPt = directions[d];
      let nx = pos.x + dPt.x;
      let ny = pos.y + dPt.y;
      if(
        (ny >= 0 && ny < h)
        && (nx >= 0 && nx < w)
        && (!visited[ny][nx])
      ) {
        visited[ny][nx] = true;
        soFar.push(d);
        yield* helper(new Point(nx, ny), soFar);
        soFar.pop();
        visited[ny][nx] = false;
      }
    }
  }
}
/*
for finding paths from key to key on numpad,
  via a dirpad
_*/
function getNumpadDirPaths(from, to) {
  let fx, fy;
  let tx, ty;
  let numpad = getNumpad();
  for(let y = 0; y < numpad.length; ++y) {
    for(let x = 0; x < numpad[y].length; ++x) {
      let keyVal = numpad[y][x];
      if(keyVal === from) {
        fx = x;
        fy = y;
      }
      if(keyVal === to) {
        tx = x;
        ty = y;
      }
    }
  }
  let w = numpad[0].length;
  let h = numpad.length;
  let sPos = new Point(fx, fy);
  let ePos = new Point(tx, ty);

  let visited = [];
  for(let y = 0; y < numpad.length; ++y) {
    visited[y] = [];
    for(let x = 0; x < numpad[y].length; ++x) {
      visited[y][x] = false;
    }
  }
  let foundPaths = [];
  visited[sPos.y][sPos.x] = true;
  helper(sPos, []);
  return foundPaths;
  function helper(pos, soFar) {
    soFar = soFar ?? [];
    if(pos.x === ePos.x && pos.y === ePos.y) {
      foundPaths.push([ ...soFar ]);
      return;
    }
    for(let d = 0; d < directions.length; ++d) {
      let dPt = directions[d];
      let nx = pos.x + dPt.x;
      let ny = pos.y + dPt.y;
      if(
        (ny >= 0 && ny < h)
        && (nx >= 0 && nx < w)
        && (numpad[ny][nx] !== undefined)
        && (!visited[ny][nx])
      ) {
        visited[ny][nx] = true;
        soFar.push(d);
        helper(new Point(nx, ny), soFar);
        soFar.pop();
        visited[ny][nx] = false;
      }
    }
  }
}

function getDirpad() {
  return [
    [ , 0, 'A' ],
    [ 3, 2, 1 ],
  ];
}

function getNumpad() {
  return [
    [ 7, 8, 9 ],
    [ 4, 5, 6 ],
    [ 1, 2, 3 ],
    [ , 0, 'A' ],
  ];
}

function parseInput(inputLines) {
  let codes = [];
  for(let i = 0; i < inputLines.length; ++i) {
    let inputLine = inputLines[i];
    if(/^[0-9]+A$/.test(inputLine)) {
      let codeStr = inputLine;
      let codeKeys = codeStr.split('').map(c => {
        if(/^[0-9]$/.test(c)) {
          return +c;
        }
        return c;
      });
      let num = +codeStr.match(/^[0-9]+/)[0];
      let code = {
        str: codeStr,
        keys: codeKeys,
        num,
      };
      codes.push(code);
    }
  }
  let res = {
    codes,
  };
  return res;
}
