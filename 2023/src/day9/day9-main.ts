
import { loadDayInput } from '../util/input-util';
import { getIntuitiveTimeString } from '../util/format-util';
import { runAndTime } from '../util/timer';
import { OasisReport } from './oasis-report';
import { parseOasisReport } from './oasis-report-parse';
import { DAY9_INPUT_FILE_NAME } from '../constants';

export async function day9Main() {
  let inputLines: string[];
  let part1PredictionsSum: number | undefined;
  let part2PredictionsSum: number | undefined;
  inputLines = (await loadDayInput(DAY9_INPUT_FILE_NAME))
    .filter(inputLine => inputLine.length > 0)
  ;

  let fnTimeMs = await runAndTime(() => {
    part1PredictionsSum = day9Part1(inputLines);
  });
  console.log('predictionsSum:');
  console.log(part1PredictionsSum);
  console.log(`\n[day9p1] took: ${getIntuitiveTimeString(fnTimeMs)}`);
  fnTimeMs = await runAndTime(() => {
    part2PredictionsSum = day9Part2(inputLines);
  });
  console.log('predictionsSum:');
  console.log(part2PredictionsSum);
  console.log(`\n[day9p2] took: ${getIntuitiveTimeString(fnTimeMs)}`);
}

export function day9Part2(inputLines: string[]): number {
  let oasisReport: OasisReport;
  let predictions: number[];

  oasisReport = parseOasisReport(inputLines);

  predictions = oasisReport.histories.map((history, idx) => {
    let historyDiffs: number[][];

    historyDiffs = getHistoryDiffs(history.values);
    // add the zero placeholder to the last diff
    historyDiffs[historyDiffs.length - 1].unshift(0);
    for(let i = historyDiffs.length - 1; i > 0; --i) {
      let currPredictionVal: number;
      let currDiffs = historyDiffs[i];
      let lastDiffs = historyDiffs[i - 1];
      let currDiffVal = currDiffs[0];
      let lastDiffVal = lastDiffs[0];

      currPredictionVal = lastDiffVal - currDiffVal;
      lastDiffs.unshift(currPredictionVal);
    }
    return historyDiffs[0][0];
  });
  let predictionsSum = predictions.reduce((acc, curr) => {
    return acc + curr;
  }, 0);
  return predictionsSum;
}

export function day9Part1(inputLines: string[]): number {
  let oasisReport: OasisReport;
  let predictions: number[];

  oasisReport = parseOasisReport(inputLines);

  predictions = oasisReport.histories.map((history, idx) => {
    let historyDiffs: number[][];

    historyDiffs = getHistoryDiffs(history.values);
    // add the zero placeholder to the last diff
    historyDiffs[historyDiffs.length - 1].push(0);
    for(let i = historyDiffs.length - 1; i > 0; --i) {
      let currPredictionVal: number;
      let currDiffs = historyDiffs[i];
      let lastDiffs = historyDiffs[i - 1];
      let currDiffVal = currDiffs[currDiffs.length - 1];
      let lastDiffVal = lastDiffs[lastDiffs.length - 1];

      currPredictionVal = lastDiffVal + currDiffVal;
      lastDiffs.push(currPredictionVal);
    }
    return historyDiffs[0][historyDiffs[0].length - 1];
  });
  let predictionsSum = predictions.reduce((acc, curr) => {
    return acc + curr;
  }, 0);

  return predictionsSum;
}

function getHistoryDiffs(historyValues: number[]): number[][] {
  let historyDiffs: number[][];

  historyDiffs = [
    historyValues,
  ];

  while(!isDiffingComplete(historyDiffs)) {
    let lastDiffArr = historyDiffs[historyDiffs.length - 1];
    let currDiffArr: number[] = [];
    for(let i = 1; i < lastDiffArr.length; ++i) {
      let lastDiff = lastDiffArr[i] - lastDiffArr[i - 1];
      currDiffArr.push(lastDiff);
    }
    historyDiffs.push(currDiffArr);
  }

  return historyDiffs;
}

function isDiffingComplete(diffs: number[][]): boolean {
  let isComplete = diffs[diffs.length - 1].every(currDiff => currDiff === 0);
  return isComplete;
}
