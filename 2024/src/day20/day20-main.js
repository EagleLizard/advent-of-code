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

function day20Part1(inputLines) {
  let day20Input = parseInput(inputLines);
  let grid = day20Input.grid;
  let startPos = day20Input.startPos;
  let endPos = day20Input.endPos;
  let jumpPoints = getJumpable(grid);
  printGrid(grid);
  // let initPaths = findPaths(grid, startPos, endPos);
  let initPaths = findPaths2(grid, startPos, endPos);
  let initPath = initPaths[0];
  printGrid(grid, initPath);
  let cheatMap = new Map();
  let numJumpPoints = jumpPoints.length;
  console.log(numJumpPoints);
  // findCheatPaths(grid, startPos, endPos, initPath);
  findCheatPaths2(grid, initPath);
  return -1;
}

function findCheatPaths2(grid, initPath) {
  let cheatMap = new Map();
  let jumpPoints = getJumpable(grid);
  /* 
    For any given jump point, find the indices of the 2 points adjacent on the initPath.
  _*/
  let jPaths = [];
  for(let i = 0; i < jumpPoints.length; ++i) {
    let jumpStartIdx;
    let jumpEndIdx;
    let jPt = jumpPoints[i];
    let jumpStartPt, jumpEndPt;
    /*
      Find 2 points along the track that are on the same axis
        and adjacent to the jump point
    _*/
    let upPt = directions[0];
    let downPt = directions[2];
    let leftPt = directions[3];
    let rightPt = directions[1];
    let du = new Point(upPt.x + jPt.x, upPt.y + jPt.y);
    let dd = new Point(downPt.x + jPt.x, downPt.y + jPt.y);
    let dl = new Point(leftPt.x + jPt.x, leftPt.y + jPt.y);
    let dr = new Point(rightPt.x + jPt.x, rightPt.y + jPt.y);
    let horiz = (
      (grid[dl.y][dl.x] === GRID_TILE_ENUM.empty)
      && (grid[dr.y][dr.x] === GRID_TILE_ENUM.empty)
    );
    let vert = (
      (grid[du.y][du.x] === GRID_TILE_ENUM.empty)
      && (grid[dd.y][dd.x] === GRID_TILE_ENUM.empty)
    );
    /*
      make new horizontal path
    _*/
    if(horiz) {
      // let sPt = dl;
      // let ePt = dr;
      let sPt, ePt;
      let jPath = [];
      for(let k = 0; k < initPath.length; ++k) {
        let iPt = initPath[k];
        if(sPt === undefined) {
          if(iPt.x === dl.x && iPt.y === dl.y) {
            sPt = dl;
          } else if(iPt.x === dr.x && iPt.y === dr.y) {
            sPt = dr;
          }
          jPath.push(iPt);
        }else if(sPt !== undefined && ePt === undefined) {
          if(iPt.x === dl.x && iPt.y === dl.y) {
            ePt = dl;
          } else if(iPt.x === dr.x && iPt.y === dr.y) {
            ePt = dr;
          }
          if(ePt !== undefined) {
            jPath.push(jPt);
            jPath.push(ePt);
          }
        }else if(sPt !== undefined && ePt !== undefined) {
          jPath.push(iPt);
        }
      }
      if(sPt !== undefined && ePt !== undefined) {
        jPaths.push(jPath);
      }
    } else if(vert) {
      /* vertical */
      let sPt, ePt;
      let jPath = [];
      for(let k = 0; k < initPath.length; ++k) {
        let iPt = initPath[k];
        if(sPt === undefined) {
          if(iPt.x === du.x && iPt.y === du.y) {
            sPt = du;
          } else if(iPt.x === dd.x && iPt.y === dd.y) {
            sPt = dd;
          }
          jPath.push(iPt);
        } else if (sPt !== undefined && ePt === undefined) {
          if(iPt.x === du.x && iPt.y === du.y) {
            ePt = du;
          } else if(iPt.x === dd.x && iPt.y === dd.y) {
            ePt = dd;
          }
          if(ePt !== undefined) {
            jPath.push(jPt);
            jPath.push(ePt);
          }
        } else if(sPt !== undefined && ePt !== undefined) {
          jPath.push(iPt);
        }
      }
      if(sPt !== undefined && ePt !== undefined) {
        jPaths.push(jPath);
      }
    }
  }
  console.log(jPaths.length);
  console.log(cheatMap);
  let cheatMapTuples = [ ...cheatMap ].toSorted((a, b) => {
    return a[0] - b[0];
  });
  cheatMapTuples.forEach(cheatMapTuple => {
    let savedPicos = cheatMapTuple[0];
    let cheatCount = cheatMapTuple[1];
    console.log(`cheats: ${cheatCount}, picos=${savedPicos}`);
  });
}

