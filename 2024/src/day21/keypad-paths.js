
const { Point } = require('../lib/geom/point');
const Directions = require('../lib/geom/directions');

const directions = Directions.getDirectionPoints();

const numpad = [
  [ 7, 8, 9 ],
  [ 4, 5, 6 ],
  [ 1, 2, 3 ],
  [ , 0, 'A' ],
];

const dirpad = [
  [ , 0, 'A' ],
  [ 3, 2, 1 ],
];

const getNumpadPathsMemo = () => {
  let cache = new Map();
  return (from, to) => {
    if(!cache.has(from)) {
      cache.set(from, new Map());
    }
    let toMap = cache.get(from);
    if(toMap.has(to)) {
      return toMap.get(to);
    }
    let res = getNumpadPaths(from, to);
    toMap.set(to, res);
    return res;
  };
};

const getDirpadPathsMemo = () => {
  let cache = new Map();
  return (from, to) => {
    if(!cache.has(from)) {
      cache.set(from, new Map());
    }
    let toMap = cache.get(from);
    if(toMap.has(to)) {
      return toMap.get(to);
    }
    let res = getDirpadPaths(from, to);
    toMap.set(to, res);
    return res;
  };
};

module.exports = {
  getNumpadPathsMemo,
  getDirpadPathsMemo,
};

function getDirpadPaths(from, to) {
  let fx, fy;
  let tx, ty;
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
  let minPathLen = Infinity;
  visited[sPos.y][sPos.x] = true;
  helper(sPos, []);
  foundPaths = foundPaths.filter(foundPath => {
    return foundPath.length <= minPathLen;
  });
  return foundPaths;
  function helper(pos, soFar) {
    soFar = soFar ?? [];
    if(pos.x === ePos.x && pos.y === ePos.y) {
      let foundPath = [ ...soFar ];
      if(foundPath.length < minPathLen) {
        minPathLen = foundPath.length;
      }
      foundPaths.push(foundPath);
      // foundPaths.push([ ...soFar ]);
      return;
    }
    // for(let d = 0; d < directions.length; ++d) {
    for(let d = directions.length - 1; d >= 0; --d) {
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

function getNumpadPaths(from, to) {
  let fx, fy;
  let tx, ty;
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
  let minPathLen = Infinity;
  visited[sPos.y][sPos.x] = true;
  helper(sPos, []);
  foundPaths = foundPaths.filter(foundPath => {
    return foundPath.length <= minPathLen;
  });
  return foundPaths;
  function helper(pos, soFar) {
    soFar = soFar ?? [];
    if(pos.x === ePos.x && pos.y === ePos.y) {
      let foundPath = [ ...soFar ];
      if(foundPath.length < minPathLen) {
        minPathLen = foundPath.length;
      }
      foundPaths.push(foundPath);
      return;
    }
    // for(let d = 0; d < directions.length; ++d) {
    for(let d = directions.length - 1; d >= 0; --d) {
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
