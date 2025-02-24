const { Point } = require('../lib/geom/point');

const GRID_TILE_ENUM = {
  empty: 0,
  jump: 1,
  wall: 2,
};

module.exports = {
  day20Part1,
};

function day20Part1(inputLines) {
  let day20Input = parseInput(inputLines);
  let grid = day20Input.grid;
  let startPos = day20Input.startPos;
  let endPos = day20Input.endPos;
  // console.log(grid.map(row => row.join('')).join('\n'));
  printGrid(grid);
  let paths = findPaths(grid, startPos, endPos);
  return -1;
}

let directions = [
  new Point(0, -1),
  new Point(1, 0),
  new Point(0, 1),
  new Point(-1, 0),
];

function findPaths(grid, sPos, ePos) {
  let w = grid[0].length;
  let h = grid.length;
  let visited = {};
  helper(sPos);
  function helper(mvPt, soFar) {
    soFar = soFar ?? [];
    if(mvPt.x === ePos.x && mvPt.y === ePos.y) {
      console.log(soFar);
      console.log(soFar.length);
    }
    visited[mvPt.keyStr()] = true;
    for(let d = 0; d < directions.length; d++) {
      let dPt = directions[d];
      let adjPt = new Point(mvPt.x + dPt.x, mvPt.y + dPt.y);
      if(
        adjPt.x < w
        && adjPt.x > 0
        && adjPt.y < h
        && adjPt.y > 0
        && grid[adjPt.y][adjPt.x] === GRID_TILE_ENUM.empty
        && !visited[adjPt.keyStr()]
      ) {
        soFar.push(adjPt);
        helper(adjPt, soFar);
        soFar.pop();
      }
    }
    visited[mvPt.keyStr()] = false;
  }
}

function printGrid(grid) {
  for(let y = 0; y < grid.length; ++y) {
    for(let x = 0; x < grid[y].length; ++x) {
      let tileVal = grid[y][x];
      let c;
      if(tileVal === GRID_TILE_ENUM.empty) {
        c = '.';
      } else if(tileVal === GRID_TILE_ENUM.wall) {
        c = '#';
      } else {
        c = `${tileVal}`;
      }
      // process.stdout.write(`${grid[y][x]}`);
      process.stdout.write(c);
    }
    process.stdout.write('\n');
  }
}

function parseInput(inputLines) {
  let rawGrid = [];
  let startPos, endPos;
  for(let y = 0; y < inputLines.length; ++y) {
    let inputLine = inputLines[y];
    let row = [];
    for(let x = 0; x < inputLine.length; ++x) {
      let c = inputLine[x];
      if(c === 'S') {
        startPos = new Point(x, y);
      } else if(c === 'E') {
        endPos = new Point(x, y);
      }
      if(c === '#') {
        row.push('#');
      } else {
        row.push('.');
      }
    }
    rawGrid.push(row);
  }
  let grid = [];
  for(let y = 0; y < rawGrid.length; ++y) {
    let row = [];
    for(let x = 0; x < rawGrid[y].length; ++x) {
      let rawTile = rawGrid[y][x];
      if(rawTile === '.') {
        row.push(GRID_TILE_ENUM.empty);
      } else if(rawTile === '#') {
        if(
          (
            (rawGrid[y + 1]?.[x] === '.')
            && (rawGrid[y - 1]?.[x] === '.')
          ) || (
            (rawGrid[y]?.[x + 1] === '.')
            && (rawGrid[y]?.[x - 1] === '.')
          )
        ) {
          row.push(GRID_TILE_ENUM.jump);
        } else {
          row.push(GRID_TILE_ENUM.wall);
        }
      }
    }
    grid.push(row);
  }
  let res = {
    grid,
    startPos,
    endPos,
  };
  return res;
}
