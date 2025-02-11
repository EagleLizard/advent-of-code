
const files = require('./lib/files');

const day1 = require('./day1/day1');
const day7 = require('./day7/day7-main');

const NS_IN_MS = 1e6;

// const DAY_1_FILE_NAME = 'day1_test1.txt';
const DAY_1_FILE_NAME = 'day1.txt';
// const DAY_7_FILE_NAME = 'day7_test.txt';
const DAY_7_FILE_NAME = 'day7.txt';

const dayArgsArr = [
  [ 1, DAY_1_FILE_NAME, day1.day1Pt1, day1.day1Pt2 ],
  [ 7, DAY_7_FILE_NAME, day7.day7Part1, day7.day7Part2 ],
].map(dayArgsTuple => {
  let [ day, inputFileName, part1Fn, part2Fn ] = dayArgsTuple;
  return {
    day,
    inputFileName,
    part1Fn,
    part2Fn,
  };
});

(async () => {
  try {
    await main();
  } catch(e) {
    console.error(e);
    throw e;
  }
})();

async function main() {
  console.log('aoc 2024');
  for(let i = 0; i < dayArgsArr.length; ++i) {
    let currDayArgs = dayArgsArr[i];
    let lines = files.getInputLines(currDayArgs.inputFileName);
    let start;
    let end;
    let partMs;
    console.log(`Day ${currDayArgs.day}`);
    if(currDayArgs.part1Fn !== undefined) {
      start = process.hrtime.bigint();
      let pt1Res = currDayArgs.part1Fn(lines);
      end = process.hrtime.bigint();
      partMs = Number(end - start) / NS_IN_MS;
      console.log(`Part 1: ${pt1Res} | ${partMs} ms`);
    }
    if(currDayArgs.part2Fn !== undefined) {
      start = process.hrtime.bigint();
      let pt2Res = currDayArgs.part2Fn(lines);
      end = process.hrtime.bigint();
      partMs = Number(end - start) / NS_IN_MS;
      console.log(`Part 2: ${pt2Res} | ${partMs} ms`);
    }
  }
}
