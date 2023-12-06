
import path from 'path';
import { readFile } from 'fs/promises';

import { INPUT_DIR_PATH } from '../constants';

const DAY1_INPUT_FILE_NAME = 'day1.txt';
const DAY1_INPUT_FILE_PATH = [
  INPUT_DIR_PATH,
  DAY1_INPUT_FILE_NAME,
].join(path.sep);

export async function day1() {
  let inputStrs: string[];
  console.log('~ Day 1 ~');
  inputStrs = await laodDay1Input();
  console.log(inputStrs);
}

async function laodDay1Input() {
  let dataBuf: Buffer;
  let dataStr: string;
  let day1Input: string[];
  dataBuf = await readFile(DAY1_INPUT_FILE_PATH);
  dataStr = dataBuf.toString();
  day1Input = dataStr.split('\n');
  return day1Input;
}
