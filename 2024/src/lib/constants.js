
const path = require('path');

const BASE_DIR = path.resolve(__dirname, '..', '..');

const INPUT_DIR = [
  BASE_DIR,
  'input'
].join(path.sep);

module.exports = {
  BASE_DIR,
  INPUT_DIR,
};
