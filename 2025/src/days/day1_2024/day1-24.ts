import { AocDayDef } from '../../models/aoc-day-def';

type Day1_2024Input = {
  list1: number[];
  list2: number[];
};

// const DAY_1_FILE_NAME = 'day1_test1-2024.txt';
const DAY_1_FILE_NAME = 'day1-2024.txt';

export const day1_24 = {
  dayNum: '24_1',
  file_name: DAY_1_FILE_NAME,
  part1: day1Pt1,
} as const satisfies AocDayDef;

function day1Pt1(inputLines: string[]) {
  let day1Input: Day1_2024Input = parseInput(inputLines);
  let list1: number[] = day1Input.list1.toSorted((a, b) => a - b);
  let list2: number[] = day1Input.list2.toSorted((a, b) => a - b);
  let diffSum = 0;
  for(let i = 0; i < list1.length; i++) {
    diffSum += Math.abs(list1[i] - list2[i]);
  }
  return diffSum;
}

function parseInput(inputLines: string[]): Day1_2024Input {
  let day1Input: Day1_2024Input;
  let list1: number[] = [];
  let list2: number[] = [];
  for(let i = 0; i < inputLines.length; i++) {
    let inputLine = inputLines[i];
    let rx = /^([0-9]+)\s+([0-9]+)$/;
    let rxRes = rx.exec(inputLine);
    if(rxRes === null) {
      throw new Error(`Error parsing input line: ${inputLine}`);
    }
    let lhs = +rxRes[1];
    let rhs = +rxRes[2];
    list1.push(lhs);
    list2.push(rhs);
  }
  day1Input = {
    list1: list1,
    list2: list2,
  };
  return day1Input;
}
