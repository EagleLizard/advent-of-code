
import { Point } from '../../lib/geom/point';
import { AocDayDef } from '../../models/aoc-day-def';

const DAY_9_FILE_NAME = 'day9-test1.txt';
// const DAY_9_FILE_NAME = 'day9.txt';

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
  part2: day9Pt2,
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

/*
  2799916950 - too high
_*/
function day9Pt2(inputLines: string[]): number {
  /*
    similar to pt2, start by calculating max areas
    starting from the largest, see if any side of the rectangle
      intersects the line connecting any 2 points in the input
        - The intersection formula can be simplified because we know
          we are dealing with strictly vertical or horizontal lines.
  _*/
  let corners = parseInput(inputLines);
  let maxArea = -Infinity;
  for(let i = 0; i < corners.length - 1; i++) {
    let p1 = corners[i];
    for(let k = i + 1; k < corners.length; k++) {
      let p2 = corners[k];
      /*
        p1 and p2 have implied corners p3,p4:
          1----3
          |    |
          |    |
          4----2
        where:
          p3.x := p2.x
          p3.y := p1.y
          p4.x := p1.x
          p4.y := p2.y
        which creates 4 distinct lines
      _*/
      let p3 = new Point(p2.x, p1.y);
      let p4 = new Point(p1.x, p2.y);
      let hasIntersect: boolean = false;
      let lines: [Point, Point][] = [
        [ p1, p3 ],
        [ p3, p2 ],
        [ p4, p2 ],
        [ p1, p4 ],
      ];

      for(let j = 0; j < lines.length; j++) {
        let lineIntersect: [Point, Point] | undefined;
        let line = lines[j];
        lineIntersect = findIntersection(corners, line[0], line[1]);
        if(lineIntersect !== undefined) {
          // console.log('intersect:');
          // console.log(line);
          // console.log(lineIntersect);
          hasIntersect = true;
          break;
        }
      }
      if(!hasIntersect) {
        let w = Math.abs(p2.x - p1.x) + 1;
        let h = Math.abs(p2.y - p1.y) + 1;
        let a = w * h;
        if(a > maxArea) {
          maxArea = a;
        }
      }
    }
  }
  return maxArea;
}

function findIntersection(corners: Point[], p1: Point, p2: Point): [Point, Point] | undefined {
  /*
  Simplified to assume lines are either vertical or horizontal
    Intersections cannot occur between lines on the same axis in the same direction.
      - So two vertical lines on the same X do not intersect, e.g.:
        L1: (0,0), (0,10)
        L2: (0,5), (0,7)
    So an intersection is defined as lines, one vertical and one horizontal
  _*/
  let dir = (p1.x !== p2.x) ? 0 : 1; // 0 = horiz, 1 = vert
  // console.log('\n----');
  // console.log(`p1: ${p1.x},${p1.y}`);
  // console.log(`p2: ${p2.x},${p2.y}`);
  // console.log(dir);
  if(p1.x === p2.x && p1.y === p2.y) {
    /* points are equal, no use checking for collision _*/
    return undefined;
  }
  for(let i = 0; i < corners.length; i++) {
    let c1: Point;
    let c2: Point;
    c1 = corners[i];
    if(i === corners.length - 1) {
      /* connect last to first _*/
      c2 = corners[0];
    } else {
      c2 = corners[i + 1];
    }
    // console.log('');
    // console.log(c1);
    // console.log(c2);
    // console.log(`dx ${c1.x - c2.x}`);
    // console.log(`dy ${c1.y - c2.y}`);
    if(c2.y === c1.y) {
      // horizontal
      // console.log('horix');
      if(dir !== 0) {
        /*
          p - vert
          c - horiz
        _*/
        let px = p1.x;
        let cy = c1.y;
        let cx1 = Math.min(c1.x, c2.x);
        let cx2 = Math.max(c1.x, c2.x);
        let py1 = Math.min(p1.y, p2.y);
        let py2 = Math.max(p1.y, p2.y);
        if(
          (px > cx1 && px < cx2)
          && (py1 <= cy && py2 >= cy)
        ) {
          // console.log('collision');
          return [ c1, c2 ];
        }
      }
    } else if(c2.x === c1.x) {
      // vertical
      // console.log('vertical');
      if(dir !== 1) {
        let cx = c1.x;
        let py = p1.y;
        let px1 = Math.min(p1.x, p2.x);
        let px2 = Math.max(p1.x, p1.x);
        let cy1 = Math.min(c1.y, c2.y);
        let cy2 = Math.max(c1.y, c2.y);
        if(
          (cx > px1 && cx < px2)
          && (cy1 <= py && cy2 >= py)
        ) {
          // console.log('collision');
          return [ c1, c2 ];
        }
        // console.log('skip, input is vertical');
      }
    } else {
      // invalid
      throw new Error(`invalid line: (${c1.x},${c1.y}), (${c2.x},${c2.y})`);
    }
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
