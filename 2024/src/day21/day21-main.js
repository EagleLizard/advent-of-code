
const { Queue } = require('../lib/datastruct/queue');
const { Dirpad } = require('./dirpad');
const { KEYPAD_KEY_TYPE_ENUM, ACTIVATE_KEY_VAL } = require('./keypad-key');
const { Numpad } = require('./numpad');
const { Robot } = require('./robot');

const numpadKeyVals = [
  7, 8, 9,
  4, 5, 6,
  1, 2, 3,
  undefined, 0, 'A',
];
const dirpadKeyVal = [
  undefined, 0, 'A',
  3, 2, 1
];

module.exports = {
  day21Part1,
};

function day21Part1(inputLines) {
  let day21Input = parseInput(inputLines);
  let codes = day21Input.codes;
  let numpad = new Numpad();
  let pressedNumKeys = [];
  numpad.onKeyPress((val) => {
    console.log('onKeyPress');
    console.log(val);
    pressedNumKeys.push(val);
  });
  numpad.onActivate((val) => {
    console.log('onActivate');
    pressedNumKeys.push(val);
    console.log(pressedNumKeys);
  });
  let r1 = new Robot(numpad);
  let r2 = new Robot(r1.dirpad);
  let r3 = new Robot(r2.dirpad);
  let dirpad = r3.dirpad;
  // let r1Moves = r1.pathToKey(0);
  // for(let i = 0; i < r1Moves.length; ++i) {
  //   let r1Mv = r1Moves[i];
  //   let r2Moves = r2.pathToKey(r1Mv);
  //   console.log('r2Moves');
  //   console.log(r2Moves);
  // }
  let robots = [
    r1,
    r2,
    r3,
  ];
  let complexitySum = 0;
  for(let i = 0; i < codes.length; ++i) {
    let code = codes[i];
    console.log(code.join(''));
    // let moves = getMovesToNumpad2(code);
    let complexity = getMovesToNumpad3(code, robots);
    console.log(code);
    console.log({ complexity });
    complexitySum += complexity;
    if(i > -1) {
      // break;
    }
  }

  return complexitySum;
}

function getMovesToNumpad4(srcCode) {
  let code = srcCode.slice();
  let numpad = new Numpad();
  let sPos = numpad.getOrigin();
  // let ePos = numpad.getKeyPos(code[0]);
  let ePos = numpad.getKeyPos(7);
  console.log({ sPos });
  console.log({ ePos });
  let keyPaths = numpad.getMinPaths(ePos, sPos);
  console.log(keyPaths.forEach(keyPath => {
    console.log(movesToStr(keyPath));
  }));
}

function getMovesToNumpad3(srcCode, robots) {
  let code = srcCode.slice();
  // let numpad = new Numpad();
  // let r1 = new Robot(numpad);
  // let r2 = new Robot(r1.dirpad);
  // let r3 = new Robot(r2.dirpad);
  let keysPressed = [];
  // numpad.onKeyPress((keyVal) => {
  //   // console.log(keyVal);
  //   keysPressed.push(keyVal);
  // });
  // numpad.onActivate(() => {
  //   console.log([ ...keysPressed, 'A' ].join(''));
  //   keysPressed = [];
  // });

  // let robots = [
  //   r1,
  //   r2,
  //   r3,
  // ];

  let currKeyCodes = [ code.slice() ];
  let minKeyCodeLen;
  for(let rbi = 0; rbi < robots.length; ++rbi) {
    let robot = robots[rbi];
    let nextKeyCodes = [];
    // console.log({ rbi });
    // console.log(currKeyCodes);
    let currMinKeyCodeLen = undefined;
    for(let ck = 0; ck < currKeyCodes.length; ++ck) {
      let currKeyCode = currKeyCodes[ck];
      // let minCodePaths = robot.findMinCodePaths(currKeyCode, minKeyCodeLen);
      // let minCodePaths = robot.findMinCodePaths3(currKeyCode);
      let minCodePaths = robot.findMinCodePaths3(currKeyCode, currMinKeyCodeLen);
      // console.log(minCodePaths.length);
      for(let mcp = 0; mcp < minCodePaths.length; ++mcp) {
        let minCodePath = minCodePaths[mcp];
        if((currMinKeyCodeLen === undefined) || (minCodePath.length < currMinKeyCodeLen)) {
          currMinKeyCodeLen = minCodePath.length;
        }
        // if(minCodePath.length <= currMinKeyCodeLen && rbi < robots.length - 1) {
        if(minCodePath.length <= currMinKeyCodeLen) {
          nextKeyCodes.push(minCodePath);
        }
      }
    }
    let minKeyCodes = [];
    for(let nkc = 0; nkc < nextKeyCodes.length; ++nkc) {
      let nextKeyCode = nextKeyCodes[nkc];
      if(nextKeyCode.length <= currMinKeyCodeLen) {
        minKeyCodes.push(nextKeyCode);
      }
    }
    // console.log({ 'nextKeyCodes.length': nextKeyCodes.length });
    // console.log({ 'minKeyCodes.length': minKeyCodes.length });
    currKeyCodes = minKeyCodes;
    minKeyCodeLen = currMinKeyCodeLen;
    if(rbi > 0) {
      // break;
    }
  }
  let keyCodeNum = +(code.join('').match(/[0-9]+/));
  console.log(`${minKeyCodeLen} * ${keyCodeNum}`);
  let complexity = minKeyCodeLen * keyCodeNum;
  return complexity;
  // console.log(movesToStr(currKeyCodes[0]));

  // let minCodePaths = r1.findMinCodePaths(code);
  // /*
  //   for each found path, find all of the shortest paths the next robot could take
  // _*/
  // for(let i = 0; i < minCodePaths.length; ++i) {
  //   let minCodePath = minCodePaths[i];
  //   console.log(minCodePath.map(moveToChar).join(''));
  //   let nextMinPaths = r2.findMinCodePaths(minCodePath);
  //   console.log(nextMinPaths.length);
  // }
}
function movesToStr(moves) {
  return moves.map(moveToChar).join('');
}
function moveToChar(move) {
  return '^>v<'[move] ?? move ?? ' ';
}

