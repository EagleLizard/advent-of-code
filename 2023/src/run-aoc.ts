
import { loadDayInput } from './util/input-util';
import { Timer, runAndTime } from './util/timer';

export type RunDayParams = {
  dayNum: number,
  inputFileName: string,
  part1Fn: (inputLines: string[]) => number,
  part2Fn?: (inputLines: string[]) => number,
};

export type RunDayResult = {
  dayNum: number,
  part1Result: RunDayPartResult,
  part2Result?: RunDayPartResult,
  dayTime: number;
}

export type RunDayPartParams = {
  dayNum: number,
  partNum: number,
  inputLines: string[],
  fn: (inputLines: string[]) => number,
};
export type RunDayPartResult = {
  dayNum: number,
  partNum: number,
  funTime: number,
  solutionVal: number,
}

export async function runDay(
  dayNum: number,
  inputFileName: string,
  part1Fn:(inputLines: string[]) => number,
  part2Fn?:(inputLines: string[]) => number,
): Promise<RunDayResult> {
  let dayResult: RunDayResult;
  let part1Result: RunDayPartResult;
  let part2Result: RunDayPartResult | undefined;
  let dayTimer: Timer;
  let dayTime: number;

  dayTimer = Timer.start();

  const inputLines = (await loadDayInput(inputFileName))
    .map(inputLine => inputLine.trim())
    .filter(inputLine => inputLine.length > 0)
  ;

  part1Result = await runDayPart(dayNum, 1, inputLines, part1Fn);

  if(part2Fn !== undefined) {
    part2Result = await runDayPart(dayNum, 2, inputLines, part2Fn);
  }

  dayTime = dayTimer.stop();

  dayResult = {
    dayNum,
    part1Result,
    part2Result,
    dayTime,
  };

  return dayResult;
}

export async function runDayPart(
  dayNum: number,
  partNum: number,
  inputLines: string[],
  fn: (inputLines: string[]) => number,
): Promise<RunDayPartResult> {
  let solutionVal: number | undefined;
  let dayPartResult: RunDayPartResult;
  let funTime = await runAndTime(() => {
    solutionVal = fn(inputLines);
  });
  if(solutionVal === undefined) {
    throw new Error(`Undefined solutionVal for Day ${dayNum} Part ${partNum}`);
  }
  dayPartResult = {
    dayNum,
    partNum,
    funTime,
    solutionVal,
  };
  return dayPartResult;
}