function findCheatPaths(grid, startPos, endPos, initPath) {
  let cheatMap = new Map();
  let jumpPoints = getJumpable(grid);
  for(let i = 0; i < jumpPoints.length; ++i) {
    let jumpPoint = jumpPoints[i];
    let gridCopy = copyGrid(grid);
    gridCopy[jumpPoint.y][jumpPoint.x] = GRID_TILE_ENUM.empty;
    // let foundPaths = findPaths(gridCopy, startPos, endPos);
    let foundTrackPoint;
    let foundTrackPointIdx;
    for(let k = 0; k < initPath.length; ++k) {
      let pathPt = initPath[k];
      /*
        find the first point on the original path that is adjacent to the cheat path
      _*/
      if(
        (
          (pathPt.x === jumpPoint.x)
          && (
            (jumpPoint.y === (pathPt.y - 1))
            || (jumpPoint.y === (pathPt.y + 1))
          )
        ) || (
          (pathPt.y === jumpPoint.y)
          && (
            (jumpPoint.x === (pathPt.x - 1))
            || (jumpPoint.x === (pathPt.x + 1))
          )
        )
      ) {
        foundTrackPointIdx = k;
        break;
        // foundTrackPoint = pathPt;
      }
    }
    foundTrackPoint = initPath[foundTrackPointIdx];
    // console.log(foundTrackPoint);
    // let foundPaths = findPaths2(gridCopy, startPos, endPos);
    let foundPaths = findPaths2(gridCopy, foundTrackPoint, endPos);
    // console.log(`foundPaths: ${foundPaths.length}`);
    for(let k = 0; k < foundPaths.length; ++k) {
      let foundPath = foundPaths[k];
      // let pathLenDiff = initPath.length - foundPath.length;
      let pathLenDiff = initPath.length - (foundPath.length + foundTrackPointIdx + 1);
      if(pathLenDiff > 0) {
        // console.log(`${k}: ${pathLenDiff}`);
        let currCheatCount = cheatMap.get(pathLenDiff);
        if(currCheatCount === undefined) {
          currCheatCount = 0;
        }
        cheatMap.set(pathLenDiff, currCheatCount + 1);
      }
    }
    if(i > 1) {
      // break;
    }
  }
  let cheatMapTuples = [ ...cheatMap ].toSorted((a, b) => {
    return a[0] - b[0];
  });
  cheatMapTuples.forEach(cheatMapTuple => {
    let savedPicos = cheatMapTuple[0];
    let cheatCount = cheatMapTuple[1];
    console.log(`cheats: ${cheatCount}, picos=${savedPicos}`);
  });
}

function findPaths2(grid, sPos, ePos) {
  let w = grid[0].length;
  let h = grid.length;
  let foundPaths = [];
  let queue = [
    {
      mvPt: sPos,
      visited: {},
      soFar: [],
    }
  ];
  while(queue.length > 0) {
    let currItem = queue.shift();
    let mvPt = currItem.mvPt;
    let soFar = currItem.soFar;
    let visited = currItem.visited;
    if(mvPt.x === ePos.x && mvPt.y === ePos.y) {
      let foundPath = soFar.slice();
      foundPaths.push(foundPath);
    }
    visited[mvPt.keyStr()] = true;
    for(let d = 0; d < directions.length; ++d) {
      let dPt = directions[d];
      let adjPt = new Point(mvPt.x + dPt.x, mvPt.y + dPt.y);
      if(
        adjPt.x < w
        && adjPt.x >= 0
        && adjPt.y < h
        && adjPt.y >= 0
        && grid[adjPt.y][adjPt.x] === GRID_TILE_ENUM.empty
        && !visited[adjPt.keyStr()]
      ) {
        let nsf = soFar.slice();
        let nv = Object.assign({}, visited);
        nsf.push(adjPt);
        queue.push({
          mvPt: adjPt,
          visited: nv,
          soFar: nsf,
        });
      }
    }
  }
  return foundPaths;
}

function findPaths(grid, sPos, ePos) {
  let w = grid[0].length;
  let h = grid.length;
  let visited = {};
  let foundPaths = [];
  helper(sPos);
  return foundPaths;
  function helper(mvPt, soFar) {
    soFar = soFar ?? [];
    if(mvPt.x === ePos.x && mvPt.y === ePos.y) {
      let foundPath = soFar.slice();
      foundPaths.push(foundPath);
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
        // console.log(soFar.length);
        helper(adjPt, soFar);
        soFar.pop();
      }
    }
    visited[mvPt.keyStr()] = false;
  }
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

function printGrid(grid, trackPath) {
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