/* 
2 robots:
  029A: v<<A>>^A<A>AvA<^AA>A<vAAA>^A
     1: v<<A>^>A<A>A<AA>vA^Av<AAA^>A
3 robots;
  029A: <vA<AA>>^AvAA<^A>A<v<A>>^AvA^A<vA>^A<v<A>^A>AAvA^A<v<A>A>^AAAvA<^A>A
     1: v<A<AA>^>AvA^<A>vA^Av<<A>^>AvA^Av<<A>^>AAvA<A^>A<A>Av<A<A>^>AAA<A>vA^A

029A: <vA<AA>>^AvAA<^A>A<v<A>>^AvA^A<vA>^A<v<A>^A>AAvA^A<v<A>A>^AAAvA<^A>A
      v<A<AA>^>AvA^<A>vA^Av<<A>^>AvA^Av<<A>^>AAvA<A^>A<A>Av<A<A>^>AAA<A>vA^A
980A: <v<A>>^AAAvA^A<vA<AA>>^AvAA<^A>A<v<A>A>^AAAvA<^A>A<vA>^A<A>A
      v<<A>^>AAAvA^Av<A<AA>^>AvA^<A>vA^Av<A<A>^>AAA<A>vA^Av<A^>A<A>A
179A: <v<A>>^A<vA<A>>^AAvAA<^A>A<v<A>>^AAvA^A<vA>^AA<A>A<v<A>A>^AAAvA<^A>A
      v<<A>^>Av<A<A>^>AAvA^<A>vA^Av<<A>^>AAvA^Av<A^>AA<A>Av<A<A>^>AAA<A>vA^A
456A: <v<A>>^AA<vA<A>>^AAvAA<^A>A<vA>^A<A>A<vA>^A<A>A<v<A>A>^AAvA<^A>A
379A: <v<A>>^AvA^A<vA<AA>>^AAvA<^A>AAvA^A<vA>^AA<A>A<v<A>A>^AAAvA<^A>A
_*/
function getMovesToNumpad2(srcCode) {
  let numpad = new Numpad();
  let npKeysPressed = [];
  numpad.onKeyPress((key) => {
    npKeysPressed.push(key);
  });
  numpad.onActivate(() => {
    // console.log('onActivate():');
    console.log([ ...npKeysPressed, 'A' ].join(''));
    npKeysPressed = [];
  });
  let r1 = new Robot();
  r1.setKeypad(numpad);
  let r2 = new Robot();
  r2.setKeypad(r1.dirpad);
  let r3 = new Robot();
  r3.setKeypad(r2.dirpad);

  // r3.dirpad.press(0,0);

  let robots = [
    r1,
    r2,
    r3,
  ];
  // r1.onKeyPress((key) => {
  //   console.log(key.val);
  // });
  let robotsSoFar = [];
  let currCode = srcCode.slice();
  for(let rbi = 0; rbi < robots.length; ++rbi) {
    let robot = robots[rbi];
    let keysPressed = [];
    let okpOffFn = robot.onKeyPress((keypadKey) => {
      keysPressed.push(keypadKey.val);
    });
    for(let ck = 0; ck < currCode.length; ++ck) {
      let codeKey = currCode[ck];
      let moves = robot.pathToKey(codeKey);
      /*
        each set of moves needs to also be entered via 'activate'
      _*/
      moves.push('A');
      for(let mvi = 0; mvi < moves.length; ++mvi) {
        let mv = moves[mvi];
        robot.pressKey(mv);
      }
    }
    okpOffFn();
    console.log(
      keysPressed.map(keyPressed => {
        if(keyPressed === 'A') {
          return keyPressed;
        } else {
          return '^>v<'[keyPressed];
        }
      }).join('')
    );
    currCode = keysPressed;
    robotsSoFar.push(robot);
  }
}

function parseInput(inputLines) {
  let codes = [];
  for(let i = 0; i < inputLines.length; ++i) {
    let inputLine = inputLines[i];
    let code = [];
    for(let k = 0; k < inputLine.length; ++k) {
      let c = inputLine[k];
      if(/[0-9]/.test(c)) {
        code.push(+c);
      } else {
        code.push(c);
      }
    }
    codes.push(code);
  }
  let res = {
    codes,
  };
  return res;
}
