
import { gridUtil } from '../../lib/geom/grid-util';
import { Point } from '../../lib/geom/point';
import { AocDayDef } from '../../models/aoc-day-def';

type Day7Input = {
  grid: TachyonGridTile[][];
  startPos: Point;
} & {};

// const DAY_7_FILE_NAME = 'day7-test1.txt';
const DAY_7_FILE_NAME = 'day7.txt';

const tile_enum = {
  empty: 0,
  start: 1,
  splitter: 2,
  beam: 3,
} as const;
const tachyon_grid_tile_map = {
  'S': tile_enum.start,
  '.': tile_enum.empty,
  '^': tile_enum.splitter,
  '|': tile_enum.beam,
} as const;
type TachyonGridKey = keyof typeof tachyon_grid_tile_map;
type TachyonGridTile = typeof tachyon_grid_tile_map[keyof typeof tachyon_grid_tile_map];
const tachyon_grid_tile_key_map = {
  0: '.',
  1: 'S',
  2: '^',
  3: '|',
} as const satisfies Record<TachyonGridTile, TachyonGridKey>;

export const day7 = {
  dayNum: 7,
  file_name: DAY_7_FILE_NAME,

  part1: day7Pt1,
} as const satisfies AocDayDef;

/*
  1592 - correct
_*/
function day7Pt1(inputLines: string[]): number {
  let day7Input: Day7Input = parseInput(inputLines);
  let grid = day7Input.grid;
  let startPos = day7Input.startPos;
  let numSplits: number;
  // printGrid(grid, true);
  numSplits = shootBeam(grid, startPos);
  return numSplits;
}

function shootBeam(grid: TachyonGridTile[][], sPos: Point): number {
  /*
    Starting from the position of the start S := (sx,sy):
      Create a list of beams, initialized with (sx,sy)
    set y = sy + 1
    for each beam in beams:
      1 if grid[by][bx] is empty, set by := by + 1
      2. if grid[by][bx] is a splitter, remove the beam
        from the list of beams
        2.1. Insert 2 new beams at (bx-1, by), (bx+1,by)
  _*/
  grid = gridUtil.copy(grid);
  let splitCount = 0;
  /* initialize beams _*/
  let beams: Point[] = [ Point.copy(sPos) ];
  for(let y = sPos.y + 1; y < grid.length; y++) {
    let nextBeams: Point[] = [];
    for(let bi = 0; bi < beams.length; bi++) {
      let beam = beams[bi];
      let beamAdv = grid[y][beam.x];
      if(beamAdv === tachyon_grid_tile_map['^']) {
        /* split the beam */
        let b1 = new Point(beam.x - 1, beam.y + 1);
        let b2 = new Point(beam.x + 1, beam.y + 1);
        if(!hasBeam(nextBeams, b1.x)) {
          nextBeams.push(b1);
        }
        if(!hasBeam(nextBeams, b2.x)) {
          nextBeams.push(b2);
        }
        splitCount++;
      } else {
        if(!hasBeam(nextBeams, beam.x)) {
          beam.y++;
          nextBeams.push(beam);
        }
      }
    }
    beams = nextBeams;
    for(let i = 0; i < beams.length; i++) {
      let beam = beams[i];
      let bx = beam.x;
      let by = beam.y;
      if(grid[by][bx] === tachyon_grid_tile_map['.']) {
        grid[by][bx] = tachyon_grid_tile_map['|'];
      }
    }
    // console.log(nextBeams);
    // if(y > 7) {
    //   console.log(beams);
    //   break;
    // }
  }
  // printGrid(grid, true);
  return splitCount;

  function hasBeam(beams: Point[], x: number): boolean {
    return beams.findIndex((b) => b.x === x) !== -1;
  }
}

function printGrid(grid: TachyonGridTile[][], pretty = false) {
  let rowLen = grid[0].length;
  process.stdout.write('\n');
  for(let y = 0; y < grid.length; y++) {
    for(let x = 0; x < rowLen; x++) {
      let val = grid[y][x];
      let c = pretty ? tachyon_grid_tile_key_map[val] : `${val}`;
      process.stdout.write(c);
    }
    process.stdout.write('\n');
  }
}

function parseInput(inputLines: string[]): Day7Input {
  let day7Input: Day7Input;
  let sPos: Point | undefined;
  let grid: TachyonGridTile[][] = [];
  for(let i = 0; i < inputLines.length; i++) {
    let inputLine = inputLines[i];
    let row: TachyonGridTile[] = [];
    for(let k = 0; k < inputLine.length; k++) {
      let c = inputLine[k];
      let tachyTile: TachyonGridTile;
      switch(c) {
        case 'S':
        case '.':
        case '^':
          tachyTile = tachyon_grid_tile_map[c];
          if(c === 'S') {
            sPos = new Point(k, i);
          }
          break;
        default:
          throw new Error(`Invalid tile at ${i}:${k}: ${c}`);
      }
      row.push(tachyTile);
    }
    grid.push(row);
  }
  if(sPos === undefined) {
    throw new Error('No start tile found');
  }
  day7Input = {
    grid: grid,
    startPos: sPos,
  };
  return day7Input;
}
