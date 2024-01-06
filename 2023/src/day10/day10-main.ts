import { getIntuitiveTimeString } from '../util/format-util';
import { loadDayInput } from '../util/input-util';
import { runAndTime } from '../util/timer';
import { PIPE_PART_ENUM, PipeMap } from './pipe-map';
import { PipePart } from './pipe-part';
import { parsePipeMap } from './pipe-map-parse';
import { DAY10_INPUT_FILE_NAME } from '../constants';

enum DIRECTION_ENUM {
  NORTH = 'NORTH',
  EAST = 'EAST',
  SOUTH = 'SOUTH',
  WEST = 'WEST',
}

export async function day10Main() {
  let part1StepsToMiddlePipe: number | undefined;
  let inputLines = (await loadDayInput(DAY10_INPUT_FILE_NAME))
    .map(inputLine => inputLine.trim())
    .filter(inputLine => inputLine.length > 0)
  ;
  let funTime = await runAndTime(() => {
    part1StepsToMiddlePipe = day10Part1(inputLines);
  });
  console.log('steps to middle pipe:');
  console.log(part1StepsToMiddlePipe);
  console.log(`\n[day10p1] took: ${getIntuitiveTimeString(funTime)}`);
}

export function day10Part1(inputLines: string[]): number {
  let pipeMap = parsePipeMap(inputLines);

  // pipeMap.pipeMatrix.forEach(currRow => {
  //   currRow.forEach(currCell => {
  //     process.stdout.write(currCell.char);
  //   });
  //   console.log('');
  // });

  pipeMap = connectPipes(pipeMap);

  let visitedMap: Record<number, PipePart | undefined> = {};

  let currPipe: PipePart = pipeMap.start;
  let soFar: PipePart[] = [];
  while(visitedMap[currPipe.id] === undefined) {
    soFar.push(currPipe);
    visitedMap[currPipe.id] = currPipe;
    let adjPipes = currPipe.getConnectedPipes();
    let nextPipe: PipePart | undefined;
    for(let i = 0; i < adjPipes.length; ++i) {
      let adjPipe = adjPipes[i];
      if(visitedMap[adjPipe.id] === undefined) {
        nextPipe = adjPipe;
      }
    }
    if(nextPipe !== undefined) {
      currPipe = nextPipe;
    }
  }

  let stepsToMidPipe = soFar.length / 2;
  return stepsToMidPipe;
}

function connectPipes(pipeMap: PipeMap) {
  let visitedMap: Record<number, boolean> = {};
  let allPipes = pipeMap.pipeMatrix.reduce((acc, curr) => {
    return [ ...acc, ...curr ];
  }, [] as PipePart[]);
  for(let i = 0; i < allPipes.length; ++i) {
    let currPipe = allPipes[i];
    let adjacentPipes = pipeMap.getAdjacentPipes(currPipe);

    for(let k = 0; k < adjacentPipes.length; ++k) {
      let adjacentPipe = adjacentPipes[k];
      let xDiff = adjacentPipe.x - currPipe.x;
      let yDiff = adjacentPipe.y - currPipe.y;
      let direction: DIRECTION_ENUM | undefined;
      direction = getDirection(xDiff, yDiff);
      if(isAdjacentConnection(currPipe, adjacentPipe, direction)) {
        switch(direction) {
          case DIRECTION_ENUM.NORTH:
            currPipe.north = adjacentPipe;
            break;
          case DIRECTION_ENUM.SOUTH:
            currPipe.south = adjacentPipe;
            break;
          case DIRECTION_ENUM.EAST:
            currPipe.east = adjacentPipe;
            break;
          case DIRECTION_ENUM.WEST:
            currPipe.west = adjacentPipe;
            break;
          default:
            throw new Error(`invalid adjacent pipe direction: ${direction}`);
        }
      }
    }

    visitedMap[currPipe.id] = true;
  }
  return pipeMap;
}

function isAdjacentConnection(sourcePipe: PipePart, destPipe: PipePart, direction: DIRECTION_ENUM): boolean {
  switch(direction) {
    case DIRECTION_ENUM.NORTH:
      return (
        sourcePipe.kind === PIPE_PART_ENUM.VERTICAL
        || sourcePipe.kind === PIPE_PART_ENUM.NE_BEND
        || sourcePipe.kind === PIPE_PART_ENUM.NW_BEND
        || sourcePipe.kind === PIPE_PART_ENUM.START
      ) && (
        destPipe.kind === PIPE_PART_ENUM.VERTICAL
        || destPipe.kind === PIPE_PART_ENUM.SW_BEND
        || destPipe.kind === PIPE_PART_ENUM.SE_BEND
        || destPipe.kind === PIPE_PART_ENUM.START
      );
    case DIRECTION_ENUM.EAST:
      return (
        sourcePipe.kind === PIPE_PART_ENUM.HORIZONTAL
        || sourcePipe.kind === PIPE_PART_ENUM.NE_BEND
        || sourcePipe.kind === PIPE_PART_ENUM.SE_BEND
        || sourcePipe.kind === PIPE_PART_ENUM.START
      ) && (
        destPipe.kind === PIPE_PART_ENUM.HORIZONTAL
        || destPipe.kind === PIPE_PART_ENUM.NW_BEND
        || destPipe.kind === PIPE_PART_ENUM.SW_BEND
        || destPipe.kind === PIPE_PART_ENUM.START
      );
    case DIRECTION_ENUM.SOUTH:
      return (
        sourcePipe.kind === PIPE_PART_ENUM.VERTICAL
        || sourcePipe.kind === PIPE_PART_ENUM.SW_BEND
        || sourcePipe.kind === PIPE_PART_ENUM.SE_BEND
        || sourcePipe.kind === PIPE_PART_ENUM.START
      ) && (
        destPipe.kind === PIPE_PART_ENUM.VERTICAL
        || destPipe.kind === PIPE_PART_ENUM.NW_BEND
        || destPipe.kind === PIPE_PART_ENUM.NE_BEND
        || destPipe.kind === PIPE_PART_ENUM.START
      );
    case DIRECTION_ENUM.WEST:
      return (
        sourcePipe.kind === PIPE_PART_ENUM.HORIZONTAL
        || sourcePipe.kind === PIPE_PART_ENUM.NW_BEND
        || sourcePipe.kind === PIPE_PART_ENUM.SW_BEND
        || sourcePipe.kind === PIPE_PART_ENUM.START
      ) && (
        destPipe.kind === PIPE_PART_ENUM.HORIZONTAL
        || destPipe.kind === PIPE_PART_ENUM.NE_BEND
        || destPipe.kind === PIPE_PART_ENUM.SE_BEND
        || destPipe.kind === PIPE_PART_ENUM.START
      );
    default:
      return false;
  }
}

function getDirection(x: number, y: number): DIRECTION_ENUM {
  if(x === 0 && y === -1) {
    return DIRECTION_ENUM.NORTH;
  }
  if(x === 1 && y === 0) {
    return DIRECTION_ENUM.EAST;
  }
  if(x === 0 && y === 1) {
    return DIRECTION_ENUM.SOUTH;
  }
  if(x === -1 && y === 0) {
    return DIRECTION_ENUM.WEST;
  }
  throw new Error(`Invalid direction: ${x}, ${y}`);
}
