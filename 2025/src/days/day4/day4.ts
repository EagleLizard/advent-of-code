import { aocConfig } from '../../lib/config';
import { Point } from '../../lib/geom/point';

// const DAY_4_FILE_NAME = 'day4-test1.txt';
const DAY_4_FILE_NAME = 'day4.txt';

// type TPGridTile = 0 | 1;
const tp_grid_tile_map = {
  '.': 0, // empty
  '@': 1, // TP roll
  'x': 2, // moved TP roll
  '#': 3, // visited TP roll
} as const;
type TPGridKey = keyof typeof tp_grid_tile_map;
type TPGridTile = typeof tp_grid_tile_map[keyof typeof tp_grid_tile_map];
const tp_grid_tile_key_map = {
  0: '.',
  1: '@',
  2: 'x',
  3: '#',
} as const satisfies Record<TPGridTile, TPGridKey>;
type Day4Input = {
  grid: TPGridTile[][];
} & {};

export const day4 = {
  DAY_4_FILE_NAME,
  day4Pt1: day4Pt1,
} as const;

/*
  1569 - correct
_*/
function day4Pt1(inputLines: string[]): number {
  let day4Input: Day4Input = parseInput(inputLines);
  let grid = day4Input.grid;
  // printGrid(grid);
  let numMovable = findMovableRolls(grid);
  return numMovable;
}

function findMovableRolls(grid: TPGridTile[][]) {
  let rowLen: number;
  let moveableCount = 0;
  // let gridCpy: TPGridTile[][] = copyGrid(grid);
  grid = copyGrid(grid);
  rowLen = grid[0].length;
  for(let y = 0; y < grid.length; y++) {
    for(let x = 0; x < rowLen; x++) {
      let moveableTp: boolean;
      moveableTp = checkMoveableRoll(grid, x, y);
      if(moveableTp) {
        moveableCount++;
      }
      // if(moveableTp) {
      //   gridCpy[y][x] = tp_grid_tile_map['x'];
      // }
    }
  }
  // console.log('');
  // printGrid(gridCpy);
  return moveableCount;
}
function checkMoveableRoll(grid: TPGridTile[][], x: number, y: number): boolean {
  let gridLen: number;
  let rowLen: number;
  if(grid[y][x] !== tp_grid_tile_map['@']) {
    return false;
  }
  gridLen = grid.length;
  rowLen = grid[0].length;
  let adjPts: Point[] = getAdjCoords(x, y).filter(adjPt => {
    return (
      (adjPt.x >= 0 && adjPt.x < rowLen)
      && (adjPt.y >= 0 && adjPt.y < gridLen)
    );
  });
  // dbgLog(`${x}, ${y}`);
  // dbgLog(
  //   adjPts.map(pt => `[${pt.x}, ${pt.y}]`).join(', ')
  // );
  let adjRolls = 0;
  for(let i = 0; i < adjPts.length; i++) {
    let adjPt = adjPts[i];
    if(grid[adjPt.y][adjPt.x] === tp_grid_tile_map['@']) {
      adjRolls++;
    }
    if(adjRolls > 3) {
      return false;
    }
  }
  return true;
}

function getAdjCoords(x: number, y: number): Point[] {
  let pts: Point[] = [];
  for(let iy = y - 1; iy <= y + 1; iy++) {
    for(let ix = x - 1; ix <= x + 1; ix++) {
      // if(ix === x && iy === y) continue;
      if(!(ix === x && iy === y)) {
        pts.push(new Point(ix, iy));
      }
    }
  }
  return pts;
}

function copyGrid<T>(srcGrid: T[][]): T[][] {
  let gridCpy: T[][] = [];
  let rowLen = srcGrid[0].length;
  for(let y = 0; y < srcGrid.length; y++) {
    let row = [];
    for(let x = 0; x < rowLen; x++) {
      row.push(srcGrid[y][x]);
    }
    gridCpy.push(row);
  }
  return gridCpy;
}

function dbgLog(message?: unknown, ...optionalParams: unknown[]) {
  if(!aocConfig.debug) {
    return;
  }
  console.log(message, optionalParams);
}

function printGrid(grid: TPGridTile[][], pretty = true) {
  if(!aocConfig.debug) {
    return;
  }
  for(let y = 0; y < grid.length; y++) {
    let row = grid[y];
    for(let x = 0; x < row.length; x++) {
      let c: string;
      c = pretty ? tp_grid_tile_key_map[row[x]] : `${row[x]}`;
      process.stdout.write(c);
    }
    process.stdout.write('\n');
  }
}

function parseInput(inputLines: string[]): Day4Input {
  let day4Input: Day4Input;
  let rows: TPGridTile[][] = [];
  for(let i = 0; i < inputLines.length; i++) {
    let inputLine = inputLines[i];
    let row: TPGridTile[] = [];
    for(let k = 0; k < inputLine.length; k++) {
      let c = inputLine[k];
      switch(c) {
        case '.':
          row.push(0);
          break;
        case '@':
          row.push(1);
          break;
        default:
          throw new Error(`Invalid char at col ${k}: ${inputLine}`);
      }
    }
    rows.push(row);
  }
  day4Input = {
    grid: rows,
  };
  return day4Input;
}
