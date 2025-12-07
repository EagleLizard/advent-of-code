
import 'source-map-support/register';

import { cliColors, CliFmtFn } from './util/cli-colors';
import { files } from './lib/files';

import { day1_2024 } from './days/day1_2024/day1';
import { day1 } from './days/day1/day1';
import { day2 } from './days/day2/day2';
import { day3 } from './days/day3/day3';
import { day4 } from './days/day4/day4';
import { day5 } from './days/day5/day5';
import { day6 } from './days/day6/day6';

type DayPartFn = {
  (inputLines: string[]): number | string
};
type DayTuple = [
  dayKey: number | string,
  inputFileName: string,
  part1?: DayPartFn,
  part2?: DayPartFn,
];

type CliOpts = {
  day?: string;
};

type PartRes = {
  partNum: number;
  elapsedNs: number;
  solution: number | string;
} & {};

const NS_IN_MS = 1e6;

const day_defs: DayTuple[] = [
  [ '24_1', day1_2024.DAY_1_FILE_NAME, day1_2024.day1Pt1 ],
  [ 1, day1.DAY_1_FILE_NAME, day1.day1Pt1, day1.day1Pt2 ],
  [ 2, day2.DAY_2_FILE_NAME, day2.day2Pt1, day2.day2Pt2 ],
  [ 3, day3.DAY_3_FILE_NAME, day3.day3pt1, day3.day3pt2 ],
  [ 4, day4.DAY_4_FILE_NAME, day4.day4Pt1, day4.day4Pt2 ],
  [ 5, day5.file_name, day5.part1, day5.part2 ],
  [ 6, day6.file_name, day6.part1, day6.part2 ],
];

const cli_theme = {
  c1: cliColors.colors.chartreuse_light,
  c2: cliColors.colors.cyan,
  c3: cliColors.colors.pear,
  c4: cliColors.colors.white_bright,
  italic: cliColors.italic,
  underline: cliColors.underline,
} as const satisfies Record<string, CliFmtFn>;
type CliTheme = typeof cli_theme & {};

(async () => {
  try {
    await main();
  } catch(e) {
    console.error(e);
    throw e;
  }
})();

async function main() {
  console.log('~~ aoc ts 2025');
  let daysToRun: DayTuple[] = [];
  let cliOpts = parseArgv(process.argv);
  let dayArg = cliOpts.day;
  if(dayArg !== undefined && dayArg !== '0') {
    let foundDay = day_defs.find((day) => {
      return `${day[0]}` === dayArg;
    });
    if(foundDay === undefined) {
      console.log(`Day not found: ${dayArg}`);
      return;
    }
    daysToRun.push(foundDay);
  } else {
    daysToRun = [ ...day_defs ];
  }
  for(let i = 0; i < daysToRun.length; i++) {
    let currDay = daysToRun[i];
    await runDay(cli_theme, ...currDay);
  }
}

async function runDay(
  t: CliTheme,
  day: string | number,
  inputFileName: string,
  part1Fn?: DayPartFn,
  part2Fn?: DayPartFn
) {
  let inputLines: string[];
  let ptRes: PartRes;
  let totalStart: bigint;
  let totalEnd: bigint;
  let fileReadStart: bigint;
  let fileReadEnd: bigint;

  let dayBannerText = `~ Day ${day} ~`;
  let dayBanner = t.c1(dayBannerText);
  process.stdout.write(`${dayBanner}\n`);
  totalStart = process.hrtime.bigint();
  fileReadStart = process.hrtime.bigint();
  inputLines = await files.loadInputLines(inputFileName);
  fileReadEnd = process.hrtime.bigint();
  if(part1Fn !== undefined) {
    ptRes = runPart(1, inputLines, part1Fn);
    printPart(t, ptRes);
  }
  if(part2Fn !== undefined) {
    ptRes = runPart(2, inputLines, part2Fn);
    printPart(t, ptRes);
  }
  totalEnd = process.hrtime.bigint();
  let totalMs = Number(totalEnd - totalStart) / NS_IN_MS;
  let divWidth = 6;
  let divStr = '-'.repeat(divWidth);
  let totalTxt = t.c1('total');
  let totalTimeStr = t.c2(`${totalMs.toFixed(3)} ms`);
  let totalStr = t.italic(`${totalTxt}: ${totalTimeStr} `);
  let fileReadMs = Number(fileReadEnd - fileReadStart) / NS_IN_MS;;
  process.stdout.write(`${totalStr}\n${divStr}\n`);
}

function runPart(partNum: number, inputLines: string[], partFn: DayPartFn): PartRes {
  let startTime: bigint;
  let endTime: bigint;
  let solution: number | string;
  let elapsedNs: number;
  let partRes: PartRes;
  startTime = process.hrtime.bigint();
  solution = partFn(inputLines);
  endTime = process.hrtime.bigint();
  elapsedNs = Number(endTime - startTime);
  partRes = {
    partNum: partNum,
    elapsedNs: elapsedNs,
    solution: solution,
  };
  return partRes;
}

function printPart(t: CliTheme, partRes: PartRes) {
  let partMs = partRes.elapsedNs / NS_IN_MS;
  let solutionStr = t.c3(partRes.solution);
  let timeStr = t.c2(`${partMs.toFixed(3)} ms`);
  let partTxt = t.c1(`Part ${partRes.partNum}`);
  let partStr = `${partTxt}: ${solutionStr} | ${timeStr}`;
  process.stdout.write(`${partStr}\n`);
}

function parseArgv(argv: string[]): CliOpts {
  let args = argv.slice(2);
  let cliOpts: CliOpts = {
    day: undefined,
  };
  for(let i = 0; i < args.length; i++) {
    if(args[i] === '-d') {
      cliOpts.day = args[i + 1];
    }
  }
  return cliOpts;
}
