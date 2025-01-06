
local function printf(s, ...)
  io.write(string.format(s, ...))
end

local ioUtilModule = {
  printf = printf,
}

return ioUtilModule
