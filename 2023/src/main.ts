
import sourceMapSupport from 'source-map-support';
sourceMapSupport.install();

import chalk from 'chalk';

import { getDayDivider } from './util/print-util';
import { Timer, runAndTime } from './util/timer';
import { getIntuitiveTime, getIntuitiveTimeString } from './util/format-util';
import { loadDayInput } from './util/input-util';

import { day1p1, day1p2 } from './day1/day1-main';
import { day3Part1, day3Part2 } from './day3/day3-main';
import { day9Part1, day9Part2 } from './day9/day9-main';
import { day10Part1 } from './day10/day10-main';

import { DAY10_INPUT_FILE_NAME, DAY1_INPUT_FILE_NAME, DAY3_INPUT_FILE_NAME, DAY9_INPUT_FILE_NAME } from './constants';
(async () => {
  try {
    await main();
  } catch(e) {
    console.error(e);
    throw e;
  }
})();

async function main() {
  console.log(`\n${getDayDivider(13)}\n`);
  console.log('EagleLizard - Advent of Code [Typescript]');
  console.log(`\n${getDayDivider(13)}\n`);

  let dayResult: RunDayResult;

  dayResult = await runDay({
    dayNum: 1,
    inputFileName: DAY1_INPUT_FILE_NAME,
    part1Fn: day1p1,
    part2Fn: day1p2,
  });

  printDayResult(dayResult);

  dayResult = await runDay({
    dayNum: 3,
    inputFileName: DAY3_INPUT_FILE_NAME,
    part1Fn: day3Part1,
    part2Fn: day3Part2,
  });

  printDayResult(dayResult);

  dayResult = await runDay({
    dayNum: 9,
    inputFileName: DAY9_INPUT_FILE_NAME,
    part1Fn: day9Part1,
    part2Fn: day9Part2,
  });

  printDayResult(dayResult);

  dayResult = await runDay({
    dayNum: 10,
    inputFileName: DAY10_INPUT_FILE_NAME,
    part1Fn: day10Part1,
  });

  printDayResult(dayResult);
}

function printDayResult(dayResult: RunDayResult) {
  let part1Str: string;
  let part2Str: string | undefined;
  let p1Len: number;
  let p2Len: number;
  let part1AlignmentPad: number;
  let part2AlignmentPad: number;
  let dayStr: string;
  let dayClr: string;
  let dayTimeStr: string;
  let dayTimeClr: string;
  let dayTextStr: string;
  let dayTextClr: string;
  let dayTotalDividerStr: string;
  let dayTotalTimeStr: string;

  let p1TimeTuple: [ number, string ];
  let p2TimeTuple: [ number, string ];
  let p1TimeLen: number;
  let p2TimeLen: number;
  let p1TimePad: number;
  let p2TimePad: number;

  let linesToPrint: string[];

  const fixedPoints = 2;

  const {
    dayNum,
    part1Result,
    part2Result,
    dayTime,
  } = dayResult;

  p1TimeTuple = getIntuitiveTime(part1Result.funTime);
  p1TimeLen = p1TimeTuple[0].toFixed(fixedPoints).length;
  p2TimeLen = 0;

  p1Len = `${part1Result.solutionVal}`.length;
  p2Len = 0;
  part1AlignmentPad = 0;
  p1TimePad = 0;

  if(part2Result !== undefined) {
    p2Len = `${part2Result.solutionVal}`.length;
    p2TimeTuple = getIntuitiveTime(part2Result.funTime);
    p2TimeLen = p2TimeTuple[0].toFixed(fixedPoints).length;
  }
  part1AlignmentPad = p1Len > p2Len
    ? 0
    : p2Len - p1Len
  ;
  part2AlignmentPad = p2Len > p1Len
    ? 0
    : p1Len - p2Len
  ;
  p1TimePad = p1TimeLen > p2TimeLen
    ? 0
    : p2TimeLen - p1TimeLen
  ;
  p2TimePad = p2TimeLen > p1TimeLen
    ? 0
    : p1TimeLen - p2TimeLen
  ;

  dayStr = `~ Day ${dayNum} ~`;
  part1Str = getDayPartStr(part1Result, part1AlignmentPad, p1TimePad, fixedPoints);
  if(part2Result !== undefined) {
    part2Str = getDayPartStr(part2Result, part2AlignmentPad, p2TimePad, fixedPoints);
  }
  dayTimeStr = getIntuitiveTimeString(dayTime);
  dayTextStr = 'total: ';
  dayTotalDividerStr = '-'.repeat(dayTimeStr.length + dayTextStr.length);

  dayClr = chalk.greenBright(
    dayStr
  );
  dayTimeClr = chalk.italic.cyan(
    dayTimeStr
  );
  // dayTextClr = chalk.italic.rgb(138, 118, 239)(dayTextStr);
  dayTextClr = chalk.italic.greenBright(dayTextStr);
  dayTotalTimeStr = `${dayTotalDividerStr}\n${dayTextClr}${dayTimeClr}`;

  linesToPrint = [
    `\n${getDayDivider(5)}\n`,
    `${dayClr}`,
    part1Str,
    part2Str ?? '',
    dayTotalTimeStr,
  ].filter(lineToPrint => {
    return lineToPrint.length > 0;
  });

  console.log(linesToPrint.join('\n'));
}

