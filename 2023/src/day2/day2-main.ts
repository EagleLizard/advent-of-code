
import { isNumber, isString } from '../util/validate-primitives';

type GameHand = {
  red: number,
  blue: number,
  green: number,
};
type BagContents = GameHand;

type Game = {
  gameId: number,
  hands: GameHand[],
};

export function day2p2(inputLines: string[]): number {
  let allGames: Game[];
  let allMinBags: BagContents[];
  let minBagPowerSetSum: number;
  allGames = inputLines.map(parseGameLine);
  allMinBags = allGames.reduce((acc, currGame) => {
    let minBag: BagContents;
    minBag = {
      red: -Infinity,
      green: -Infinity,
      blue: -Infinity,
    };
    for(let i = 0; i < currGame.hands.length; ++i) {
      let currHand: GameHand;
      currHand = currGame.hands[i];
      minBag.red = Math.max(minBag.red, currHand.red);
      minBag.green = Math.max(minBag.green, currHand.green);
      minBag.blue = Math.max(minBag.blue, currHand.blue);
    }
    acc.push(minBag);
    return acc;
  }, [] as BagContents[]);
  minBagPowerSetSum = allMinBags.reduce((acc, currMinBag) => {
    let currPowerSetSum: number;
    currPowerSetSum = currMinBag.red * currMinBag.green * currMinBag.blue;
    return acc + currPowerSetSum;
  }, 0);
  return minBagPowerSetSum;
}

export function day2p1(inputLines: string[]): number {
  let idSum: number;
  let allGames: Game[];
  let possibleGames: Game[];
  let bagContents: BagContents;
  allGames = [];
  for(let i = 0; i < inputLines.length; ++i) {
    let inputLine: string;
    let currGame: Game;
    inputLine = inputLines[i];
    currGame = parseGameLine(inputLine);
    allGames.push(currGame);
  }
  bagContents = {
    red: 12,
    green: 13,
    blue: 14,
  };
  possibleGames = allGames.reduce((acc, currGame) => {
    if(isPossibleGame(currGame, bagContents)) {
      acc.push(currGame);
    }
    return acc;
  }, [] as Game[]);

  idSum = possibleGames.reduce((acc, currGame) => {
    return acc + currGame.gameId;
  }, 0);
  return idSum;
}

function isPossibleGame(game: Game, bagContents: BagContents): boolean {
  return game.hands.every(hand => {
    return isPossibleHand(hand, bagContents);
  });
}

function isPossibleHand(hand: GameHand, bagContents: BagContents): boolean {
  return (
    (hand.red <= bagContents.red)
    && (hand.green <= bagContents.green)
    && (hand.blue <= bagContents.blue)
  );
}

function parseGameLine(line: string): Game {
  let game: Game;
  let gameHands: GameHand[];
  let lineParts: string[];
  let gamePart: string;
  let cubesPart: string;
  let gameIdStr: string | undefined;
  let gameId: number;
  let gameHandStrs: string[];

  lineParts = line.split(':');
  gamePart = lineParts[0];
  cubesPart = lineParts[1].trim();

  gameIdStr = gamePart.split(' ').pop();
  if(
    !isString(gameIdStr)
    || !isNumber(gameId = +(gameIdStr))
  ) {
    throw new Error(`Invalid gameId: ${gameIdStr}`);
  }
  gameHandStrs = cubesPart.split(';')
    .map(handStr => {
      return handStr.trim();
    });
  gameHands = [];
  for(let i = 0; i < gameHandStrs.length; ++i) {
    let gameHandStr: string;
    let gameHand: GameHand;
    gameHandStr = gameHandStrs[i];
    gameHand = parseGameHand(gameHandStr);
    gameHands.push(gameHand);
  }
  game = {
    gameId,
    hands: gameHands,
  };
  return game;
}

function parseGameHand(gameHandStr: string): GameHand {
  let gameHand: GameHand;
  let handStrs: string[];
  handStrs = !gameHandStr.includes(',')
    ? [ gameHandStr ]
    : gameHandStr.split(',').map(cube_str => {
      return cube_str.trim();
    })
  ;
  gameHand = {
    red: 0,
    blue: 0,
    green: 0,
  };
  for(let i = 0; i < handStrs.length; ++i) {
    let handStr: string;
    let handParts: string[];
    let cubeCount: number;
    handStr = handStrs[i];
    handParts = handStr.split(' ');
    cubeCount = +handParts[0];
    switch(handParts[1]) {
      case 'red':
        gameHand.red = cubeCount;
        break;
      case 'blue':
        gameHand.blue = cubeCount;
        break;
      case 'green':
        gameHand.green = cubeCount;
        break;
      default:
        throw new Error(`Invalide hand part: ${handParts[1]}`);
    }
  }
  return gameHand;
}
