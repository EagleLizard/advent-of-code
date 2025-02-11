
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
    runDay(currDayArgs.day, currDayArgs.inputFileName, currDayArgs.part1Fn, currDayArgs.part2Fn);
  }
}

function runDay(day, inputFileName, part1Fn, part2Fn) {
  let dayBanner = `~ Day ${day} ~`;
  let inputLines = files.getInputLines(inputFileName);
  let ptRes;
  process.stdout.write(`${dayBanner}\n`);
  let totalStart = process.hrtime.bigint();
  if(part1Fn !== undefined) {
    ptRes = runPart(1, inputLines, part1Fn);
    printPart(ptRes);
  }
  if(part2Fn !== undefined) {
    ptRes = runPart(2, inputLines, part2Fn);
    printPart(ptRes);
  }
  let totalEnd = process.hrtime.bigint();
  let totalMs = Number(totalEnd - totalStart) / NS_IN_MS;
  let divWidth = 6;
  let divStr = '-'.repeat(divWidth);
  let totalTxt = 'total';
  let totalStr = `${totalTxt}: ${totalMs} ms`;
  process.stdout.write(`${totalStr}\n${divStr}\n`);
}

function printPart(partRes) {
  let partMs = partRes.elapsedNs / NS_IN_MS;
  let partStr = `Part ${partRes.partNum}: ${partRes.solution} | ${partMs} ms`;
  process.stdout.write(`${partStr}\n`);
}

function runPart(partNum, inputLines, partFn) {
  let startTime = process.hrtime.bigint();
  let solution = partFn(inputLines);
  let endTime = process.hrtime.bigint();
  let elapsedNs = Number(endTime - startTime);
  let partRes = {
    partNum,
    elapsedNs,
    solution, 
  };
  return partRes;
}
