
import { AocDay } from '../../models/aoc-day';

type FreshRange = [number, number] & {};
type Day5Input = {
  freshRanges: FreshRange[];
  availableIds: number[];
} & {};

// const file_name = 'day5-test1.txt';
// const file_name = 'day5-test2.txt';
const file_name = 'day5.txt';

export const day5 = {
  file_name: file_name,
  part1: day5Pt1,
  part2: day5Pt2,
} as const satisfies AocDay;

/*
  341753674214273 - correct
_*/
function day5Pt2(inputLines: string[]): number {
  let day5Input: Day5Input;
  let freshRanges: FreshRange[];
  let mergedRanges: FreshRange[];
  day5Input = parseInput(inputLines);
  freshRanges = day5Input.freshRanges;
  mergedRanges = combineRanges(freshRanges);
  let idCount = 0;
  for(let i = 0; i < mergedRanges.length; i++) {
    let [ s, e ] = mergedRanges[i];
    idCount += (e - s) + 1;
  }
  return idCount;
}

/*
  652 - correct
_*/
function day5Pt1(inputLines: string[]): number {
  let day5Input: Day5Input;
  let freshRanges: FreshRange[];
  let availableIds: number[];
  let mergedRanges: FreshRange[];
  day5Input = parseInput(inputLines);
  freshRanges = day5Input.freshRanges;
  availableIds = day5Input.availableIds;
  mergedRanges = combineRanges(freshRanges);
  let freshSum = 0;
  for(let i = 0; i < availableIds.length; i++) {
    if(checkFreshId(mergedRanges, availableIds[i])) {
      freshSum++;
    }
  }
  return freshSum;
}

function combineRanges(freshRanges: FreshRange[]): FreshRange[] {
  let toCheckRanges = freshRanges.slice();
  freshRanges = freshRanges.slice();
  for(let k = 0; k < toCheckRanges.length; k++) {
    let toCheck = toCheckRanges[k];
    let [ s1, e1 ] = toCheck;
    let nextRanges: FreshRange[] = [];
    let doMerge: boolean = false;
    let smin = Infinity;
    let emax = -Infinity;
    for(let i = 0; i < freshRanges.length; i++) {
      let [ s2, e2 ] = freshRanges[i];
      if(s1 <= e2 && e1 >= s2) {
        smin = Math.min(smin, s2);
        emax = Math.max(emax, e2);
        doMerge = true;
      } else {
        nextRanges.push([ s2, e2 ]);
      }
    }
    if(doMerge) {
      nextRanges.push([ smin, emax ]);
    }
    freshRanges = nextRanges;
  }
  return freshRanges;
}

function checkFreshId(freshRanges: FreshRange[], id: number): boolean {
  for(let i = 0; i < freshRanges.length; i++) {
    let [ s, e ] = freshRanges[i];
    if(id >= s && id <= e) {
      return true;
    }
  }
  return false;
}

function parseInput(inputLines: string[]): Day5Input {
  let day5Input: Day5Input;
  let freshRanges: FreshRange[] = [];
  let availableIds: number[] = [];
  let readFresh = true;
  let readAvail = false;
  for(let i = 0; i < inputLines.length; i++) {
    let range: FreshRange;
    let rawStart: string;
    let rawEnd: string;
    let start: number;
    let end: number;
    let availId: number;
    let inputLine = inputLines[i];
    if(readFresh && (inputLine !== '')) {
      [ rawStart, rawEnd ] = inputLine.split('-');
      start = +rawStart;
      end = +rawEnd;
      if(isNaN(start) || isNaN(end)) {
        throw new Error(`Invalid fresh input at ${i}: "${inputLine}"`);
      }
      range = [ start, end, ];
      freshRanges.push(range);
    }
    if(readAvail) {
      availId = +inputLine;
      if(isNaN(availId)) {
        throw new Error(`Invalid available id: ${inputLine}`);
      }
      availableIds.push(availId);
    }
    if(readFresh && inputLine === '') {
      readFresh = false;
      readAvail = true;
    }
  }
  day5Input = {
    freshRanges,
    availableIds,
  };
  return day5Input;
}
