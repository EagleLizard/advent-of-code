
local arr = require("util.arr-util")

local printf = require("util.printf")

local function parseInput(inputLines)
  local parsePatterns = true
  local parseDesigns = false
  local patterns = {}
  local designs = {}
  for i, inputLine in ipairs(inputLines) do
    if parsePatterns then
      for patternStr in string.gmatch(inputLine, "(%a+),?") do
        table.insert(patterns, patternStr)
      end
      parsePatterns = false
    elseif not parseDesigns then
      if string.len(inputLine) == 0 then
        parseDesigns = true
      end
    elseif parseDesigns then
      table.insert(designs, inputLine)
    end
    -- if parseDesigns then
    --   table.insert(designs, inputLine)
    -- end
    -- printf("%d - %s\n", i, inputLine)
  end
  local res = {
    patterns = patterns,
    designs = designs,
  }
  return res
end

local function checkDesign(patterns, design)
  patterns = arr.copy(patterns)
  
end

local function day19Part1(inputLines)
  local day19Input = parseInput(inputLines)
  local patterns = day19Input.patterns
  local designs = day19Input.designs
  for i, design in ipairs(designs) do
    checkDesign(patterns, design)
  end
  return -1
end

local day19MainModule = {
  day19Part1 = day19Part1,
}

return day19MainModule
