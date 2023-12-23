
import { PIPE_PART_ENUM } from './pipe-map';

let pipePartIdCounter = 1;

export class PipePart {
  id: number;
  char: string;
  kind: PIPE_PART_ENUM;
  x: number;
  y: number;
  north?: PipePart;
  east?: PipePart;
  south?: PipePart;
  west?: PipePart;
  constructor(
    char?: string,
    kind?: PIPE_PART_ENUM,
    x?: number,
    y?: number,
    north?: PipePart,
    east?: PipePart,
    south?: PipePart,
    west?: PipePart
  ) {
    this.id = pipePartIdCounter++;

    this.char = char ?? '';
    this.kind = kind ?? PIPE_PART_ENUM.INIT;
    this.x = x ?? -1;
    this.y = y ?? -1;
    this.north = north ?? undefined;
    this.east = east ?? undefined;
    this.south = south ?? undefined;
    this.west = west ?? undefined;
  }

  getConnectedPipes(): PipePart[] {
    let adjPipes: PipePart[] = [];

    if(this.north !== undefined) {
      adjPipes.push(this.north);
    }
    if(this.south !== undefined) {
      adjPipes.push(this.south);
    }
    if(this.east !== undefined) {
      adjPipes.push(this.east);
    }
    if(this.west !== undefined) {
      adjPipes.push(this.west);
    }

    return adjPipes;
  }

}
