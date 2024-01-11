
import { describe, it, expect } from 'vitest';

import { DAY2_INPUT_FILE_NAME } from '../constants';
import { day2p1, day2p2 } from './day2-main';
import { loadDayInputTrimmed } from '../util/input-util';

describe('day 2', () => {
  it('[d2p1] Has the correct solution', async () => {
    let inputLines = await loadDayInputTrimmed(DAY2_INPUT_FILE_NAME);
    let res = day2p1(inputLines);
    expect(res).toBe(2879);
  });
  it('[d2p2] Has the correct solution', async () => {
    let inputLines = await loadDayInputTrimmed(DAY2_INPUT_FILE_NAME);
    let res = day2p2(inputLines);
    expect(res).toBe(65122);
  });
});
