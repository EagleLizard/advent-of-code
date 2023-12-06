
import path from 'path';
import { readFile } from 'fs/promises';

import { INPUT_DIR_PATH } from '../constants';

const DAY1_INPUT_FILE_NAME = 'day1.txt';
const DAY1_INPUT_FILE_PATH = [
  INPUT_DIR_PATH,
  DAY1_INPUT_FILE_NAME,
].join(path.sep);

type DigitMatch = {
  value: string;
  index: number;
};

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

export async function day2p2() {
  let inputStrs: string[];
  let calibrationValues: number[];
  let calibrationSum: number;
  console.log('~ Day 1 part 2 ~');
  inputStrs = await laodDay1Input();
  // getCalibrationValueP2('onetwo5xthreeight');
  calibrationValues = inputStrs.map(getCalibrationValueP2);
  calibrationSum = calibrationValues.reduce((acc, curr) => {
    return acc + curr;
  }, 0);
  console.log('calibrationSum:');
  console.log(calibrationSum);
}

function getCalibrationValueP2(inputStr: string): number {
  /*
    Approach 1:
    First replace all instances of words with the corresponding digits.
      Do this with an array of patterns calling string.replace
    Run the resulting string through the original ge†CalibrationValue function
    SCRATCH:
      This wasn't the correct solution because the following strings:
      'oneight' => '18'
      'twone' => '21'

    Approach 2:
    Find the first and last digit by search
  */
  let firstMatch: DigitMatch | undefined;
  let lastMatch: DigitMatch | undefined;
  let digitMatches: DigitMatch[] = [];
  let firstDigit: string;
  let secondDigit: string;
  let calibrationString: string;

  let allMatches = [
    /one/g,
    /two/g,
    /three/g,
    /four/g,
    /five/g,
    /six/g,
    /seven/g,
    /eight/g,
    /nine/g,
    /[0-9]/g,
  ].reduce((acc, curr) => {
    let matches = inputStr.matchAll(curr);
    return [ ...acc, ...matches ];
  }, [] as RegExpMatchArray[]);

  for(let i = 0; i < allMatches.length; ++i) {
    let currMatch: RegExpMatchArray;
    let digitMatch: DigitMatch;
    currMatch = allMatches[i];
    if(
      (currMatch.index !== undefined)
      && (typeof currMatch[0] === 'string')
    ) {
      digitMatch = {
        value: currMatch[0],
        index: currMatch.index,
      };
      digitMatches.push(digitMatch);
    }
  }

  for(let i = 0; i < digitMatches.length; ++i) {
    let currMatch: DigitMatch;
    currMatch = digitMatches[i];
    if(
      (firstMatch === undefined)
      || (currMatch.index < firstMatch.index)
    ) {
      firstMatch = currMatch;
    }
    if(
      (lastMatch === undefined)
      || (currMatch.index > lastMatch.index)
    ) {
      lastMatch = currMatch;
    }
  }

  if(
    (firstMatch === undefined)
    || (lastMatch === undefined)
  ) {
    throw new Error(`No matches found for string: ${inputStr}`);
  }

  firstDigit = getDigitFromMatchString(firstMatch.value);
  secondDigit = getDigitFromMatchString(lastMatch.value);

  calibrationString = `${firstDigit}${secondDigit}`;

  // console.log(inputStr);
  // console.log(calibrationString);

  return +calibrationString;
}

function getDigitFromMatchString(digitMatchStr: string): string {
  let digitChar: string | undefined;
  if(!isNaN(+digitMatchStr)) {
    return digitMatchStr;
  }
  [
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
  ].some((numStr, idx) => {
    digitChar = `${idx + 1}`;
    return numStr === digitMatchStr;
  });
  if(digitChar === undefined) {
    throw new Error(`String is not a valid digit: ${digitMatchStr}`);
  }
  return digitChar;
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
