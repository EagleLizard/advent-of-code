import { AocDayDef } from '../../models/aoc-day-def';

type DialInst = {
  dir: 'L' | 'R';
  clicks: number;
}

// const DAY_1_FILE_NAME = 'day1-test1.txt';
const DAY_1_FILE_NAME = 'day1.txt';

export const day1 = {
  dayNum: 1,
  file_name: DAY_1_FILE_NAME,
  part1: day1Pt1,
  part2: day1Pt2,
} as const satisfies AocDayDef;

class SafeDial {
  private _dialPos = 50;
  private _zeroClicks = 0;
  turn(dir: 'L' | 'R', clicks: number): number {
    let dirVal: number = dir === 'R' ? 1 : -1;
    while(clicks > 0) {
      if(this._dialPos === 0) {
        this._zeroClicks++;
      }
      this._dialPos += dirVal;
      if(this._dialPos === -1 && dir === 'L') {
        this._dialPos = 99;
      } else if(this._dialPos === 100 && dir === 'R') {
        this._dialPos = 0;
      }
      clicks--;
    }
    return this._dialPos;
  }
  getZeroClicks(): number {
    return this._zeroClicks;
  }
}

/*
  6858 - correct
_*/
function day1Pt2(inputLines: string[]): number {
  let day1Input: DialInst[] = parseInput(inputLines);
  let safeDial: SafeDial = new SafeDial();
  for(let i = 0; i < day1Input.length; i++) {
    let dialInst = day1Input[i];
    safeDial.turn(dialInst.dir, dialInst.clicks);
  }
  return safeDial.getZeroClicks();
}

/*
  1191 - correct
_*/
function day1Pt1(inputLines: string[]): number {
  let day1Input: DialInst[] = parseInput(inputLines);
  let safeDial: SafeDial = new SafeDial();
  let zeroCount = 0;
  for(let i = 0; i < day1Input.length; i++) {
    let dialInst = day1Input[i];
    // console.log(dialInst);
    let dialPos = safeDial.turn(dialInst.dir, dialInst.clicks);
    // console.log(dialPos);
    if(dialPos === 0) {
      zeroCount++;
    }
  }
  return zeroCount;
}

function parseInput(inputLines: string[]): DialInst[] {
  let day1Input: DialInst[];
  day1Input = [];
  for(let i = 0; i < inputLines.length; i++) {
    let dialInst: DialInst;
    let rawDir: string | undefined;
    let dialDir: DialInst['dir'];
    let rawClicks: string;
    let clicks: number;
    let inputLine = inputLines[i];
    rawDir = inputLine[0];
    if(!(rawDir === 'L' || rawDir === 'R')) {
      throw new Error(`Invalid dial rotation input: ${inputLine}`);
    }
    dialDir = rawDir;
    rawClicks = inputLine.substring(1);
    clicks = +rawClicks;
    if(isNaN(clicks)) {
      throw new Error(`Invalid dial clicks input: ${inputLine}`);
    }
    dialInst = {
      dir: dialDir,
      clicks: clicks,
    };
    day1Input.push(dialInst);
  }
  return day1Input;
}
