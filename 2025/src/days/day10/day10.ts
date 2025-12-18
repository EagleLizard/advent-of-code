
import { AocDayDef } from '../../models/aoc-day-def';

// export const DAY_10_FILE_NAME = 'day10-test1.txt';
export const DAY_10_FILE_NAME = 'day10.txt';

type LightVal = 0 | 1;
type MachineManual = {
  lightsLen: number;
  // lights: LightVal[];
  // buttons: number[][];
  lights: number;
  buttons: number[];
  joltages: number[];
} & {};

export const day10 = {
  file_name: DAY_10_FILE_NAME,
  dayNum: 10,
  part1: day10Pt1
} as const satisfies AocDayDef;

/*
  545 - correct
_*/
function day10Pt1(inputLines: string[]): number {
  /*
  press buttons until we turn on the correct lights
    - there's no point in pushing a button twice.
      The first press either helps reach the desired state, or pushing it twice is equivalent
        to not pushing it at all
    - this can be turned into integer XOR instead of arrays
  _*/
  let machineManuals: MachineManual[] = parseInput(inputLines);
  let seqSum = 0;
  for(let i = 0; i < machineManuals.length; i++) {
    let manual = machineManuals[i];
    // console.log(manualToString(manual));
    let pressedButtons = findButtonPresses(manual);
    // console.log(
    //   pressedButtons.map(button => manualButtonToString(button, manual.lightsLen))
    //     .join(' ')
    // );
    seqSum += pressedButtons.length;
  }
  return seqSum;
}

/*
  DFS - recursive
_*/
function findButtonPresses(manual: MachineManual): number[] {
  let minPresses = Infinity;
  let minSeq: number[] = [];
  /*
    for every button, check every combination with all other buttons until a
      sequence is found that causes the lights to be in the target state.
  _*/

  _findButtonPressesHelper(0, -1, manual.buttons, []);
  return minSeq;
  function _findButtonPressesHelper(
    currLights: number,
    button: number,
    buttons: number[],
    soFar: number[],
  ) {
    if(soFar.length + 1 > minPresses) {
      return;
    }
    // if(button === -1) {
    //   /* initial call _*/
    // }
    // soFar = soFar.slice();
    if(button !== -1) {
      soFar.push(button);
      // push the button
      currLights ^= button;
      // console.log(soFar.map((sfButton) => manualButtonToString(sfButton, manual.lightsLen)));
      if(currLights === manual.lights) {
        // console.log(soFar.map((sfButton) => manualButtonToString(sfButton, manual.lightsLen)));
        if(soFar.length < minPresses) {
          minPresses = soFar.length;
          minSeq = soFar.slice();
        }
        return;
      }
    }
    // console.log(nextButton);
    // console.log(currLights);
    // soFar.push(nextButton);
    for(let i = 0; i < buttons.length; i++) {
      let nextButton = buttons[i];
      let nextButtons = buttons.slice();
      nextButtons.splice(i, 1);
      // let nextSoFar = [ ...soFar,  button ];
      let nextSoFar = soFar.slice();
      _findButtonPressesHelper(currLights, nextButton, nextButtons, nextSoFar);
    }
  }
}

function manualToString(manual: MachineManual): string {
  let lightsStr = '';
  for(let i = 0; i < manual.lightsLen; ++i) {
    let bitPos = manual.lightsLen - 1 - i;
    let bitVal = (manual.lights & (1 << bitPos)) >> bitPos;
    let c: string;
    if(bitVal === 0) {
      c = '.';
    } else if(bitVal === 1) {
      c = '#';
    } else {
      throw new Error(`Invalid bit conversion at ${bitPos} for lights: ${manual.lights}`);
    }
    lightsStr += c;
  }
  let buttonStrs: string[] = [];
  for(let i = 0; i < manual.buttons.length; i++) {
    let button = manual.buttons[i];
    buttonStrs.push(manualButtonToString(button, manual.lightsLen));
    // let lightIdcs: number[] = [];
    // for(let k = 0; k < manual.lightsLen; k++) {
    //   let bitPos = manual.lightsLen - 1 - k;
    //   let bitVal = (button & (1 << bitPos)) >> bitPos;
    //   if(bitVal === 1) {
    //     lightIdcs.push(k);
    //   }
    // }
    // buttonStrs.push(`(${lightIdcs.join(',')})`);
  }
  let buttonStr = buttonStrs.join(' ');
  let joltagesStr = `{${manual.joltages.join(',')}}`;
  return `[${lightsStr}] ${buttonStr} ${joltagesStr}`;
}

