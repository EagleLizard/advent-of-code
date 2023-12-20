
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

export type PipePart = {
  char: string;
  kind: PIPE_PART_ENUM;
  north: PipePart | undefined,
  east: PipePart | undefined,
  south: PipePart | undefined,
  west: PipePart | undefined,
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

  static getPipePart(char: string, x: number, y: number): PipePart {
    let pipePart: PipePart;
    let pipeKind: PIPE_PART_ENUM;
    if((pipeKind = PIPE_CHAR_TO_PART_MAP[char]) === undefined) {
      throw new Error(`Invalid pipe part: ${char}`);
    }

    pipePart = {
      char,
      kind: pipeKind,
      north: undefined,
      east: undefined,
      south: undefined,
      west: undefined,
      x,
      y,
    };

    return pipePart;
  }

  setPipePart(pipePart: PipePart, x: number, y: number) {
    if(pipePart.kind === PIPE_PART_ENUM.START) {
      this.start.x = x;
      this.start.y = y;
    }
    this.pipeMatrix[y][x] = pipePart;
  }

  at(x: number, y: number): PipePart {
    return this.pipeMatrix[y][x];
  }

  getAdjacentPipes(x: number, y: number): PipePart[] {
    let adjacentPipes: PipePart[];
    let pipePositions: Point[] = [
      {
        x: x - 1,
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
      const { x, y } = point;
      return (
        (x > 0)
        && (x < this.width)
        && (y > 0)
        && (y < this.height)
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
}

function getDefaultPipePart(): PipePart {
  return {
    char: '',
    kind: PIPE_PART_ENUM.INIT,
    north: undefined,
    east: undefined,
    south: undefined,
    west: undefined,
    x: -1,
    y: -1,
  };
}
