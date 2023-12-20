
import { OasisHistory, OasisReport } from './oasis-report';

export async function parseOasisReport(inputLines: string[]): Promise<OasisReport> {
  let oasisReport: OasisReport;
  let oasisHistories: OasisHistory[];

  oasisHistories = inputLines.map((inputLine, idx) => {
    let historyValues: number[];
    let currHistory: OasisHistory;
    historyValues = inputLine.split(' ')
      .filter(linePart => linePart.length > 0)
      .map(linePart => +linePart)
    ;
    currHistory = {
      id: idx,
      values: historyValues,
    };
    return currHistory;
  });

  oasisReport = {
    histories: oasisHistories,
  };

  return oasisReport;
}
