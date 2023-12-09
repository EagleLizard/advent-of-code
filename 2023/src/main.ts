
import sourceMapSupport from 'source-map-support';
sourceMapSupport.install();

import { day1, day2p2 } from './day1/day1';
import { day3Main } from './day3/day3';
import { getDayDivider } from './util/divider';

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
  await day1();
  await day2p2();

  console.log(`\n${getDayDivider(5)}\n`);
  await day3Main();
}
