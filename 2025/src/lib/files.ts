
import fsp from 'fs/promises';
import path from 'node:path';
import { INPUT_DIR } from './constants';

export const files = {
  loadInputLines,
} as const;

async function loadInputLines(inputFileName: string): Promise<string[]> {
  let inputFilePath: string = [
    INPUT_DIR,
    inputFileName,
  ].join(path.sep);
  let fileData: string = (await fsp.readFile(inputFilePath)).toString();
  let lines = fileData.split('\n');
  if(lines[lines.length - 1].length === 0) {
    /* remove last line if empty _*/
    lines.splice(-1);
  }
  return lines;
}
