
const { Queue } = require('../lib/datastruct/queue');
const { Point } = require('../lib/geom/point');
const day20Grid = require('./day20-grid');

const GRID_TILE_ENUM = day20Grid.GRID_TILE_ENUM;
const directions = day20Grid.directions;

module.exports = {
  day20Part1,
  day20Part2,
};

function day20Part2(inputLines) {
  let day20Input = parseInput(inputLines);
  let grid = day20Input.grid;
  let startPos = day20Input.startPos;
  let endPos = day20Input.endPos;
  // dist = 12;
  // printGrid(grid, undefined, undefined);
  // printGridM(grid, startPos, dist);
  // let initPath = findPaths2(grid, startPos, endPos)?.[0];
  
  let longCheatPaths = findLongCheatPaths(grid, startPos, endPos);
}

function findLongCheatPaths(srcGrid, sPos, ePos) {
  let dist = 20;
  // dist = 8;
  let grid = day20Grid.getPart2Grid(srcGrid);
  let pathDistMap = day20Grid.getPathDistMap(grid, sPos, ePos);
  let distMap = pathDistMap.distMap;
  let visited = [];
  let cheatMap = new Map();
  for(let y = 0; y < grid.length; ++y) {
    visited.push({});
  }
  visited[sPos.y][sPos.x] = true;
  let initPathDist = distMap[sPos.y].get(sPos.x);
  // console.log({ initPathDist });
  for(let i = 0; i < pathDistMap.path.length; ++i) {
    let currPt = pathDistMap.path[i];
    let allMPts = getManhattanPts(grid, currPt, dist);
    let mPts = [];
    visited[currPt.y][currPt.x] = true;
    /* filter points that have been visited  */
    for(let k = 0; k < allMPts.length; ++k) {
      let mPt = allMPts[k];
      if(!visited[mPt.y][mPt.x]) {
        mPts.push(mPt);
      }
    }
    let currDist = distMap[currPt.y].get(currPt.x);
    // console.log(currDist);
    for(let k = 0; k < mPts.length; ++k) {
      /* this approach didn't work */
      let mPt = mPts[k];
      // console.log(mPt);
      // let mDist = distMap[mPt.y].get(mPt.x);
      let mDist = distMap[mPt.y].get(mPt.x);
      let cDist = currDist - mDist;
      let savedLen = cDist;
      let currCheatCount = cheatMap.has(savedLen)
        ? cheatMap.get(savedLen)
        : 0
      ;
      cheatMap.set(savedLen, currCheatCount + 1);
      if(savedLen === 83) {
        console.log(savedLen);
        console.log({ mPt });
      }
    }
    // printGridM(grid, currPt, mPts, dist);
    // console.log({ currDist });
    // if(i > 20) {
    //   break;
    // }
  }
  [ ...cheatMap ].toSorted((a, b) => {
    return a[0] - b[0];
  }).filter(cheatMapTuple => {
    return cheatMapTuple[0] >= 50;
  }).forEach(cheatMapTuple => {
    let savedPicos = cheatMapTuple[0];
    let cheatCount = cheatMapTuple[1];
    console.log(`cheats: ${cheatCount}, picos=${savedPicos}`);
  });
}

