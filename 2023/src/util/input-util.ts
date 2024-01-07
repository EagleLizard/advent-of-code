
import path from 'path';

import { INPUT_DIR_PATH } from '../constants';
import { readFile } from 'fs/promises';

export async function loadDayInput(inputFileName: string) {
  let dataBuf: Buffer;
  let dataStr: string;
  let dayInput: string[];
  let inputFilePath: string;

  inputFilePath = [
    INPUT_DIR_PATH,
    inputFileName,
  ].join(path.sep);
  dataBuf = await readFile(inputFilePath);
  dataStr = dataBuf.toString();
  dayInput = dataStr.split('\n')
    // .map(inputLine => inputLine.trim())
    .filter(inputLine => inputLine.length > 0);

  return dayInput;
}

export async function loadDayInputTrimmed(inputFileName: string): Promise<string[]> {
  let inputLines = await loadDayInput(inputFileName);
  return inputLines
    .map(inputLine => inputLine.trim())
    .filter(inputLine => inputLine.length > 0)
  ;
}

export function getInputFilePath(inputFileName: string): string {
  return [
    INPUT_DIR_PATH,
    inputFileName,
  ].join(path.sep);
}
