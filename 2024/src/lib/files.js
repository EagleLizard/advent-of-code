
const fs = require('fs');
const path = require('path');

const { INPUT_DIR } = require('./constants');

module.exports = {
  getInputLines,
};

function getInputLines(inputFileName) {
  let inputFilePath = [
    INPUT_DIR,
    inputFileName
  ].join(path.sep);
  let fileData = fs.readFileSync(inputFilePath).toString();
  let lines = fileData.split("\n");
  /* omit one newline if exists for parity */
  if(lines[lines.length - 1].length === 0) {
    lines.splice(-1);
  }
  return lines;
}
