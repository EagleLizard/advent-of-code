
type BatteryBank = {
  batteries: number[];
} & {};

// const DAY_3_FILE_NAME = 'day3-test1.txt';
const DAY_3_FILE_NAME = 'day3.txt';

export const day3 = {
  DAY_3_FILE_NAME,

  day3pt1: day3Pt1,
  day3pt2: day3Pt2,
} as const;

/*
  175659236361660 - correct
_*/
function day3Pt2(inputLines: string[]): number {
  let batteryBanks: BatteryBank[] = parseInput(inputLines);
  let joltageSum = 0;
  for(let i = 0; i < batteryBanks.length; i++) {
    let batteryBank = batteryBanks[i];
    let highestJoltage = getHighestJoltageN(batteryBank.batteries, 12);
    joltageSum += highestJoltage;
  }
  return joltageSum;
}

/*
  17694 - correct
_*/
function day3Pt1(inputLines: string[]): number {
  let batteryBanks: BatteryBank[] = parseInput(inputLines);
  let joltageSum: number = 0;
  for(let i = 0; i < batteryBanks.length; i++) {
    let batteryBank = batteryBanks[i];
    let highestJoltage = getHighestJoltage(batteryBank.batteries);
    joltageSum += highestJoltage;
  }
  return joltageSum;
}

function getHighestJoltageN(batteries: number[], nb: number): number {
  /*
    Same strategy as p1 but generalized:
      where:
        bidcs = array of found batteries so far
        cbi = current battery index
        lbi = last battery index
      1. set lbi := -1
      2. find cbi where batteries[cbi] is the maximum between (lbi, len - (nb - 1))
      3. push cbi onto bidcs
      4. set lbi := cbi
      5. set nb := nb - 1
  _*/
  let bIdcs: number[] = [];
  let lbi = -1;
  while(nb > 0) {
    let cbi = lbi + 1;
    /*
      nb - 1 because we want to search the portion of the array for
        the current match, and the remainder of the array after the end
        has to be at least the number of batteries we need to find AFTER
        we find the current match
    _*/
    let endIdx = batteries.length - (nb - 1);
    for(let i = lbi + 1; i < endIdx; i++) {
      let battery = batteries[i];
      if(battery > batteries[cbi]) {
        cbi = i;
      }
    }
    bIdcs.push(cbi);
    lbi = cbi;
    nb--;
  }
  let resJoltage = 0;
  for(let i = 0; i < bIdcs.length; i++) {
    let currJolt = batteries[bIdcs[i]];
    let pow = bIdcs.length - i - 1;
    resJoltage += currJolt * (10**pow);
  }
  return resJoltage;
}

function getHighestJoltage(batteries: number[]): number {
  /*
    Highest joltage is the 2 batteries that have the highest value
      then combined as digits in order.
    Can find by:
      1. find first index of the highest value from [0, len-1)
      2. find second index by finding the highest index from [startIdx, len-1]
  _*/
  let firstIdx: number = 0;
  let secondIdx: number;
  for(let i = 0; i < batteries.length - 1; i++) {
    let battery = batteries[i];
    if(battery > batteries[firstIdx]) {
      firstIdx = i;
    }
  }
  secondIdx = firstIdx + 1;
  for(let i = firstIdx + 1; i < batteries.length; i++) {
    let battery = batteries[i];
    if(battery > batteries[secondIdx]) {
      secondIdx = i;
    }
  }
  // console.log([batteries[firstIdx], batteries[secondIdx]].join(''));
  return (batteries[firstIdx] * 10) + batteries[secondIdx];
}

function parseInput(inputLines: string[]): BatteryBank[] {
  let batteryBanks: BatteryBank[] = [];
  for(let i = 0; i < inputLines.length; i++) {
    let inputLine = inputLines[i];
    let batteryBank: BatteryBank;
    let batteries: number[] = [];
    // if(!/^[0-9]+$/.test(inputLine)) {
    //   throw new Error(`Invalid input: ${inputLine}`);
    // }
    for(let k = 0; k < inputLine.length; k++) {
      let c = inputLine[k];
      let n = +c;
      if(isNaN(n)) {
        throw new Error(`Invalid input at index ${k}: ${inputLine}`);
      }
      batteries.push(n);
    }
    batteryBank = {
      batteries: batteries,
    };
    batteryBanks.push(batteryBank);
  }
  return batteryBanks;
}
