const { Keypad, KEYPAD_KEY_TYPE_ENUM, KeypadError } = require('./keypad');

const DIRPAD_KEY_VALS = [
  undefined, 0, 'A',
  3, 2, 1
];

module.exports = {
  Dirpad,
};

function Dirpad() {
  let self = this;
  self.keyPressFn = undefined;
  self.activateFn = undefined;
  self.keypad = new Keypad();
  for(let i = 0; i < DIRPAD_KEY_VALS.length; ++i) {
    let keyVal = DIRPAD_KEY_VALS[i];
    let keyPos = self.keypad.addKey(keyVal);
    let keypadKey = self.keypad.getKeyAt(keyPos.x, keyPos.y);
    switch(keypadKey.type) {
      case KEYPAD_KEY_TYPE_ENUM.activate:
        self.keypad.onKeyPress(keyPos.x, keyPos.y, self.handleActivate.bind(self));
        break;
      case KEYPAD_KEY_TYPE_ENUM.val:
        self.keypad.onKeyPress(keyPos.x, keyPos.y, self.handleKeyPress.bind(self));
        break;
      case KEYPAD_KEY_TYPE_ENUM.empty:
        self.keypad.onKeyPress(keyPos.x, keyPos.y, self.handleEmptyKeyPress.bind(self));
        break;
    }
  }
}

Dirpad.prototype.handleActivate = function() {
  let self = this;
  self.activateFn?.();
};
Dirpad.prototype.handleKeyPress = function() {
  let self = this;
  self.keyPressFn?.();
};
Dirpad.prototype.handleEmptyKeyPress = function() {
  throw new KeypadError('Empty key pressed');
};
