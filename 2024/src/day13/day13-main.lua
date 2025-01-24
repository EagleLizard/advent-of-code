
local Point = require("geom.point")

local printf = require("util.printf")
local errorf = require("util.errorf")

local DEBUG = true
-- local DEBUG = false

local ClawMachine = (function ()
  local ClawMachine = {}
  ClawMachine.__index = ClawMachine

  function ClawMachine:new()
    local self = setmetatable({}, ClawMachine)
    self.buttons = {}
    self.prize = nil
    return self
  end

  function ClawMachine:addButton(buttonKey, x, y)
    if self.buttons[buttonKey] ~= nil then
      errorf("Button with key %s already defined", buttonKey)
    end
    self.buttons[buttonKey] = Point:new(x, y)
  end

  return ClawMachine
end)()

local function parseInput(inputLines)
  local machines = {}
  local currMachine = nil
  local parseButton = false
  local parsePrize = false

  local numLines = #inputLines
  local i = 1
  while i <= numLines do
    local inputLine = inputLines[i]
    if currMachine == nil then
      currMachine = ClawMachine:new()
    end
    if parseButton then
      local btnKey, xStr, yStr = string.match(inputLine, "^Button (%u): X%+(%d+), Y%+(%d+)")
      if btnKey == nil then
        parseButton = false
        parsePrize = true
      else
        local x = tonumber(xStr) or errorf("Invalid button X: %s", xStr)
        local y = tonumber(yStr) or errorf("Invalid button Y: %s", yStr)
        currMachine:addButton(btnKey, x, y)
        i = i + 1
      end
    elseif parsePrize then
      local xStr, yStr = string.match(inputLine, "^Prize: X=(%d+), Y=(%d+)")
      if xStr == nil or yStr == nil then
        errorf("Unexpected line when parsing prize: %s", inputLine)
      end
      local x = tonumber(xStr) or errorf("Invalid button X: %s", xStr)
      local y = tonumber(yStr) or errorf("Invalid button Y: %s", yStr)
      if currMachine.prize ~= nil then
        errorf("Current machine already has prize (%d, %d), attempted to set: (%d, %d)", currMachine.prize.x, currMachine.prize.y, x, y)
      end
      currMachine.prize = Point:new(x, y)
      table.insert(machines, currMachine)
      currMachine = nil
      parsePrize = false
      i = i + 1
    else
      --[[ the only valid line from this state is empty or a button ]]
      if string.match(inputLine, "^Button") then
        parseButton = true
      elseif string.match(inputLine, "^%s*$") then
        i = i + 1
      else
        errorf("unexpected line: %s", inputLine)
      end
    end
  end
  return machines
end

local function day13Pt1(inputLines)
  local claws = parseInput(inputLines)
  if DEBUG then
    for _, claw in ipairs(claws) do
      for k, btn in pairs(claw.buttons) do
        printf("%s: %d, %d\n", k, btn.x, btn.y)
      end
      printf("%d, %d", claw.prize.x, claw.prize.y)
      printf("\n")
    end
  end
  return -1
end

local day13Module = {
  day13Pt1 = day13Pt1,
}

return day13Module
