
import path from 'path';
import { readFile } from 'fs/promises';

import { INPUT_DIR_PATH } from '../constants';

const DAY3_INPUT_FILE_NAME = 'day3.txt';
const DAY3_INPUT_FILE_PATH = [
  INPUT_DIR_PATH,
  DAY3_INPUT_FILE_NAME,
].join(path.sep);

export async function day3Main() {
  console.log('~ Day 3 ~');
  let inputStrs: string[];
  let grid: string[];
  inputStrs = await loadDay3Input();
  // reference input as 2d matrics
  grid = inputStrs.filter(inputStr => inputStr.length > 1);

  /*
    traverse the grid.
    When encountering a number:
      set a flag to parse it until the end.
      For each char, loook around at all adjacent entries
        If any adjacent entry is a symbol, set a flag to add as an
        engine part.
  */

  let numFlag: boolean;
  let partFlag: boolean;
  let numArr: string[];
  let foundParts: string[];
  numFlag = false;
  partFlag = false;
  numArr = [];
  foundParts = [];

  const terminateNum = () => {
    numFlag = false;
    if(partFlag) {
      partFlag = false;
      foundParts.push(numArr.join(''));
    }
    numArr = [];
  };

  for(let y = 0; y < grid.length; ++y) {
    let currRow: string;
    currRow = grid[y];
    for(let x = 0; x < currRow.length; ++x) {
      let char: string;
      char = currRow[x];
      if(!numFlag && isNumChar(char)) {
        numFlag = true;
      }
      if(numFlag) {
        if(!isNumChar(char)) {
          // part number terminal
          terminateNum();
        } else {
          if(!partFlag) {
            // look at adjacent tiles
            if(hasAdjacentSymbol(x, y, grid)) {
              partFlag = true;
            }
          }
          numArr.push(char);
        }
      }
    }
    terminateNum();
    if(numFlag) {
      // error - shouldn't happen
      console.log('_' + numArr.join(''));
    }
    if(partFlag) {
      // error - shouldn't happen
      console.log(numArr.join(''));
    }
  }

  // console.log(JSON.stringify(foundParts, null, 2));

  let partsSum: number;
  partsSum = foundParts.reduce((acc, curr) => {
    return acc + +curr;
  }, 0);

  console.log('Engine parts sum:');
  console.log(partsSum);

}

function hasAdjacentSymbol(x: number, y: number, grid: string[]): boolean {
  /*
    Symbols:
      *&@/+#$%=-
  */
  let adjacentChars: string[];
  adjacentChars = [
    grid[y - 1]?.[x - 1],
    grid[y - 1]?.[x],
    grid[y - 1]?.[x + 1],
    grid[y]?.[x - 1],
    grid[y]?.[x + 1],
    grid[y + 1]?.[x - 1],
    grid[y + 1]?.[x],
    grid[y + 1]?.[x + 1],
  ].filter(char => char !== undefined);
  return adjacentChars.some(char => /[*&@/+#$%=-]/.test(char));
}

function isNumChar(char: string): boolean {
  return /[0-9]/.test(char);
}

async function loadDay3Input() {
  let dataBuf: Buffer;
  let dataStr: string;
  let day3Input: string[];
  dataBuf = await readFile(DAY3_INPUT_FILE_PATH);
  dataStr = dataBuf.toString();
  day3Input = dataStr.split('\n')
    .map(inputLine => inputLine.trim())
    .filter(inputLine => inputLine.length > 0);

  // /*
  //   extract symbols from input
  // */
  // console.log(
  //   [ ...new Set(dataStr.replace(/[0-9.\n]/g, '').split('')) ].join('')
  // );
  return day3Input;
}
