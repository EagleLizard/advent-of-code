
const colors = {
  white_bright: rgb(255, 255, 255),
  yellow_light: rgb(199, 196, 62),
  yellow_yellow: rgb(255, 255, 0),
  pear: rgb(191, 226, 55),
  pear_light: rgb(237, 255, 135),
  sea_green: rgb(144, 227, 154),
  pistachio: rgb(165, 206, 108),
  // green_bright: rgb(140, 247, 123),
  green_bright: rgb(140, 255, 123),
  chartreuse: rgb(127, 255, 0),
  chartreuse_light: rgb(190, 255, 125),
  peach: rgb(255, 197, 109),
  peach_light: rgb(255, 197, 109),
  pink: rgb(247, 173, 209),
  cyan: rgb(142, 250, 253),
};

module.exports = {
  colors,

  rgb,
  italic,
  dim,
  bold,
  inverse,
  underline,
};

function rgb(r, g, b) {
  return fmtFn((val) => {
    return `\x1B[38;2;${r};${g};${b}m${val}\x1B[39m`;
  });
}
function italic(val) {
  return `\x1B[3m${val}\x1B[23m`;
}
function dim(val) {
  return `\x1B[2m${val}\x1B[22m`;
}
function bold(val) {
  return `\x1B[1m${val}\x1B[22m`;
}
function inverse(val) {
  return `\x1B[7m${val}\x1B[27m`;
}
function underline(val) {
  return `\x1B[4m${val}\x1B[24m`;
}

function fmtFn(srcFn) {
  if(!process.stdout.isTTY) {
    return (val) => {
      return `${val}`;
    };
  }
  return srcFn;
}
