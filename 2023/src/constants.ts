
import path from 'path';

const BASE_DIR = path.resolve(__dirname, '..');

const INPUT_DIR_NAME = 'input';
export const INPUT_DIR_PATH = [
  BASE_DIR,
  INPUT_DIR_NAME,
].join(path.sep);
