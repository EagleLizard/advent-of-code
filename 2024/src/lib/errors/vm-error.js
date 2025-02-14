
class VmError extends Error {
  constructor(...params) {
    super(...params);
    this.name = 'VmError';
  }
}

module.exports = {
  VmError,
};
