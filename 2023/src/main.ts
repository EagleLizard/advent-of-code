
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
  DAY4_TEST_INPUT_FILE_NAME,
} from './constants';
import { RunDayResult, runDay } from './run-aoc';
import { day2p1, day2p2 } from './day2/day2-main';
import { getCurrentDateTimeStr } from './util/date-time-util';
import { day4Part1 } from './day4/day4-main';

(async () => {
  try {
    await main();
  } catch(e) {
    console.error(e);
    throw e;
  }
})();

async function main() {
  console.log(getCurrentDateTimeStr());
  console.log(`\n${getDayDivider(13)}\n`);
  console.log('EagleLizard - Advent of Code [Typescript]');
  console.log(`\n${getDayDivider(13)}\n`);

  let dayResult: RunDayResult;

  dayResult = await runDay(1, DAY1_INPUT_FILE_NAME, day1p1, day1p2);
  printDayResult(dayResult);

  dayResult = await runDay(2, DAY2_INPUT_FILE_NAME, day2p1, day2p2);
  printDayResult(dayResult);

  dayResult = await runDay(3, DAY3_INPUT_FILE_NAME, day3Part1, day3Part2);
  printDayResult(dayResult);

  dayResult = await runDay(4, DAY4_TEST_INPUT_FILE_NAME, day4Part1);
  printDayResult(dayResult);

  dayResult = await runDay(9, DAY9_INPUT_FILE_NAME, day9Part1, day9Part2);
  printDayResult(dayResult);

  dayResult = await runDay(10, DAY10_INPUT_FILE_NAME, day10Part1);
  printDayResult(dayResult);
}
