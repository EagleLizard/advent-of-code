
import { loadDayInput } from '../util/input-util';
import { runAndTime } from '../util/timer';
import { getIntuitiveTimeString } from '../util/format-util';
import { DAY3_INPUT_FILE_NAME } from '../constants';

type PartNum = {
  val: string;
  x: number;
  y: number;
};

export async function day3Main() {
  let inputLines: string[];
  let part1PartsSum: number | undefined;
  let part2GearRatioSum: number | undefined;

  inputLines = (await loadDayInput(DAY3_INPUT_FILE_NAME))
    .map(inputLine => inputLine.trim())
    .filter(inputLine => inputLine.length > 0);
  // reference input as 2d matrics

  let funTime = await runAndTime(() => {
    part1PartsSum = day3Part1(inputLines);
  });
  if(part1PartsSum === undefined) {
    throw new Error('Undefined parseSum result from day 3 part 1');
  }
  console.log('Engine parts sum:');
  console.log(part1PartsSum);
  console.log(`\n[d3p1] took: ${getIntuitiveTimeString(funTime)}`);

  funTime = await runAndTime(() => {
    part2GearRatioSum = day3Part2(inputLines);
  });
  console.log('Gear ratio sum:');
  console.log(part2GearRatioSum);
  console.log(`\n[d3p2] took: ${getIntuitiveTimeString(funTime)}`);
}

export function day3Part2(grid: string[]): number {
  /*
    A gear is any * symbol that is adjacent to exactly two part numbers.
    Its gear ratio is the result of multiplying those two numbers together.
  */
  /*
    Do 2 passes
    Pass 1:
      Extract all of the numbers adjacent to gears, store the
        number's value and starting position.
      Extract all of the gears
  */
  let numFlag: boolean;
  let partFlag: boolean;
  let numArr: string[];
  let foundNums: PartNum[];
  let charX: number;
  let charY: number;
  numFlag = false;
  partFlag = false;
  numArr = [];
  foundNums = [];

  charX = -1;
  charY = -1;

  const terminateNum = () => {
    numFlag = false;
    if(partFlag) {
      partFlag = false;
      foundNums.push({
        val: numArr.join(''),
        x: charX,
        y: charY,
      });
    }
    numArr = [];
    charX = -1;
    charY = -1;
  };

  /*
    Find every number that is adjacent to a gear
  */
  for(let y = 0; y < grid.length; ++y) {
    let currRow: string;
    currRow = grid[y];
    for(let x = 0; x < currRow.length; ++x) {
      let char: string;
      char = currRow[x];
      if(!numFlag && isNumChar(char)) {
        numFlag = true;
        charX = x;
        charY = y;
      }
      if(numFlag) {
        if(!isNumChar(char)) {
          terminateNum();
        } else {
          if(!partFlag) {
            if(hasAdjacentSymbol(x, y, grid, /[*]/)) {
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

  /*
    Find every gear that is adjacent to 2 nums
  */
  let gearNums: PartNum[];
  let gearPairs: [PartNum, PartNum][];
  gearPairs = [];
  for(let y = 0; y < grid.length; ++y) {
    let currRow: string;
    currRow = grid[y];
    for(let x = 0; x < currRow.length; ++x) {
      if(currRow[x] === '*') {
        // find all PartNums adjacent to this gear
        gearNums = foundNums.filter(gearNum => {
          return (y <= gearNum.y + 1)
            && (y >= gearNum.y - 1)
            && (x >= gearNum.x - 1)
            && (x <= (gearNum.x + gearNum.val.length))
          ;
        });
        if(gearNums.length === 2) {
          gearPairs.push([ gearNums[0], gearNums[1] ]);
        }
      }
    }
  }

  let gearRatioSum: number;
  gearRatioSum = gearPairs.reduce((acc, curr) => {
    return acc + (+curr[0].val * +curr[1].val);
  }, 0);

  return gearRatioSum;
}

export function day3Part1(grid: string[]): number {
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

  return partsSum;
}

function hasAdjacentSymbol(x: number, y: number, grid: string[], charRx?: RegExp): boolean {
  /*
    Symbols:
      *&@/+#$%=-
  */
  let adjacentChars: string[];
  let rx = charRx ?? /[*&@/+#$%=-]/;
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
  return adjacentChars.some(char => rx.test(char));
}

function isNumChar(char: string): boolean {
  return /[0-9]/.test(char);
}
