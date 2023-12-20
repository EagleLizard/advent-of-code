import { getIntuitiveTimeString } from '../util/format-util';
import { loadDayInput } from '../util/input-util';
import { Timer, runAndTime } from '../util/timer';
import { PIPE_PART_ENUM, PipeMap, PipePart } from './pipe-map';
import { parsePipeMap } from './pipe-map-parse';


enum DIRECTION_ENUM {
  NORTH = 'NORTH',
  EAST = 'EAST',
  SOUTH = 'SOUTH',
  WEST = 'WEST',
}

const DAY10_INPUT_FILE_NAME = 'day10_test1.txt';

export async function day10Main() {
  let inputLines = (await loadDayInput(DAY10_INPUT_FILE_NAME))
    .map(inputLine => inputLine.trim())
    .filter(inputLine => inputLine.length > 0)
  ;
  let pipeMap = parsePipeMap(inputLines);
  let funTime = runAndTime(() => {
    day10Part1(pipeMap);
  });
  console.log(`\n[day10p1] took: ${getIntuitiveTimeString(funTime)}`);
}

function day10Part1(pipeMap: PipeMap) {
  console.log('\n~ Day 10 Part 1 ~');
  const start = pipeMap.start;
  console.log(pipeMap.start);
  let adjacentPipes = pipeMap.getAdjacentPipes(start.x, start.y);

  for(let i = 0; i < adjacentPipes.length; ++i) {
    let currPipe = adjacentPipes[i];
    let xDiff = currPipe.x - start.x;
    let yDiff = currPipe.y - start.y;
    let direction = getDirection(xDiff, yDiff);

    if(isAdjacentConnection(currPipe, direction)) {
      switch(direction) {
        case DIRECTION_ENUM.NORTH:
          start.north = currPipe;
          break;
        case DIRECTION_ENUM.SOUTH:
          start.south = currPipe;
          break;
        case DIRECTION_ENUM.EAST:
          start.east = currPipe;
          break;
        case DIRECTION_ENUM.WEST:
          start.west = currPipe;
          break;
      }
    }
  }
  console.log(start);
}

function isAdjacentConnection(pipe: PipePart, direction: DIRECTION_ENUM): boolean {
  /*
    figure out which popes connect.
    north: | 7 F
    east: - J 7
    south: | J L
    west: - L F
  */
  switch(direction) {
    case DIRECTION_ENUM.NORTH:
      return (
        pipe.kind === PIPE_PART_ENUM.VERTICAL
        || pipe.kind === PIPE_PART_ENUM.SW_BEND
        || pipe.kind === PIPE_PART_ENUM.SE_BEND
      );
    case DIRECTION_ENUM.EAST:
      return (
        pipe.kind === PIPE_PART_ENUM.HORIZONTAL
        || pipe.kind === PIPE_PART_ENUM.NW_BEND
        || pipe.kind === PIPE_PART_ENUM.NE_BEND
      );
    case DIRECTION_ENUM.SOUTH:
      return (
        pipe.kind === PIPE_PART_ENUM.VERTICAL
        || pipe.kind === PIPE_PART_ENUM.NW_BEND
        || pipe.kind === PIPE_PART_ENUM.NE_BEND
      );
    case DIRECTION_ENUM.WEST:
      return (
        pipe.kind === PIPE_PART_ENUM.HORIZONTAL
        || pipe.kind === PIPE_PART_ENUM.NE_BEND
        || pipe.kind === PIPE_PART_ENUM.SE_BEND
      );
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
