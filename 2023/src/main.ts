
import sourceMapSupport from 'source-map-support';
sourceMapSupport.install();

import { day1, day2p2 } from './day1/day1';

(async () => {
  try {
    await main();
  } catch(e) {
    console.error(e);
    throw e;
  }
})();

async function main() {
  console.log('EagleLizard - Advent of Code [Typescript]');
  await day1();
  await day2p2();
}