function getManhattanPts(grid, srcPt, dist) {
  let w = grid[0].length;
  let h = grid.length;
  /*
  |x1 - x2| + |y1 - y2|
  a point is in the sphere if it's manhattan distance is >= dist
  Find the upper and lower bounds:
    x-dist < x < x + dist
  _*/
  let up = srcPt.y - dist;
  let right = srcPt.x + dist;
  let down = srcPt.y + dist;
  let left = srcPt.x - dist;
  if(up < 0) {
    up = 0;
  }
  if(right > (w - 1)) {
    right = w - 1;
  }
  if(down > (h - 1)) {
    down = h - 1;
  }
  if(left < 0) {
    left = 0;
  }
  // console.log({ up, right, down, left });
  let mPts = [];
  for(let y = up; y <= down; ++y) {
    for(let x = left; x <= right; ++x) {
      let d = Math.abs(x - srcPt.x) + Math.abs(y - srcPt.y);
      // if(d === dist && grid[y][x] === GRID_TILE_ENUM.empty) {
      if(d <= dist && grid[y][x] === GRID_TILE_ENUM.empty) {
        let mPt = new Point(x, y);
        /*
          check if a wall would need to be crossed to reach destination
        _*/
        let collision = wallCollision(grid, srcPt, mPt);
        if(collision) {
          mPts.push(new Point(x, y));
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

function printGridM(srcGrid, sPos, mPts, dist) {
  let grid = day20Grid.copyGrid(srcGrid);
  // let mPts = getManhattanPts(grid, sPos, dist);
  let charGrid = [];
  for(let i = 0; i < mPts.length; ++i) {
    let mPt = mPts[i];
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
      } else if(gridVal === GRID_TILE_ENUM.empty) {
        c = '.';
      }
      row.push(c);
    }
    charGrid.push(row);
  }
  
  charGrid[sPos.y][sPos.x] = 'S';
 
  let gridStr = '';
  for(let y = 0; y < charGrid.length; ++y) {
    for(let x = 0; x < charGrid[y].length; ++x) {
      let c = charGrid[y][x];
      // process.stdout.write(c);
      gridStr += c;
    }
    // process.stdout.write('\n');
    gridStr += '\n';
  }
  process.stdout.write(gridStr);
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
  let jumpPoints = getJumpable(grid);
  // printGrid(grid);
  // let initPaths = findPaths(grid, startPos, endPos);
  let initPaths = findPaths2(grid, startPos, endPos);
  let initPathLen = initPaths[0];
  // printGrid(grid, initPath);
  let numJumpPoints = jumpPoints.length;
  console.log(numJumpPoints);
  // findCheatPaths(grid, startPos, endPos, initPath);
  // let savedCheatCount = findCheatPaths2(grid, initPath);
  let savedCheatCount = findCheatPaths3(grid, startPos, endPos, initPathLen);
  return savedCheatCount;
}

function findCheatPaths3(srcGrid, sPos, ePos, initPathLen) {
  let isTest = initPathLen < 5_000;
  let targetDiff = isTest ? 10 : 100;
  // console.log(initPath.length); 
  // return;
  let cheatMap = new Map();
  let jumpPoints = getJumpable(srcGrid);
  let savedCheatCount = 0;
  for(let i = 0; i < jumpPoints.length; ++i) {
    let jPt = jumpPoints[i];
    let grid = day20Grid.copyGrid(srcGrid);
    grid[jPt.y][jPt.x] = GRID_TILE_ENUM.empty;
    // console.log(jPt);
    // printGrid(grid);
    let foundPaths = findPaths2(grid, sPos, ePos);
    for(let k = 0; k < foundPaths.length; ++k) {
      let foundPath = foundPaths[k];
      if(foundPath < initPathLen) {
        let lenDiff = initPathLen - foundPath;
        let currCheatCount = (cheatMap.has(lenDiff))
          ? cheatMap.get(lenDiff)
          : 0
        ;
        cheatMap.set(lenDiff, currCheatCount + 1);
        if(lenDiff >= targetDiff) {
          savedCheatCount++;
        }
      }
    }
  }
  // [ ...cheatMap ].toSorted((a, b) => {
  //   return a[0] - b[0];
  // }).forEach(cheatMapTuple => {
  //   let savedPicos = cheatMapTuple[0];
  //   let cheatCount = cheatMapTuple[1];
  //   console.log(`cheats: ${cheatCount}, picos=${savedPicos}`);
  // });
  return savedCheatCount;
}

function findPaths2(grid, sPos, ePos) {
  let w = grid[0].length;
  let h = grid.length;
  let visited = [];
  let foundPaths = [];
  let queue = new Queue();
  queue.push({
    mvPt: sPos,
    soFar: 0,
  });
  for(let y = 0; y < grid.length; ++y) {
    visited.push({});
  }
  visited[sPos.y][sPos.x] = true;
  while(!queue.empty()) {
    let currItem = queue.pop();
    let mvPt = currItem.mvPt;
    let soFar = currItem.soFar;
    if(mvPt.x === ePos.x && mvPt.y === ePos.y) {
      foundPaths.push(soFar);
    }
    visited[mvPt.y][mvPt.x] = true;
    for(let d = 0; d < directions.length; ++d) {
      let dPt = directions[d];
      let nx = mvPt.x + dPt.x;
      let ny = mvPt.y + dPt.y;
      if(
        nx < w
        && nx >= 0
        && ny < h
        && ny >= 0
        && grid[ny][nx] === GRID_TILE_ENUM.empty
        && !visited[ny][nx]
      ) {
        queue.push({
          mvPt: new Point(nx, ny),
          soFar: soFar + 1,
        });
      }
    }
  }
  return foundPaths;
}

function getJumpable(grid) {
  let jumpPoints = [];
  for(let y = 0; y < grid.length; ++y) {
    for(let x = 0; x < grid[y].length; ++x) {
      if(grid[y][x] === GRID_TILE_ENUM.jump) {
        jumpPoints.push(new Point(x, y));
      }
    }
  }
  return jumpPoints;
}

function printGrid(grid, trackPath, cheatPoint) {
  let charGrid = [];
  for(let y = 0; y < grid.length; ++y) {
    let row = [];
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
      // process.stdout.write(c);
      row.push(c);
    }
    // process.stdout.write('\n');
    charGrid.push(row);
  }
  if(trackPath !== undefined) {
    for(let i = 0; i < trackPath.length; ++i) {
      let tPt = trackPath[i];
      'å∫ç∂´ƒ©˙ˆ∆˚¬µ˜øπœ®ß†¨√∑≈¥¡™£¢∞§¶•ªº';
      // charGrid[tPt.y][tPt.x] = '∆';
      charGrid[tPt.y][tPt.x] = 'o';
    }
  }
  if(cheatPoint !== undefined) {
    charGrid[cheatPoint.y][cheatPoint.x] = ' ';
  }
  for(let y = 0; y < charGrid.length; ++y) {
    for(let x = 0; x < charGrid[y].length; ++x) {
      process.stdout.write(charGrid[y][x]);
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
