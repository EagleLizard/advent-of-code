import { PipePart } from './pipe-part';

/*
  |
  -
  L
  J
  7
  F
  .
  S
*/
export enum PIPE_PART_ENUM {
  VERTICAL = 'VERTICAL',
  HORIZONTAL = 'HORIZONTAL',
  NE_BEND = 'NE_BEND',
  NW_BEND = 'NW_BEND',
  SW_BEND = 'SW_BEND',
  SE_BEND = 'SE_BEND',
  GROUND = 'GROUND',
  START = 'START',
  INIT = 'INIT',
}

const PIPE_CHAR_TO_PART_MAP: Record<string, PIPE_PART_ENUM> = {
  '|': PIPE_PART_ENUM.VERTICAL,
  '-': PIPE_PART_ENUM.HORIZONTAL,
  'L': PIPE_PART_ENUM.NE_BEND,
  'J': PIPE_PART_ENUM.NW_BEND,
  '7': PIPE_PART_ENUM.SW_BEND,
  'F': PIPE_PART_ENUM.SE_BEND,
  '.': PIPE_PART_ENUM.GROUND,
  'S': PIPE_PART_ENUM.START,
};

type Point = {
  x: number,
  y: number,
};

export class PipeMap {

  public pipeMatrix: PipePart[][];
  public start: PipePart;

  constructor(
    public width: number,
    public height: number,
  ) {
    this.pipeMatrix = Array(height).fill(0).map(() => {
      return Array(width).fill(0).map(() => {
        return getDefaultPipePart();
      });
    });
    this.start = getDefaultPipePart();
  }

  setPipePart(pipePart: PipePart, x: number, y: number) {
    if(pipePart.kind === PIPE_PART_ENUM.START) {
      this.start = pipePart;
    }
    this.pipeMatrix[y][x] = pipePart;
  }

  at(x: number, y: number): PipePart {
    return this.pipeMatrix[y][x];
  }

  getAdjacentPipes(pipePart: PipePart): PipePart[] {
    let adjacentPipes: PipePart[];
    const { x, y } = pipePart;
    let pipePositions: Point[] = [
      {
        x,
        y: y - 1,
      },
      {
        x: x + 1,
        y,
      },
      {
        x,
        y: y + 1,
      },
      {
        x: x - 1,
        y,
      },
    ].filter(point => {
      return (
        (point.x >= 0)
        && (point.x < this.width)
        && (point.y >= 0)
        && (point.y < this.height)
      );
    })
    ;

    adjacentPipes = pipePositions.reduce((acc, curr) => {
      let part = this.at(curr.x, curr.y);
      if(part.kind !== PIPE_PART_ENUM.GROUND) {
        acc.push(part);
      }
      return acc;
    }, [] as PipePart[]);

    return adjacentPipes;
  }

  static getPipePart(char: string, x: number, y: number): PipePart {
    let pipePart: PipePart;
    let pipeKind: PIPE_PART_ENUM;
    if((pipeKind = PIPE_CHAR_TO_PART_MAP[char]) === undefined) {
      throw new Error(`Invalid pipe part: ${char}`);
    }

    pipePart = new PipePart(char, pipeKind, x, y);

    return pipePart;
  }
}

function getDefaultPipePart(): PipePart {
  return new PipePart();
}
