
const files = require('./lib/files');

const day1 = require('./day1/day1');

const DAY_1_FILE_NAME = 'day1_test1.txt';
// const DAY_1_FILE_NAME = "day1.txt";

const dayArgsArr = [
  [1, DAY_1_FILE_NAME, day1.day1Pt1, undefined],
];

(async () => {
  try {
    await main();
  } catch(e) {
    console.error(e);
    throw e;
  }
})();

async function main() {
  console.log("aoc 2024");
  for(let i = 0; i < dayArgsArr.length; ++i) {
    let currDayArgs = dayArgsArr[i];
    let lines = files.getInputLines(currDayArgs[1]);
    console.log(`Day ${currDayArgs[0]}`);
    if(currDayArgs[2] !== undefined) {
      let pt1Res = currDayArgs[2](lines);
      console.log(`Part 1: ${pt1Res}`);
    }

  }
}
