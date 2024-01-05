
import { describe, it, expect } from 'vitest';

import { DAY9_INPUT_FILE_NAME } from '../constants';
import { day9Part1, day9Part2 } from './day9-main';
import { loadDayInputTrimmed } from '../util/input-util';

describe('Day 9', () => {
  it('[d9p1] Has the correct solution', async () => {
    let inputLines = await loadDayInputTrimmed(DAY9_INPUT_FILE_NAME);
    let res = day9Part1(inputLines);
    expect(res).toBe(1819125966);
  });
  it('[d9p2] Has the correct solution', async () => {
    let inputLines = await loadDayInputTrimmed(DAY9_INPUT_FILE_NAME);
    let res = day9Part2(inputLines);
    expect(res).toBe(1140);
  });
});
