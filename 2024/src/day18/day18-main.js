
const { Queue } = require('../lib/datastruct/queue');
const { Point } = require('../lib/geom/point');

const gridEnum = {
  safe: 0,
  corrupt: 2,
};

const gridCharMap = {
  [gridEnum.safe]: '.',
  [gridEnum.corrupt]: '#',
};

const directionPoints = [
  new Point(0, -1), // up
  new Point(1, 0), // right
  new Point(0, 1), // down
  new Point(-1, 0), // left
];

module.exports = {
  day18Part1,
  day18Part2: day18Part2_2,
};

/*
40,64 - wrong
46,45 - wrong
6,36 - correct
_*/
function day18Part2_2(inputLines) {
  let day18Input = parseInput(inputLines);
  let coords = day18Input.coords;
  let isTest = (day18Input.maxX === 6) && (day18Input.maxY === 6);
  let width = isTest ? 7 : 71;
  let height = isTest ? 7 : 71;
  let n = isTest ? 12 : 1024;
  let sPos = new Point(0, 0);
  let ePos = new Point(width - 1, height - 1);
  let invalidIdx;
  let grid = makeGrid(coords, width, height, n);
  while(n < coords.length) {
    // let grid = makeGrid(coords, width, height, n);
    let coord = coords[n];
    grid[coord.y][coord.x] = gridEnum.corrupt;
    // console.log(printGrid(grid));
    let foundPath = findPath(grid, width, height, sPos, ePos);
    // console.log(printGrid(grid, foundPath));
    // console.log(n);
    if(foundPath === undefined) {
      invalidIdx = n;
      break;
    }
    n++;
  }
  // console.log(invalidIdx);
  // console.log(n);
  let firstInvalidCoord = coords[invalidIdx];
  let res = `${firstInvalidCoord.x},${firstInvalidCoord.y}`;
  // console.log(`${res} - ${invalidIdx}`);
  return res;
}
function day18Part2(inputLines) {
  let day18Input = parseInput(inputLines);
  let coords = day18Input.coords;
  let isTest = (day18Input.maxX === 6) && (day18Input.maxY === 6);
  let width = isTest ? 7 : 71;
  let height = isTest ? 7 : 71;
  let sn = isTest ? 12 : 1024;
  let en = coords.length;
  let sPos = new Point(0, 0);
  let ePos = new Point(width - 1, height - 1);
  // console.log(printGrid(makeGrid(coords, width, height, sn)));
  /*
    binary search between start and end
  _*/
  let ln = sn;
  let rn = en;
  let iters = 0;
  let mid;
  let maxFoundIdx = -1;
  while(ln < rn) {
    mid = Math.floor((ln + rn) / 2);
    console.log(`[${ln}, ${rn}] - mid: ${mid}`);
    let grid = makeGrid(coords, width, height, mid);
    console.log(printGrid(grid));
    let foundPath = findPath(grid, width, height, sPos, ePos);
    console.log(foundPath);
    if(foundPath !== undefined) {
      // console.log(printGrid(grid, foundPath));
      maxFoundIdx = Math.max(mid, maxFoundIdx);
      ln = mid + 1;
    } else {
      rn = mid - 1;
    }
    console.log(`[${ln}, ${rn}]`);
  }
  // console.log(coords[mid].keyStr());
  // let midCoord = coords[mid];
  console.log(maxFoundIdx);
  let midCoord = coords[maxFoundIdx];
  return `${midCoord.x},${midCoord.y}`;
  // return -1;
}

/*
382 - correct
_*/
function day18Part1(inputLines) {
  let day18Input = parseInput(inputLines);
  let isTest = (day18Input.maxX === 6) && (day18Input.maxY === 6);
  let width = isTest ? 7 : 71;
  let height = isTest ? 7 : 71;
  let n = isTest ? 12 : 1024;
  let sPos = new Point(0, 0);
  let ePos = new Point(width - 1, height - 1);
  let grid = makeGrid(day18Input.coords, width, height, n);
  let foundPath = findPath(grid, width, height, sPos, ePos);
  return foundPath.length;
}

/*
  bfs
_*/
function findPath(grid, w, h, sPos, ePos) {
  let visited = Array(h).fill(0).map(() => {
    return Array(h).fill(0).map(() => undefined);
  });
  let queue = new Queue();
  queue.push({
    pos: sPos,
    pathSoFar: [],
  });
  let foundPath = undefined;
  visited[sPos.y][sPos.x] = true;
  while(!queue.empty()) {
    let currItem = queue.pop();
    let pos = currItem.pos;
    let pathSoFar = currItem.pathSoFar;
    let x = pos.x;
    let y = pos.y;
    if(x === ePos.x && y === ePos.y) {
      /* path found */
      foundPath = pathSoFar;
      break;
    }
    for(let i = 0; i < directionPoints.length; ++i) {
      let dPt = directionPoints[i];
      let nx = x + dPt.x;
      let ny = y + dPt.y;
      if(
        (nx < w && nx > -1)
        && (ny < h && ny > -1)
        && (grid[ny][nx] === gridEnum.safe)
        && visited[ny][nx] !== true
      ) {
        let nPos = new Point(nx, ny);
        let nSofar = [ ...pathSoFar, pos ];
        visited[ny][nx] = true;
        queue.push({
          pos: nPos,
          pathSoFar: nSofar,
        });
      }
    }
    // console.log('queue.head');
    // console.log(queue.head);
    // console.log('queue.tail');
    // console.log(queue.tail);
    // console.log('');
    // if(queue.head.next === queue.head) {
    //   break;
    // }
  }
  return foundPath;
}

function makeGrid(coords, w, h, n) {
  let grid = Array(h).fill(0).map(() => {
    return Array(w).fill(0).map(() => 0);
  });
  for(let i = 0; i < n; ++i) {
    let coord = coords[i];
    grid[coord.y][coord.x] = 2;
  }
  return grid;
}

function printGrid(srcGrid, foundPath) {
  foundPath = foundPath ?? [];
  let grid = [];
  for(let y = 0; y < srcGrid.length; ++y) {
    grid.push([]);
    for(let x = 0; x < srcGrid[y].length; ++x) {
      let val = srcGrid[y][x];
      let c = gridCharMap[val];
      grid[y].push(c);
    }
  }

  for(let i = 0; i < foundPath.length; ++i) {
    let coord = foundPath[i];
    grid[coord.y][coord.x] = 'O';
  }
  let gridStr = '';
  for(let y = 0; y < grid.length; ++y) {
    for(let x = 0; x < grid[y].length; ++x) {
      gridStr += grid[y][x];
    }
    gridStr += '\n';
  }
  return gridStr;
}

function parseInput(inputLines) {
  let maxX = -Infinity;
  let maxY = -Infinity;
  let coords = [];
  for(let i = 0; i < inputLines.length; ++i) {
    let inputLine = inputLines[i];
    let rx = /(?<left>[0-9]+),(?<right>[0-9]+)/;
    let rxExecRes = rx.exec(inputLine);
    let left = +rxExecRes?.groups?.left;
    let right = +rxExecRes?.groups?.right;
    if(left > maxX) {
      maxX = left;
    }
    if(right > maxY) {
      maxY = right;
    }
    let point = new Point(left, right);
    coords.push(point);
  }
  let res = {
    coords,
    maxX,
    maxY,
  };
  return res;
}
