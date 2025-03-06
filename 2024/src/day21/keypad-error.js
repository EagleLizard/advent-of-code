
module.exports = {
  KeypadError,
};

function KeypadError(message) {
  let self = this;
  Error.captureStackTrace(self, KeypadError);
  self.message = message;
  self.name = 'KeypadError';
}

KeypadError.prototype = Object.create(Error.prototype);
KeypadError.prototype.constructor = KeypadError;
