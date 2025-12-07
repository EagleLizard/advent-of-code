
import { AocDayDef } from '../../models/aoc-day-def';

type Day2Input = {
  idRanges: [ start: number, end: number ][];
} & {};

// const DAY_2_FILE_NAME = 'day2-test1.txt';
const DAY_2_FILE_NAME = 'day2.txt';

export const day2 = {
  dayNum: 2,
  file_name: DAY_2_FILE_NAME,
  part1: day2Pt1,
  part2: day2Pt2,
} as const satisfies AocDayDef;

/*
  85513235135 - correct
_*/
function day2Pt2(inputLines: string[]): number {
  let day2Input = parseInput(inputLines);
  let idRanges = day2Input.idRanges;
  let totalInvalidSum = 0;
  for(let i = 0; i < idRanges.length; i++) {
    let idRange = idRanges[i];
    let invalidIds: number[];
    let invalidSum: number;
    invalidSum = 0;
    // console.log(`[ ${idRange.join('-')} ]`);
    invalidIds = findInvalidIds2(...idRange);
    invalidSum = invalidIds.reduce((acc, curr) => {
      return acc + curr;
    }, 0);
    totalInvalidSum += invalidSum;
  }

  return totalInvalidSum;
}

/*
  64215794229 - correct
_*/
function day2Pt1(inputLines: string[]): number {
  let day2Input = parseInput(inputLines);
  let idRanges = day2Input.idRanges;
  let totalInvalidSum = 0;
  for(let i = 0; i < idRanges.length; i++) {
    let idRange = idRanges[i];
    let invalidIds: number[];
    let invalidSum: number;
    invalidSum = 0;
    // console.log(`[ ${idRange.join('-')} ]`);
    invalidIds = findInvalidIds(...idRange);
    invalidSum = invalidIds.reduce((acc, curr) => {
      return acc + curr;
    }, 0);
    totalInvalidSum += invalidSum;
  }

  return totalInvalidSum;
}

function findInvalidIds2(startId: number, endId: number): number[] {
  let invalidIds: number[];
  let currId: number;
  invalidIds = [];
  currId = startId;
  while(currId <= endId) {
    let validId = checkProductId2(currId);
    if(!validId) {
      invalidIds.push(currId);
    }
    currId++;
  }
  return invalidIds;
}

function checkProductId2(id: number): boolean {
  /*
  A product ID is invalid if it:
    1. is only made up of a sequence of digits that repeats at least twice
  _*/
  let digits = `${id}`;
  /*
    The sequence will always occur once at the start if invalid.
    1) start with the smallest possible sequence, length 1
    2) check if the rest of the string is only made of that seq
    3) if not, start again and increment length by 1
      Only do this up until digits.length/2
  _*/
  let seqLen = 1;
  let allEq = true;
  // console.log(digits);
  while(seqLen <= Math.floor(digits.length/2)) {
    let seq = digits.substring(0, seqLen);
    for(let i = seqLen; i < digits.length; i += seqLen) {
      let currSub = digits.substring(i, i + seqLen);
      if(currSub !== seq) {
        allEq = false;
        break;
      }
      allEq = true;
    }
    if(allEq) {
      return false;
    }
    seqLen++;
  }
  return true;
}

function findInvalidIds(startId: number, endId: number): number[] {
  let invalidIds: number[];
  let currId: number;
  invalidIds = [];
  currId = startId;
  while(currId <= endId) {
    let validId = checkProductId(currId);
    if(!validId) {
      invalidIds.push(currId);
    }
    currId++;
  }
  return invalidIds;
}

function checkProductId(id: number): boolean {
  /*
  A product ID is invalid if it is made up of:
    1. a sequence of digits the repeats twice
    2. where the sequence does not start with 0
  _*/
  let idStr = `${id}`;
  if(idStr.length % 2 !== 0) {
    return true;
  }
  let mid = idStr.length/2;
  let firstHalf = idStr.substring(0, mid);
  let lastHalf = idStr.substring(mid, idStr.length);
  if(firstHalf[0] === '0') {
    return true;
  }
  if(firstHalf === lastHalf) {
    return false;
  }
  return true;
}

function parseInput(inputLines: string[]): Day2Input {
  let day2Input: Day2Input;
  let idRanges: Day2Input['idRanges'];
  idRanges = [];
  for(let i = 0; i < inputLines.length; i++) {
    let inputLine = inputLines[i];
    let rawRanges = inputLine.split(',');
    for(let k = 0; k < rawRanges.length; k++) {
      let rawRange = rawRanges[k];
      let [ rawStart, rawEnd ] = rawRange.split('-');
      let startId = +rawStart;
      let endId = +rawEnd;
      if(isNaN(startId) || isNaN(endId)) {
        throw new Error(`Invalid input: ${rawRange}`);
      }
      idRanges.push([ startId, endId ]);
    }
  }
  day2Input = {
    idRanges: idRanges
  };
  return day2Input;
}
