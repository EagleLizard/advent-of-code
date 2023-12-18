
import { loadDayInput } from '../util/input-util';
import { getIntuitiveTimeString } from '../util/print-util';
import { runAndTime } from '../util/timer';
import { OasisReport } from './oasis-report';
import { parseOasisReport } from './oasis-report-parse';

const DAY_9_INPUT_FILE_NAME = 'day9_test.txt';

export async function day9Main() {
  console.log('~ Day 9~');
  let inputLines: string[];
  let oasisReport: OasisReport;
  inputLines = (await loadDayInput(DAY_9_INPUT_FILE_NAME))
    .filter(inputLine => inputLine.length > 0)
  ;

  oasisReport = await parseOasisReport(inputLines);
  let fnTimeMs = runAndTime(() => {
    day9Part1(oasisReport);
  });
  console.log(`\n[day9p1] took: ${getIntuitiveTimeString(fnTimeMs)}`);
}


function day9Part1(oasisReport: OasisReport) {
  console.log('\n~ Day 9 Part 1 ~');
  let predictions: number[];

  predictions = oasisReport.histories.map((history, idx) => {
    let historyDiffs: number[][];
    let historyValues = history.values;

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
  console.log(`predictionsSum: ${predictionsSum}`);
}

function isDiffingComplete(diffs: number[][]): boolean {
  let isComplete = diffs[diffs.length - 1].every(currDiff => currDiff === 0);
  return isComplete;
}
