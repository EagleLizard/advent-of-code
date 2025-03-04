
const { Point } = require('../lib/geom/point');
const Directions = require('../lib/geom/directions');

const directions = Directions.getDirectionPoints();

module.exports = {
  day21Part1,
};

function day21Part1(inputLines) {
  let day21Input = parseInput(inputLines);
  let codes = day21Input.codes;
  for(let i = 0; i < codes.length; ++i) {
    let code = codes[i];
    console.log(code);
    let codeStr = code.str;
    let codeKeys = code.keys;
    let shortSeqLen = getSequenceLength(codeKeys, 1);
    break;
  }
  return -1;
}

function getSequenceLength(codeKeys, numBots) {
  let numpad = getNumpad();
  let dirpad = getDirpad();
  codeKeys = [ 'A', ...codeKeys ];
  console.log(codeKeys);
  /*
    find all of the shortest poths to each key and back to the 
      activate button
  _*/
  for(let ck = 0; ck < codeKeys.length - 1; ++ck) {
    let fromKey = codeKeys[ck];
    let toKey = codeKeys[ck + 1];
    console.log({fromKey, toKey});
    let pathsToCode = getNumpadDirPaths(fromKey, toKey);
    let pathsToActivate = getNumpadDirPaths(toKey, 'A');
    // pathsToCode.forEach(foundPath => {
    //   console.log(movesToStr(foundPath));
    // });
    // console.log('to A:');
    // pathsToActivate.forEach(foundPath => {
    //   console.log(movesToStr(foundPath));
    // });
    /*
      combine paths
    _*/
    break;
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
