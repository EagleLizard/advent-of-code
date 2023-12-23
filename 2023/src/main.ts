
import sourceMapSupport from 'source-map-support';
sourceMapSupport.install();

import { day1, day1p2 } from './day1/day1';
import { day3Main } from './day3/day3';
import { getDayDivider } from './util/print-util';
import { day9Main } from './day9/day9-main';
import { Timer } from './util/timer';
import { getIntuitiveTimeString } from './util/format-util';
import { printDayBanner } from './util/print-util';
import { day10Main } from './day10/day10-main';

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
  await runFnAndTime(async () => {
    await day1();
    await day1p2();
  }, 1);

  await runFnAndTime(async () => {
    await day3Main();
  }, 3);

  await runFnAndTime(async () => {
    await day9Main();
  }, 9);

  await runFnAndTime(async () => {
    await day10Main();
  }, 10);

}

async function runFnAndTime(fn: () => Promise<void>, dayNumber: number) {
  let fnTimer = Timer.start();
  console.log(`\n${getDayDivider(5)}\n`);
  printDayBanner(dayNumber);
  await fn();
  let fnTimeMs = fnTimer.stop();
  let fnTimeStr = getIntuitiveTimeString(fnTimeMs);
  console.log(`\n${'-'.repeat(fnTimeStr.length)}\n${fnTimeStr}`);
}
