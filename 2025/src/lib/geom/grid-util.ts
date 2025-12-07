
export const gridUtil = {
  copy: copyGrid,
} as const;

function copyGrid<T>(srcGrid: T[][]): T[][] {
  let gridCpy: T[][] = [];
  let rowLen = srcGrid[0].length;
  for(let y = 0; y < srcGrid.length; y++) {
    let row = [];
    for(let x = 0; x < rowLen; x++) {
      row.push(srcGrid[y][x]);
    }
    gridCpy.push(row);
  }
  return gridCpy;
}
