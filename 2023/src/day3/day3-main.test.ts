
import { describe, it, expect } from 'vitest';

import { DAY3_INPUT_FILE_NAME } from '../constants';
import { day3Part1, day3Part2 } from './day3-main';
import { loadDayInputTrimmed } from '../util/input-util';

describe('Day 3', () => {
  it('[d3p1] Has the correct solution', async () => {
    let inputLines = await loadDayInputTrimmed(DAY3_INPUT_FILE_NAME);
    let res = day3Part1(inputLines);
    expect(res).toBe(525119);
  });
  it('[d3p2] Has the correct solution', async () => {
    let inputLines = await loadDayInputTrimmed(DAY3_INPUT_FILE_NAME);
    let res = day3Part2(inputLines);
    expect(res).toBe(76504829);
  });
});
