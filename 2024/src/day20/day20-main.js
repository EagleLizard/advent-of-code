const { Queue } = require('../lib/datastruct/queue');
const { Point } = require('../lib/geom/point');

const GRID_TILE_ENUM = {
  empty: 0,
  jump: 1,
  wall: 2,
};

const directions = [
  new Point(0, -1),
  new Point(1, 0),
  new Point(0, 1),
  new Point(-1, 0),
];

module.exports = {
  day20Part1,
};

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
  printGrid(grid);
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
    let grid = copyGrid(srcGrid);
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

function findCheatPaths2(grid, initPath) {
  let cheatMap = new Map();
  let jumpPoints = getJumpable(grid);
  /* 
    For any given jump point, find the indices of the 2 points adjacent on the initPath.
  _*/
  let jPaths = [];
  let savedCheatCount = 0;
  for(let i = 0; i < jumpPoints.length; ++i) {
    let jPt = jumpPoints[i];
    let foundPath = findCheat(grid, initPath, jPt);
    if(foundPath !== undefined) {
      jPaths.push(foundPath);
    }
  }
  for(let i = 0; i < jPaths.length; ++i) {
    let jPath = jPaths[i];
    let lenDiff = initPath.length - jPath.length;
    let currCheatCount = cheatMap.has(lenDiff)
      ? cheatMap.get(lenDiff)
      : 0
    ;
    cheatMap.set(lenDiff, currCheatCount + 1);
    if(lenDiff >= 100) {
      savedCheatCount++;
    }
  }
  // console.log(jPaths.length);
  // console.log(cheatMap);
  let cheatMapTuples = [ ...cheatMap ].toSorted((a, b) => {
    return a[0] - b[0];
  });
  cheatMapTuples.forEach(cheatMapTuple => {
    let savedPicos = cheatMapTuple[0];
    let cheatCount = cheatMapTuple[1];
    console.log(`cheats: ${cheatCount}, picos=${savedPicos}`);
  });
  return savedCheatCount;
}

function findCheat(grid, initPath, cPt) {
  let sPt, ePt;
  let jPath = [];
  let pt1, pt2;
  if(
    (grid[cPt.y][cPt.x + 1] === GRID_TILE_ENUM.empty)
    && (grid[cPt.y][cPt.x - 1] === GRID_TILE_ENUM.empty)
  ) {
    /* horizontal */
    pt1 = new Point(cPt.x + 1, cPt.y);
    pt2 = new Point(cPt.x - 1, cPt.y);
  } else if(
    (grid[cPt.y + 1][cPt.x] === GRID_TILE_ENUM.empty)
    && (grid[cPt.y - 1][cPt.x] === GRID_TILE_ENUM.empty)
  ) {
    /* vertical */
    pt1 = new Point(cPt.x, cPt.y + 1);
    pt2 = new Point(cPt.x, cPt.y - 1);
  }
  if(pt1 === undefined || pt2 === undefined) {
    return undefined;
  }
  
  for(let i = 0; i < initPath.length; ++i) {
    let iPt = initPath[i];
    if(sPt === undefined) {
      if(
        (iPt.x === pt1.x && iPt.y === pt1.y)
        || (iPt.x === pt2.x && iPt.y === pt2.y)
      ) {
        sPt = iPt;
      }
      jPath.push(iPt);
    } else if(sPt !== undefined && ePt === undefined) {
      if(
        (iPt.x === pt1.x && iPt.y === pt1.y)
        || (iPt.x === pt2.x && iPt.y === pt2.y)
      ) {
        ePt = iPt;
      }
      if(ePt !== undefined) {
        jPath.push(cPt);
        jPath.push(ePt);
      }
    } else if(sPt !== undefined && ePt !== undefined) {
      jPath.push(iPt);
    }
  }
  if(ePt === undefined) {
    return undefined;
  }
  return jPath;
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
      let adjPt = new Point(mvPt.x + dPt.x, mvPt.y + dPt.y);
      if(
        adjPt.x < w
        && adjPt.x >= 0
        && adjPt.y < h
        && adjPt.y >= 0
        && grid[adjPt.y][adjPt.x] === GRID_TILE_ENUM.empty
        && !visited[adjPt.y][adjPt.x]
      ) {
        let nsf = soFar + 1;
        queue.push({
          mvPt: adjPt,
          soFar: nsf,
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