function manualButtonToString(button: number, lightsLen: number): string {
  let lightIdcs: number[] = [];
  for(let k = 0; k < lightsLen; k++) {
    let bitPos = lightsLen - 1 - k;
    let bitVal = (button & (1 << bitPos)) >> bitPos;
    if(bitVal === 1) {
      lightIdcs.push(k);
    }
  }
  return `(${lightIdcs.join(',')})`;
}

// function manualToString(manual: MachineManual): string {
//   let lightStr: string = `[${manual.lights.map((lv) => (lv === 0) ? '.' : '#').join('')}]`;
//   let buttonsStr: string = manual.buttons.map((button) => {
//     return `(${button.join(',')})`;
//   }).join(' ');
//   let joltagesStr: string = `{${manual.joltages.join(',')}}`;
//   return `${lightStr} ${buttonsStr} ${joltagesStr}`;
// }

function parseInput(inputLines: string[]) {
  let machineManuals: MachineManual[] = [];
  for(let i = 0; i < inputLines.length; i++) {
    let inputLine = inputLines[i];
    let lightsRx = /^\[(?:[.#]+)\]/;
    let buttonsRx = /\([0-9,]+\)/g;
    let joltagesRx = /\{([0-9,]+)\}/;
    let lights: LightVal[] = [];
    let buttons: number[][] = [];
    let joltages: number[] = [];
    let rawLights = lightsRx.exec(inputLine)?.[0];
    if(rawLights === undefined) {
      throw new Error(`invalid lights diagram in input: ${inputLine}`);
    }
    for(let k = 1; k < rawLights.length - 1; k++) {
      let c = rawLights[k];
      if(c === '#') {
        lights.push(1);
      } else if(c === '.') {
        lights.push(0);
      } else {
        throw new Error(`Invalid lights ${rawLights} in input: ${inputLine}`);
      }
    }
    let buttonRxResArr: RegExpExecArray | null;
    while((buttonRxResArr = buttonsRx.exec(inputLine)) !== null) {
      let rawButton = buttonRxResArr[0].substring(1, buttonRxResArr[0].length - 1);
      let rawButtonWires = rawButton.split(',');
      let currButtonWires: number[] = [];
      for(let k = 0; k < rawButtonWires.length; k++) {
        let rawWire = rawButtonWires[k];
        let buttonWire = +rawWire;
        if(isNaN(buttonWire)) {
          throw new Error(`Invalid button ${buttonRxResArr[0]} in input: ${inputLine}`);
        }
        currButtonWires.push(buttonWire);
      }
      buttons.push(currButtonWires);
    }
    let rawJoltagesStr = joltagesRx.exec(inputLine)?.[0];
    if(rawJoltagesStr === undefined) {
      throw new Error(`Invalid joltages in input: ${inputLine}`);
    }
    let rawJoltages = rawJoltagesStr.substring(1, rawJoltagesStr.length - 1).split(',');
    for(let k = 0; k < rawJoltages.length; k++) {
      let rawJoltage = rawJoltages[k];
      let joltage = + rawJoltage;
      if(isNaN(joltage)) {
        throw new Error(`Invalid joltage ${rawJoltage} in input: ${inputLine}`);
      }
      joltages.push(joltage);
    }

    /*
      now that we have the input, convert to binary representation
    _*/
    let lightsLen = lights.length;
    let lightsVal: number = 0;
    let buttonVals: number[] = [];
    // console.log(rawLights);
    for(let i = 0; i < lights.length; i++) {
      let bitPos = lights.length - i - 1;
      lightsVal += (2 ** bitPos) * lights[i];
    }
    for(let i = 0; i < buttons.length; i++) {
      let buttonVal = 0;
      let button = buttons[i];
      for(let k = 0; k < button.length; k++) {
        /*
        flip ON for the bit at pos lightsLen - button[k] - 1
        _*/
        buttonVal |= 1 << (lightsLen - 1 - button[k]);
      }
      // console.log(`> ${buttonVal}`);
      buttonVals.push(buttonVal);
    }

    let machineManual: MachineManual = {
      lightsLen: lightsLen,
      lights: lightsVal,
      buttons: buttonVals,
      joltages: joltages,
    };
    machineManuals.push(machineManual);
  }
  return machineManuals;
}