function getDayPartStr(
  dayPartResult: RunDayPartResult,
  solutionPad: number,
  timePad: number,
  fixedPoints: number,
) {
  let solutionStr: string;
  let solutionClr: string;
  let partTextStr: string;
  let partTextClr: string;
  let timeStr: string;
  let timeClr: string;

  let padStr: string;
  let timePadStr: string;
  let partStr: string;
  const {
    partNum,
    solutionVal,
    funTime,
  } = dayPartResult;

  partTextStr = `Part ${partNum}`;
  solutionStr =  `${solutionVal}`;
  timeStr = getIntuitiveTimeString(funTime, fixedPoints);
  padStr = solutionPad > 0
    ? ' '.repeat(solutionPad)
    : ''
  ;
  timePadStr = timePad > 0
    ? ' '.repeat(timePad)
    : ''
  ;
  partTextClr = chalk.greenBright(
    partTextStr
  );
  solutionClr = chalk.yellow(
    solutionStr
  );
  timeClr = chalk.cyan(
    timeStr
  );
  partStr = `${partTextClr}: ${solutionClr}${padStr} | ${timePadStr}${timeClr}`;
  return partStr;
}

type RunDayParams = {
  dayNum: number,
  inputFileName: string,
  part1Fn: (inputLines: string[]) => number,
  part2Fn?: (inputLines: string[]) => number,
};

type RunDayResult = {
  dayNum: number,
  part1Result: RunDayPartResult,
  part2Result?: RunDayPartResult,
  dayTime: number;
}

async function runDay(opts: RunDayParams): Promise<RunDayResult> {
  let dayResult: RunDayResult;
  let part1Result: RunDayPartResult;
  let part2Result: RunDayPartResult | undefined;
  let dayTimer: Timer;
  let dayTime: number;

  const {
    dayNum,
    inputFileName,
    part1Fn,
    part2Fn,
  } = opts;

  dayTimer = Timer.start();

  const inputLines = (await loadDayInput(inputFileName))
    .map(inputLine => inputLine.trim())
    .filter(inputLine => inputLine.length > 0)
  ;

  part1Result = await runDayPart({
    dayNum,
    partNum: 1,
    inputLines,
    fn: part1Fn,
  });

  if(part2Fn !== undefined) {
    part2Result = await runDayPart({
      dayNum,
      partNum: 2,
      inputLines,
      fn: part2Fn,
    });
  }

  dayTime = dayTimer.stop();

  dayResult = {
    dayNum,
    part1Result,
    part2Result,
    dayTime,
  };

  return dayResult;
}

type RunDayPartParams = {
  dayNum: number,
  partNum: number,
  inputLines: string[],
  fn: (inputLines: string[]) => number,
};
type RunDayPartResult = {
  dayNum: number,
  partNum: number,
  funTime: number,
  solutionVal: number,
}

async function runDayPart(opts: RunDayPartParams): Promise<RunDayPartResult> {
  let solutionVal: number | undefined;
  let dayPartResult: RunDayPartResult;
  const {
    dayNum,
    partNum,
    inputLines,
    fn,
  } = opts;
  let funTime = await runAndTime(() => {
    solutionVal = fn(inputLines);
  });
  if(solutionVal === undefined) {
    throw new Error(`Undefined solutionVal for Day ${dayNum} Part ${partNum}`);
  }
  dayPartResult = {
    dayNum,
    partNum,
    funTime,
    solutionVal,
  };
  return dayPartResult;
}
