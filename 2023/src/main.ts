
import sourceMapSupport from 'source-map-support';
sourceMapSupport.install();

import { getDayDivider, printDayResult } from './util/print-util';

import { day1p1, day1p2 } from './day1/day1-main';
import { day3Part1, day3Part2 } from './day3/day3-main';
import { day9Part1, day9Part2 } from './day9/day9-main';
import { day10Part1 } from './day10/day10-main';

import {
  DAY1_INPUT_FILE_NAME,
  DAY2_INPUT_FILE_NAME,
  DAY3_INPUT_FILE_NAME,
  DAY9_INPUT_FILE_NAME,
  DAY10_INPUT_FILE_NAME,
} from './constants';
import { RunDayResult, runDay } from './run-aoc';
import { day2p1, day2p2 } from './day2/day2-main';
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
    dayNum: 2,
    inputFileName: DAY2_INPUT_FILE_NAME,
    part1Fn: day2p1,
    part2Fn: day2p2,
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
