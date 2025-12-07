
import { AocDayDef } from '../../models/aoc-day-def';

type Worksheet = {
  nums: number[];
  op: '*' | '+';
} & {};

// const file_name = 'day6-test1.txt';
const file_name = 'day6.txt';

export const day6 = {
  dayNum: 6,
  file_name,
  part1: day6Pt1,
  part2: day6Pt2,
} as const satisfies AocDayDef;

/*
  8486156119946 - correct
_*/
function day6Pt2(inputLines: string[]): number {
  let worksheets = parseInput2(inputLines);
  let resSum = 0;
  for(let i = 0; i < worksheets.length; i++) {
    resSum += getWorksheetResult(worksheets[i]);
  }
  return resSum;
}

/*
  4951502530386 - correct
_*/
function day6Pt1(inputLines: string[]): number {
  let worksheets = parseInput(inputLines);
  let resSum = 0;
  for(let i = 0; i < worksheets.length; i++) {
    resSum += getWorksheetResult(worksheets[i]);
  }
  return resSum;
}

function getWorksheetResult(worksheet: Worksheet): number {
  return worksheet.op === '*'
    ? multWorksheet(worksheet.nums)
    : addWorksheet(worksheet.nums)
  ;
  function addWorksheet(nums: number[]): number {
    let sum = 0;
    for(let i = 0; i < nums.length; i++) {
      sum += nums[i];
    }
    return sum;
  }
  function multWorksheet(nums: number[]): number {
    let res = nums[0];
    for(let i = 1; i < nums.length; i++) {
      res *= nums[i];
    }
    return res;
  }
}

function parseInput2(inputLines: string[]): Worksheet[] {
  /*
    problems are written right-to-left in columns
      The most significant digit at the top
      so:
        12 1
        3  23
        +  +
      parsed as:
        3, 12
        2, 13
    Parse similarly as columns, starting at the end and bottom.
  _*/
  let rowLen = inputLines[0].length;
  let len = inputLines.length;
  let worksheets: Worksheet[] = [];
  let nums: number[] = [];
  for(let i = 0; i < rowLen; i++) {
    let op: Worksheet['op'] | undefined;
    let num: number;
    let x = rowLen - i - 1;
    let numStr = '';
    for(let k = 0; k < len; k++) {
      let c = inputLines[k][x];
      if(k === len - 1 && c !== ' ') {
        /* end of worksheet, should be op _*/
        if(!(c === '*' || c === '+')) {
          throw new Error(`Invalid op at ${x},${k}: ${c}`);
        }
        op = c;
      } else if(c !== ' ') {
        numStr += c;
      }
    }
    if(numStr.length > 0) {
      num = +numStr;
      if(isNaN(num)) {
        throw new Error(`Invalid number ${numStr} at col ${i}`);
      }
      nums.push(num);
      numStr = '';
    }
    if(op !== undefined) {
      let worksheet: Worksheet = {
        nums: nums,
        op: op,
      };
      worksheets.push(worksheet);
      nums = [];
      op = undefined;
    }
  }
  return worksheets;
}

function parseInput(inputLines: string[]): Worksheet[] {
  let worksheets: Worksheet[] = [];
  let rawRows: string[][] = [];
  for(let i = 0; i < inputLines.length; i++) {
    let inputLine = inputLines[i];
    let rx = /\S+/g;
    let rxIt = inputLine.matchAll(rx);
    let rxItRes: IteratorResult<RegExpExecArray>;
    let rawRow: string[] = [];
    while(!(rxItRes = rxIt.next()).done) {
      rawRow.push(rxItRes.value[0]);
    }
    rawRows.push(rawRow);
  }
  let rowLen = rawRows[0].length;
  for(let i = 0; i < rowLen; i++) {
    let op: Worksheet['op'] | undefined;
    let nums: number[] = [];
    for(let k = 0; k < rawRows.length; k++) {
      let rawVal: string = rawRows[k][i];
      if(k === rawRows.length - 1) {
        if(!(rawVal === '*' || rawVal === '+')) {
          throw new Error(`Invalid op in col ${i}: ${rawVal}`);
        }
        op = rawVal;
      } else {
        let num = +rawVal;
        if(isNaN(num)) {
          throw new Error(`Invalid num in col ${i}: ${rawVal}`);
        }
        nums.push(num);
      }
    }
    if(op === undefined) {
      throw new Error(`op is undefined in col ${i} for nums: ${nums.join(', ')}`);
    }
    let worksheet: Worksheet = {
      nums: nums,
      op: op,
    };
    worksheets.push(worksheet);
  }
  return worksheets;
}
