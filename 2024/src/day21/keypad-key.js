
let keypadKeyIdCounter = 0;

const ACTIVATE_KEY_VAL = 'A';

const KEYPAD_KEY_TYPE_ENUM = {
  empty: 0,
  val: 1, 
  activate: 2,
};

module.exports = {
  KEYPAD_KEY_TYPE_ENUM,
  ACTIVATE_KEY_VAL,
  KeypadKey,
};

/**
 * @class
 */
function KeypadKey(keyValue) {
  let self = this;
  // /** @property {string} type */
  self.type = KEYPAD_KEY_TYPE_ENUM.val;
  if(keyValue === undefined) {
    self.type = KEYPAD_KEY_TYPE_ENUM.empty;
  } else if(keyValue === ACTIVATE_KEY_VAL) {
    self.type = KEYPAD_KEY_TYPE_ENUM.activate;
  }
  self.val = keyValue;
  self.id = keypadKeyIdCounter++;
}
