
import { describe, it, expect } from 'vitest';

import { DAY1_INPUT_FILE_NAME } from '../constants';
import { day1p1, day1p2 } from './day1-main';
import { loadDayInputTrimmed } from '../util/input-util';

describe('day 1', () => {

  it('[d1p1] Has the correct solution', async () => {
    let inputLines = await loadDayInputTrimmed(DAY1_INPUT_FILE_NAME);
    let res = await day1p1(inputLines);
    expect(res).toBe(54081);
  });
  it('[d1p2] Has the correct solution', async () => {
    let inputLines = await loadDayInputTrimmed(DAY1_INPUT_FILE_NAME);
    let res = await day1p2(inputLines);
    expect(res).toBe(54649);
  });
});
