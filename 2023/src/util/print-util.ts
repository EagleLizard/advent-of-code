
import chalk from 'chalk';

import { RunDayPartResult, RunDayResult } from '../run-aoc';
import { getIntuitiveTime, getIntuitiveTimeString } from './format-util';

export function getDayDivider(repeatN?: number) {
  let repeatVal = repeatN ?? 10;
  return `${'🎄~'.repeat(repeatVal)}🎄`;
}

export function printDayResult(dayResult: RunDayResult) {
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
    // `\n${getDayDivider(5)}\n`,
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
