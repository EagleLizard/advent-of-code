
const files = require('./lib/files');
const cliColors = require('./util/cli-colors');

const day1 = require('./day1/day1');
const day7 = require('./day7/day7-main');
const day9 = require('./day9/day9-main');

const NS_IN_MS = 1e6;

// const DAY_1_FILE_NAME = 'day1_test1.txt';
const DAY_1_FILE_NAME = 'day1.txt';
// const DAY_7_FILE_NAME = 'day7_test.txt';
const DAY_7_FILE_NAME = 'day7.txt';
const DAY_9_FILE_NAME = 'day9.txt';
// const DAY_9_FILE_NAME = 'day9_test1.txt';
// const DAY_9_FILE_NAME = 'day9_test2.txt';

const dayArgsArr = [
  [ 1, DAY_1_FILE_NAME, day1.day1Pt1, day1.day1Pt2 ],
  [ 7, DAY_7_FILE_NAME, day7.day7Part1, day7.day7Part2 ],
  [ 9, DAY_9_FILE_NAME, day9.day9Part1, undefined ],
].map(dayArgsTuple => {
  let [ day, inputFileName, part1Fn, part2Fn ] = dayArgsTuple;
  return {
    day,
    inputFileName,
    part1Fn,
    part2Fn,
  };
});

const t = {
  c1: cliColors.colors.chartreuse_light,
  c2: cliColors.colors.cyan,
  c3: cliColors.colors.pear,
  c4: cliColors.colors.white_bright,
  italic: cliColors.italic,
  underline: cliColors.underline,
};

(async () => {
  try {
    await main();
  } catch(e) {
    console.error(e);
    throw e;
  }
})();

async function main() {
  let bannerStr = getAocBanner(t);
  process.stdout.write(`\n${bannerStr}\n\n`);
  for(let i = 0; i < dayArgsArr.length; ++i) {
    let currDayArgs = dayArgsArr[i];
    runDay(t, currDayArgs.day, currDayArgs.inputFileName, currDayArgs.part1Fn, currDayArgs.part2Fn);
  }
}

function runDay(t, day, inputFileName, part1Fn, part2Fn) {
  let dayBannerTxt = `~ Day ${day} ~`;
  let dayBanner = t.c1(dayBannerTxt);
  let inputLines = files.getInputLines(inputFileName);
  let ptRes;
  process.stdout.write(`${dayBanner}\n`);
  let totalStart = process.hrtime.bigint();
  if(part1Fn !== undefined) {
    ptRes = runPart(1, inputLines, part1Fn);
    printPart(t, ptRes);
  }
  if(part2Fn !== undefined) {
    ptRes = runPart(2, inputLines, part2Fn);
    printPart(t, ptRes);
  }
  let totalEnd = process.hrtime.bigint();
  let totalMs = Number(totalEnd - totalStart) / NS_IN_MS;
  let divWidth = 6;
  let divStr = '-'.repeat(divWidth);
  let totalTxt = t.c1('total');
  let totalTimeStr = t.c2(`${totalMs} ms`);
  let totalStr = t.italic(`${totalTxt}: ${totalTimeStr}`);
  process.stdout.write(`${totalStr}\n${divStr}\n`);
}

function getAocBanner(t) {
  let padStr = '~';
  let left = t.c1(padStr);
  let right = t.c1(padStr);
  let bannerTxt = ' Advent of Code 2024 [js] ';
  let bannerTxtStr = t.c4(bannerTxt);
  let bannerTxtLine = `${left}${bannerTxtStr}${right}`;
  let topTxt = padStr.repeat(bannerTxt.length + (padStr.length * 2));
  let bottomTxt = topTxt;
  let top = t.c1(topTxt);
  // let bottom = t.underline(t.c1(bottomTxt));
  let bottom = t.c1(bottomTxt);
  let bannerStr = `${top}\n${bannerTxtLine}\n${bottom}`;
  return bannerStr;
}

function printPart(t, partRes) {
  let partMs = partRes.elapsedNs / NS_IN_MS;
  let solutionStr = t.c3(partRes.solution);
  let timeStr = t.c2(`${partMs} ms`);
  let partTxt = t.c1(`Part ${partRes.partNum}`);
  let partStr = `${partTxt}: ${solutionStr} | ${timeStr}`;
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
