
local printf = require("../util/printf")

local function parseInput(inputLines)
  local mulInstructions = {}
  for _, inputLine in ipairs(inputLines) do
    for l, r in string.gmatch(inputLine, "mul%((%d+),(%d+)%)") do
      if l:len() < 4 and r:len() < 4 then
        table.insert(mulInstructions, {
          lhs = tonumber(l),
          rhs = tonumber(r),
        })
      end
    end
  end
  return mulInstructions
end

--[[ 
189527826 - correct
]]
local function day3Pt1(inputLines)
  local mulInstructions = parseInput(inputLines)
  local mulSum = 0
  for _, mulInst in ipairs(mulInstructions) do
    mulSum = mulSum + (mulInst.lhs * mulInst.rhs)
  end
  return mulSum
end

local day3MainModule = {
  day3Pt1 = day3Pt1,
}

return day3MainModule
