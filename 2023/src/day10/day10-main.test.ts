
import { describe, it, expect } from 'vitest';

import {
  DAY10_INPUT_FILE_NAME,
  DAY10_TEST1_INPUT_FILE_NAME,
  DAY10_TEST2_INPUT_FILE_NAME,
} from '../constants';
import { day10Part1 } from './day10-main';
import { loadDayInputTrimmed } from '../util/input-util';

describe('Day 10', () => {
  it('[d10p1] test1 - has the correct solution', async () => {
    let inputLines = await loadDayInputTrimmed(DAY10_TEST1_INPUT_FILE_NAME);
    let res = day10Part1(inputLines);
    expect(res).toBe(4);
  });
  it('[d10p1] test2 - has the correct solution', async () => {
    let inputLines = await loadDayInputTrimmed(DAY10_TEST2_INPUT_FILE_NAME);
    let res = day10Part1(inputLines);
    expect(res).toBe(8);
  });
  it('[d10p1] Has the correct solution', async () => {
    let inputLines = await loadDayInputTrimmed(DAY10_INPUT_FILE_NAME);
    let res = day10Part1(inputLines);
    expect(res).toBe(6820);
  });
});
