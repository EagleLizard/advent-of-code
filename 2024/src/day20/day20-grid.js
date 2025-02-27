const { Queue } = require('../lib/datastruct/queue');
const { Point } = require('../lib/geom/point');

const GRID_TILE_ENUM = {
  empty: 0,
  jump: 1,
  wall: 2,
  search: 3,
};

const directions = [
  new Point(0, -1),
  new Point(1, 0),
  new Point(0, 1),
  new Point(-1, 0),
];

module.exports = {
  GRID_TILE_ENUM,
  directions,
  getManhattanPts,
  getPathDistMap,
  getPart2Grid,
  copyGrid,
};

function getManhattanPts(grid, srcPt, dist) {
  /*
  |x1 - x2| + |y1 - y2|
  a point is in the sphere if it's manhattan distance is >= dist
  Find the upper and lower bounds:
    x-dist < x < x + dist
  _*/
  let w = grid[0].length;
  let h = grid.length;
  let up = Math.max(srcPt.y - dist, 0);
  let right = Math.min(srcPt.x + dist, w - 1);
  let down = Math.min(srcPt.y + dist, h - 1);
  let left = Math.max(srcPt.x - dist, 0);
  let mPts = [];
  for(let y = up; y <= down; ++y) {
    for(let x = left; x <= right; ++x) {
      let mDist = Math.abs(x - srcPt.x) + Math.abs(y - srcPt.y);
      if(mDist <= dist && grid[y][x] === GRID_TILE_ENUM.empty) {
        let mPt = new Point(x, y);
        let collision = wallCollision(grid, srcPt, mPt);
        if(collision) {
          mPts.push({
            point: mPt,
            mDist,
          });
        }
      }
    }
  }
  return mPts;
}

function wallCollision(grid, sPt, ePt) {
  /*
    try bounding box
  _*/
  let minX = Math.min(sPt.x, ePt.x);
  let maxX = Math.max(sPt.x, ePt.x);
  let minY = Math.min(sPt.y, ePt.y);
  let maxY = Math.max(sPt.y, ePt.y);
  for(let y = minY; y <= maxY; ++y) {
    if(
      grid[y][minX] !== GRID_TILE_ENUM.empty
      || grid[y][maxX] !== GRID_TILE_ENUM.empty
    ) {
      return true;
    }
  }
  for(let x = minX; x <= maxX; ++x) {
    if(
      grid[minY][x] !== GRID_TILE_ENUM.empty
      || grid[maxY][x] !== GRID_TILE_ENUM.empty
    ) {
      return true;
    }
  }
  return false;
}

/*
  Given a grid with a single path, find the path and return
    a map of the distance from each point to the end
_*/
function getPathDistMap(grid, sPos, ePos) {
  let w = grid[0].length;
  let h = grid.length;
  let visited = [];
  let distMap = [];
  let queue = new Queue();
  for(let y = 0; y < grid.length; ++y) {
    visited.push({});
    distMap.push(new Map());
  }
  visited[sPos.y][sPos.x] = true;
  queue.push({
    mvPt: sPos,
    soFar: 0,
    pathSoFar: [],
  });
  while(!queue.empty()) {
    let currItem = queue.pop();
    let mvPt = currItem.mvPt;
    let soFar = currItem.soFar;
    let pathSoFar = currItem.pathSoFar;
    visited[mvPt.y][mvPt.x] = true;
    distMap[mvPt.y].set(mvPt.x, soFar);
    if(mvPt.x === ePos.x && mvPt.y === ePos.y) {
      /*
        found
        At this point, distMap contains the distance traveled at any point so-far.
          Now that the length to the end is known, we want to convert this to the
          length of the given point to the end of the path
      _*/
      for(let y = 0; y < distMap.length; ++y) {
        let currMap = distMap[y];
        let keys = [ ...currMap.keys() ];
        for(let i = 0; i < keys.length; ++i) {
          let key = keys[i];
          currMap.set(key, soFar - currMap.get(key));
        }
      }
      let res = {
        path: pathSoFar,
        distMap,
      };
      return res;
    }
    for(let i = 0; i < directions.length; ++i) {
      let d = directions[i];
      let nx = mvPt.x + d.x;
      let ny = mvPt.y + d.y;
      if(
        nx < w
        && nx >= 0
        && ny < h
        && ny >= 0
        && grid[ny][nx] === GRID_TILE_ENUM.empty
        && !visited[ny][nx]
      ) {
        let adjPt = new Point(nx, ny);
        queue.push({
          mvPt: adjPt,
          soFar: soFar + 1,
          pathSoFar: [ ...pathSoFar, adjPt ],
        });
      }
    }
  }
}

/*
  we don't care about the original jump tiles in part1
_*/
function getPart2Grid(srcGrid) {
  let grid = copyGrid(srcGrid);
  for(let y = 0; y < grid.length; ++y) {
    for(let x = 0; x < grid[y].length; ++x) {
      if(grid[y][x] !== GRID_TILE_ENUM.empty) {
        grid[y][x] = GRID_TILE_ENUM.wall;
      }
    }
  }
  return grid;
}

function copyGrid(grid) {
  let nextGrid = [];
  for(let y = 0; y < grid.length; ++y) {
    let row = [];
    for(let x = 0; x < grid[y].length; ++x) {
      row.push(grid[y][x]);
    }
    nextGrid.push(row);
  }
  return nextGrid;
}
