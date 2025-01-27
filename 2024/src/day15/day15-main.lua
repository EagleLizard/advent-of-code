
local printf = require("util.printf")

local function day15Pt1(inputLines)
  for _, inputLine in ipairs(inputLines) do
    printf("%s\n", inputLine)
  end
  return -1
end

local day15MainModule = {
  day15Pt1 = day15Pt1,
}

return day15MainModule
