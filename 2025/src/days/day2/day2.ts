
type Day2Input = {
  idRanges: [ start: number, end: number ][];
} & {};

// const DAY_2_FILE_NAME = 'day2-test1.txt';
const DAY_2_FILE_NAME = 'day2.txt';

export const day2 = {
  DAY_2_FILE_NAME: DAY_2_FILE_NAME,
  day2Pt1: day2Pt1
} as const;

/*
  64215794229 - correct
_*/
function day2Pt1(inputLines: string[]) {
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
