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
  getPathDistMap,
  getPart2Grid,
  copyGrid,
};

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
      /* found */
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
