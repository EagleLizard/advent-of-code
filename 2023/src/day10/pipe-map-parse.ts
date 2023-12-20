import { PipeMap } from './pipe-map';

export function parsePipeMap(inputLines: string[]): PipeMap {
  let pipeMap = new PipeMap(inputLines[0].length, inputLines.length);
  for(let y = 0; y < inputLines.length; ++y) {
    let currLine = inputLines[y];
    for(let x = 0; x < currLine.length; ++x) {
      let currCell = currLine[x];
      let currPipePart = PipeMap.getPipePart(currCell, x, y);
      pipeMap.setPipePart(currPipePart, x, y);
    }
  }
  return pipeMap;
}
