
import path from 'path';
import { readFile } from 'fs/promises';

import { INPUT_DIR_PATH } from '../constants';

const DAY1_INPUT_FILE_NAME = 'day1.txt';
const DAY1_INPUT_FILE_PATH = [
  INPUT_DIR_PATH,
  DAY1_INPUT_FILE_NAME,
].join(path.sep);

export async function day1() {
  let inputStrs: string[];
  let calibrationValues: number[];
  let calibrationSum: number;
  console.log('~ Day 1 ~');
  inputStrs = await laodDay1Input();
  
  calibrationValues = inputStrs.map(getCalibrationValue);
  calibrationSum = calibrationValues.reduce((acc, curr) => {
    return acc + curr;
  }, 0);
  console.log('calibrationSum:');
  console.log(calibrationSum);
}

function getCalibrationValue(inputStr: string): number {
  let numStr: string;
  let firstDigit: string;
  let secondDigit: string;
  let calibrationString: string;
  numStr = inputStr.replace(/[^0-9]/gi, '');
  firstDigit = numStr[0];
  secondDigit = numStr[numStr.length - 1];
  calibrationString = `${firstDigit}${secondDigit}`;

  return +calibrationString;
}

async function laodDay1Input() {
  let dataBuf: Buffer;
  let dataStr: string;
  let day1Input: string[];
  dataBuf = await readFile(DAY1_INPUT_FILE_PATH);
  dataStr = dataBuf.toString();
  day1Input = dataStr.split('\n').filter(inputLine => inputLine.length > 0);
  return day1Input;
}
