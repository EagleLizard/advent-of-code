
import { DAY1_INPUT_FILE_NAME } from '../constants';
import { getIntuitiveTimeString } from '../util/format-util';
import { loadDayInput } from '../util/input-util';
import { runAndTime } from '../util/timer';

type DigitMatch = {
  value: string;
  index: number;
};

export async function day1Main() {
  let part1CalibrationSum: number | undefined;
  let part2CalibrationSum: number | undefined;

  const inputLines = (await loadDayInput(DAY1_INPUT_FILE_NAME))
    .map(inputLine => inputLine.trim())
    .filter(inputLine => inputLine.length > 0)
  ;
  let funTime = await runAndTime(async () => {
    part1CalibrationSum = day1p1(inputLines);
  });
  if(part1CalibrationSum === undefined) {
    throw new Error('Undefined calibrationSum result from day 1 part 1');
  }
  console.log('calibrationSum:');
  console.log(part1CalibrationSum);
  console.log(`\n[day1p1] took: ${getIntuitiveTimeString(funTime)}`);

  funTime = await runAndTime(async () => {
    part2CalibrationSum = day1p2(inputLines);
  });
  if(part2CalibrationSum === undefined) {
    throw new Error('Undefined calibrationSum result from day 1 part 2');
  }
  console.log('calibrationSum:');
  console.log(part2CalibrationSum);
  console.log(`\n[day1p2] took: ${getIntuitiveTimeString(funTime)}`);
}

export function day1p1(inputStrs: string[]): number {
  let calibrationValues: number[];
  let calibrationSum: number;

  console.log('~ Day 1 part 1 ~');

  calibrationValues = inputStrs.map(getCalibrationValue);
  calibrationSum = calibrationValues.reduce((acc, curr) => {
    return acc + curr;
  }, 0);

  return calibrationSum;
}

export function day1p2(inputStrs: string[]): number {
  let calibrationSum: number;
  let calibrationValues: number[];

  console.log('~ Day 1 part 2 ~');

  calibrationValues = inputStrs.map(getCalibrationValueP2);
  calibrationSum = calibrationValues.reduce((acc, curr) => {
    return acc + curr;
  }, 0);
  return calibrationSum;
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
