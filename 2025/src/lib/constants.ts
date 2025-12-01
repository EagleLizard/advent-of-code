
import path from 'node:path';

const BASE_DIR = path.resolve(__dirname, '..', '..');

const INPUT_DIR = [
  BASE_DIR,
  'src',
  'input',
].join(path.sep);

export {
  BASE_DIR,
  INPUT_DIR
};
