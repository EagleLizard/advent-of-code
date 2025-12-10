
import { Point } from '../../lib/geom/point';
import { AocDayDef } from '../../models/aoc-day-def';

// const DAY_9_FILE_NAME = 'day9-test1.txt';
const DAY_9_FILE_NAME = 'day9.txt';

const theatre_grid_tile_map = {
  '.': 0, // empty
  '#': 1, // corner (red)
} as const;
type TheatreGridKey = keyof typeof theatre_grid_tile_map;
type TheatreGridTile = typeof theatre_grid_tile_map[keyof typeof theatre_grid_tile_map];
const theatre_grid_tile_key_map = {
  0: '.',
  1: '#',
} as const satisfies Record<TheatreGridTile, TheatreGridKey>;

export const day9 = {
  dayNum: 9,
  file_name: DAY_9_FILE_NAME,
  part1: day9Pt1,
} as const satisfies AocDayDef;

/*
  4756718172 - correct
_*/
function day9Pt1(inputLines: string[]): number {
  let corners = parseInput(inputLines);
  // console.log(corners);
  let maxArea = -Infinity;
  for(let i = 0; i < corners.length - 1; i++) {
    let p1 = corners[i];
    for(let k = i + 1; k < corners.length; k++) {
      let p2 = corners[k];
      let w = Math.abs(p2.x - p1.x) + 1;
      let h = Math.abs(p2.y - p1.y) + 1;
      let a = w * h;
      if(a > maxArea) {
        maxArea = a;
      }
    }
  }
  return maxArea;
}

function printGrid(grid: TheatreGridTile[][], pretty = true) {
  process.stdout.write('\n');
  for(let y = 0; y < grid.length; y++) {
    for(let x = 0; x < grid[y].length; x++) {
      let val = grid[y][x];
      let c = (pretty) ? theatre_grid_tile_key_map[val] : `${val}`;
      process.stdout.write(c);
    }
    process.stdout.write('\n');
  }
}

function parseInput(inputLines: string[]): Point[] {
  let corners: Point[] = [];
  for(let i = 0; i < inputLines.length; i++) {
    let inputLine = inputLines[i];
    let [ rawX, rawY ] = inputLine.split(',');
    let x = +rawX;
    let y = +rawY;
    if(isNaN(x) || isNaN(y)) {
      throw new Error(`Invalid input: ${inputLine}`);
    }
    let corner = new Point(x, y);
    corners.push(corner);
  }
  return corners;
}
