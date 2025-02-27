
const { Queue } = require('../lib/datastruct/queue');
const { Point } = require('../lib/geom/point');
const day20Grid = require('./day20-grid');

const GRID_TILE_ENUM = day20Grid.GRID_TILE_ENUM;
const directions = day20Grid.directions;

module.exports = {
  day20Part1,
  day20Part2,
};

/*
1037936 - correct
_*/
function day20Part2(inputLines) {
  let day20Input = parseInput(inputLines);
  let grid = day20Input.grid;
  let startPos = day20Input.startPos;
  let endPos = day20Input.endPos;
  let longCheatPaths = findLongCheatPaths2(grid, startPos, endPos);
  return longCheatPaths;
}

function findLongCheatPaths2(srcGrid, sPos, ePos) {
  let dist = 20;
  // dist = 5;
  let grid = day20Grid.getPart2Grid(srcGrid);
  let pathDistMap = day20Grid.getPathDistMap(grid, sPos, ePos);
  let distMap = pathDistMap.distMap;
  let initPath = pathDistMap.path;

  let isTest = initPath.length < 5_000;
  let saveTarget = isTest ? 50 : 100;

  let visited = [];
  let savedCheatCount = 0;
  for(let y = 0; y < grid.length; ++y) {
    visited.push({});
  }
  let fullPath = [ sPos, ...initPath ];
  /*
    when calculating the cheat distance, I need to account for the
      length of the path of the cheat as well
  _*/
  for(let i = 0; i < fullPath.length; ++i) {
    let currPt = fullPath[i];
    visited[currPt.y][currPt.x] = true;
    let currDist = fullPath.length - 1 - i;
    let allMPts = day20Grid.getManhattanPts(grid, currPt, dist);
    let mPts = [];
    for(let k = 0; k < allMPts.length; ++k) {
      let mPt = allMPts[k].point;
      let mDist = allMPts[k].mDist;
      if(!visited[mPt.y][mPt.x]) {
        /* compare vs. the cost of going to that point normally */
        let baseMCost = distMap[mPt.y].get(mPt.x);
        if((baseMCost + mDist) < currDist) {
          mPts.push(allMPts[k]);
        } 
      }
    }
    /*
      At this point, mPts should contain only all possible cheats
        that would actually save time vs. walking the path normally
    _*/
    for(let k = 0; k < mPts.length; ++k) {
      let mPt = mPts[k].point;
      let mDist = mPts[k].mDist;
      let cDist = distMap[mPt.y].get(mPt.x) + mDist;
      let savedPicos = currDist - cDist;
      if(savedPicos >= saveTarget) {
        savedCheatCount++;
      }
    }
  }
  return savedCheatCount;
}

function printGridM(srcGrid, sPos, mPts) {
  let grid = day20Grid.copyGrid(srcGrid);
  // let mPts = getManhattanPts(grid, sPos, dist);
  let charGrid = [];
  for(let i = 0; i < mPts.length; ++i) {
    let mPt = mPts[i].point;
    let mDist = mPts[i].mDist;
    grid[mPt.y][mPt.x] = GRID_TILE_ENUM.search;
  }
  for(let y = 0; y < grid.length; ++y) {
    let row = [];
    for(let x = 0; x < grid[y].length; ++x) {
      let gridVal = grid[y][x];
      let c;
      if(gridVal === GRID_TILE_ENUM.wall || gridVal === GRID_TILE_ENUM.jump) {
        c = '#';
      } else if(gridVal === GRID_TILE_ENUM.search) {
        c = 'm';
        let mPt = mPts.find(mPt => mPt.point.x === x && mPt.point.y === y);
        if(mPt !== undefined) {
          c = mPt.mDist.toString(32);
        }
        // c = mDist.toString(32);
      } else if(gridVal === GRID_TILE_ENUM.empty) {
        c = '.';
      }
      row.push(c);
    }
    charGrid.push(row);
  }
  
  charGrid[sPos.y][sPos.x] = 'S';
 
  for(let y = 0; y < charGrid.length; ++y) {
    let lineStr = '';
    for(let x = 0; x < charGrid[y].length; ++x) {
      let c = charGrid[y][x];
      // process.stdout.write(c);
      lineStr += c;
    }
    // process.stdout.write('\n');
    // gridStr += '\n';
    process.stdout.write(`${lineStr}\n`);
  }
  // process.stdout.write(gridStr);
}

/*
1506 - too low
1507 - correct
_*/
function day20Part1(inputLines) {
  let day20Input = parseInput(inputLines);
  let grid = day20Input.grid;
  let startPos = day20Input.startPos;
  let endPos = day20Input.endPos;
  
  let savedCheatCount = findCheatPaths4(grid, startPos, endPos);
  
  return savedCheatCount;
}

function findCheatPaths4(srcGrid, sPos, ePos) {
  let grid = day20Grid.copyGrid(srcGrid);
  let pathDistMap = day20Grid.getPathDistMap(grid, sPos, ePos);
  let distMap = pathDistMap.distMap;
  // let initPath = pathDistMap.path;
  let fullPath = [ sPos, ...pathDistMap.path ];

  let isTest = fullPath.length < 5_000;
  let saveTarget = isTest ? 10 : 100;

  let savedCheatCount = 0;

  let visited = [];
  for(let y = 0; y < grid.length; ++y) {
    visited.push({});
  }
  for(let i = 0; i < fullPath.length; ++i) {
    let currPt = fullPath[i];
    let currDist = fullPath.length - 1 - i;
    visited[currPt.y][currPt.x] = true;
    /*
      find any adjacent jump points
    _*/
    let adjPts = [];
    for(let k = 0; k < directions.length; ++k) {
      let d = directions[k];
      let jx = currPt.x + d.x;
      let jy = currPt.y + d.y;
      /*
        the destination point for the jump will be the direction
          of the current jump point with 2x distance
      _*/
      let dx = jx + d.x;
      let dy = jy + d.y;
      if(
        grid[jy][jx] === GRID_TILE_ENUM.jump
        && (
          grid[dy][dx] === GRID_TILE_ENUM.empty
          && !visited[dy][dx]
        )
      ) {
        let cDist = distMap[dy].get(dx) + 2;
        let savedPicos = currDist - cDist;
        if(savedPicos >= saveTarget) {
          savedCheatCount++;
        }
      }
    }
  }
  return savedCheatCount;
}

function printGrid2(srcGrid, sPos, ePos, trackPath) {
  let grid = day20Grid.copyGrid(srcGrid);
  let charGrid = [];
  for(let y = 0; y < grid.length; ++y) {
    let row = [];
    for(let x = 0; x < grid[y].length; ++x) {
      let gridVal = grid[y][x];
      let c;
      if(gridVal === GRID_TILE_ENUM.wall) {
        c = '#';
      } else if(gridVal === GRID_TILE_ENUM.jump) {
        c = '#';
      } else if(gridVal === GRID_TILE_ENUM.empty) {
        c = '.';
      }
      row.push(c);
    }
    charGrid.push(row);
  }
  if(sPos !== undefined) {
    charGrid[sPos.y][sPos.x] = 'S';
  }
  if(ePos !== undefined) {
    charGrid[ePos.y][ePos.x] = 'E';
  }
  for(let y = 0; y < charGrid.length; ++y) {
    let lineStr = '';
    for(let x = 0; x < charGrid[y].length; ++x) {
      lineStr += charGrid[y][x];
    }
    process.stdout.write(`${lineStr}\n`);
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
