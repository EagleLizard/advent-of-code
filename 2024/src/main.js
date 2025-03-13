
const files = require('./lib/files');
const cliColors = require('./util/cli-colors');

const day1 = require('./day1/day1');
const day7 = require('./day7/day7-main');
const day9 = require('./day9/day9-main');
const day17 = require('./day17/day17-main');
const day18 = require('./day18/day18-main');
const day19 = require('./day19/day19-main');
const day20 = require('./day20/day20-main');
// const day21 = require('./day21/day21-main');
const day21 = require('./day21/day21-main2');
const day22 = require('./day22/day22-main');
const day23 = require('./day23/day23-main');
const day24 = require('./day24/day24-main');

const NS_IN_MS = 1e6;

// const DAY_1_FILE_NAME = 'day1_test1.txt';
const DAY_1_FILE_NAME = 'day1.txt';
// const DAY_7_FILE_NAME = 'day7_test.txt';
const DAY_7_FILE_NAME = 'day7.txt';
const DAY_9_FILE_NAME = 'day9.txt';
// const DAY_9_FILE_NAME = 'day9_test1.txt';
// const DAY_9_FILE_NAME = 'day9_test2.txt';
// const DAY_17_FILE_NAME = 'day17_test.txt';
// const DAY_17_FILE_NAME = 'day17_test2.txt';
// const DAY_17_FILE_NAME = 'day17_test3.txt';
const DAY_17_FILE_NAME = 'day17.txt';
// const DAY_18_FILE_NAME = 'day18_test.txt';
const DAY_18_FILE_NAME = 'day18.txt';
// const DAY_19_FILE_NAME = 'day19_test.txt';
const DAY_19_FILE_NAME = 'day19.txt';
// const DAY_20_FILE_NAME = 'day20_test.txt';
const DAY_20_FILE_NAME = 'day20.txt';
const DAY_21_FILE_NAME = 'day21_test.txt';
// const DAY_21_FILE_NAME = 'day21.txt';
// const DAY_22_FILE_NAME = 'day22_test.txt';
// const DAY_22_FILE_NAME = 'day22_test2.txt';
// const DAY_22_FILE_NAME = 'day22_test3.txt';
/* 
  p1 - 18183557
  p2 - 27 with sequence (3, 1, 4, 1)`
_*/
// const DAY_22_FILE_NAME = 'day22_test-e1.txt';
/* 
  p1 - 8876699
  p2 - 27 with sequence (-1, 0, -1, 8)
_*/
// const DAY_22_FILE_NAME = 'day22_test-e2.txt';
const DAY_22_FILE_NAME = 'day22.txt';
// const DAY_23_FILE_NAME = 'day23_test.txt';
const DAY_23_FILE_NAME = 'day23.txt';
// const DAY_24_FILE_NAME = 'day24_test1.txt';
// const DAY_24_FILE_NAME = 'day24_test2.txt';
const DAY_24_FILE_NAME = 'day24.txt';

const DAY_ARGS_ARR = [
  [ 1, DAY_1_FILE_NAME, day1.day1Pt1, day1.day1Pt2 ],
  [ 7, DAY_7_FILE_NAME, day7.day7Part1, day7.day7Part2 ],
  [ 9, DAY_9_FILE_NAME, day9.day9Part1, day9.day9Part2 ],
  [ 17, DAY_17_FILE_NAME, day17.day17Part1, day17.day17Part2 ],
  [ 18, DAY_18_FILE_NAME, day18.day18Part1, day18.day18Part2 ],
  [ 19, DAY_19_FILE_NAME, day19.day19Part1, day19.day19Part2 ],
  [ 20, DAY_20_FILE_NAME, day20.day20Part1, day20.day20Part2 ],
  [ 21, DAY_21_FILE_NAME, day21.day21Part1, undefined ],
  // [ 21, DAY_21_FILE_NAME, undefined, day21.day21Part2 ],
  [ 22, DAY_22_FILE_NAME, day22.day22Part1, day22.day22Part2 ],
  [ 23, DAY_23_FILE_NAME, day23.day23Part1, day23.day23Part2 ],
  [ 24, DAY_24_FILE_NAME, day24.day24Part1, undefined ],
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
  let dayArgsArr = DAY_ARGS_ARR.slice();
  let argv = process.argv.slice();
  let cliOpts = parseArgv(argv);

  if(cliOpts.day !== undefined && cliOpts.day > 0) {
    dayArgsArr = dayArgsArr.filter(daysArgs => {
      return daysArgs.day === cliOpts.day;
    });
  }
  let bannerStr = getAocBanner(t);
  process.stdout.write(`\n${bannerStr}\n\n`);
  for(let i = 0; i < dayArgsArr.length; ++i) {
    let currDayArgs = dayArgsArr[i];
    runDay(t, currDayArgs.day, currDayArgs.inputFileName, currDayArgs.part1Fn, currDayArgs.part2Fn);
  }
}

function parseArgv(argv) {
  let args = argv.slice(2);
  let dayArg;
  let cliOpts = {
    day: undefined,
  };

  /* simple for now - only one arg */
  if(args[0] === '-d' && !isNaN((dayArg = +args[1]))) {
    cliOpts.day = dayArg;
  }
  return cliOpts;
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
