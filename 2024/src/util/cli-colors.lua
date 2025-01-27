
local system = require("system")

local tty = system.isatty(io.stdout)

print(tty)

local function fmtFn(srcFn)
  if not tty then
    return function(val)
      return ""..val
    end
  end
  return srcFn
end

local function rgb(r, g, b)
  return fmtFn(function(val)
    return string.format("\x1B[38;2;%d;%d;%dm%s\x1B[39m", r, g, b, val)
  end)
end

local function italic(val)
  return "\x1B[3m"..val.."\x1B[23m"
end
local function dim(val)
  return "\x1B[2m"..val.."\x1B[22m"
end
local function bold(val)
  return "\x1B[1m"..val.."\x1B[22m"
end
local function inverse(val)
  return "\x1B[7m"..val.."\x1B[27m"
end
local function underline(val)
  return "\x1B[4m"..val.."\x1B[24m"
end

local colors = {
  white_bright = rgb(255, 255, 255),
  yellow_light = rgb(199, 196, 62),
  yellow_yellow = rgb(255, 255, 0),
  pear = rgb(191, 226, 55),
  pear_light = rgb(237, 255, 135),
  sea_green = rgb(144, 227, 154),
  pistachio = rgb(165, 206, 108),
  -- green_bright = rgb(140, 247, 123),
  green_bright = rgb(140, 255, 123),
  chartreuse = rgb(127, 255, 0),
  chartreuse_light = rgb(190, 255, 125),
  -- peach = rgb(255, 197, 109),
  -- pink = rgb(247, 173, 209),
  cyan = rgb(142, 250, 253),
}

local cliColorsModule = {
  colors = colors,

  rgb = rgb,
  italic = italic,
  dim = dim,
  bold = bold,
  inverse = inverse,
  underline = underline,
}

return cliColorsModule
