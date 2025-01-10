
local strUtil = require("../util/str-util")

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
63013756 - correct
]]
local function day3Pt2(inputLines)
  local dontStr = "don't()"
  local doStr = "do()"
  local startDoDontChar = dontStr:sub(1,1)
  local charStack = ""
  local parseDoDont = false
  local doDontIdx = 1
  local doMul = true
  local mulLines = {}

  local function consumeCharStack()
    if charStack == dontStr then
      doMul = false
    elseif charStack == doStr then
      doMul = true
    end
    charStack = ""
  end
  for _, inputLine in ipairs(inputLines) do
    local mulChars = ""
    for i = 1, #inputLine do
      local c = inputLine:sub(i, i)
      if c == startDoDontChar then
        parseDoDont = true
        charStack = ""
        doDontIdx = 1
      end
      if parseDoDont then
        if (
          (c == dontStr:sub(doDontIdx, doDontIdx))
          or (c == doStr:sub(doDontIdx, doDontIdx))
        ) then
          charStack = charStack..c
          doDontIdx = doDontIdx + 1
        else
          consumeCharStack()
          parseDoDont = false
        end
      end
      if doMul then
        mulChars = mulChars..c
      end
    end
    table.insert(mulLines, mulChars)
  end
  local mulInstructions = parseInput(mulLines)
  local mulSum = 0
  for _, mulInst in ipairs(mulInstructions) do
    mulSum = mulSum + (mulInst.lhs * mulInst.rhs)
  end
  return mulSum
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
  day3Pt2 = day3Pt2,
}

return day3MainModule
