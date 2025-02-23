
local arr = require("util.arr-util")
local strUtil = require("util.str-util")

local printf = require("util.printf")
local errorf = require("util.errorf")

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

local function psf(soFar, patterns)
  local sfStr = ""
  for i, sf in ipairs(soFar) do
    local sfv = (patterns ~= nil and patterns[sf]) or sf
    sfStr = string.format("%s%s%s", sfStr, sfv, (i == #soFar and "") or ", ")
  end
  return sfStr
end

local function checkDesign4(towels, srcDesign)
  local helper = (function ()
    local cache = {}
    local function _helper(design)
      if cache[design] ~= nil then
        return cache[design]
      end
      if #design == 0 then
        cache[design] = true
        return cache[design]
      end
      for i, towel in ipairs(towels) do
        local j, k = string.find(design, towel)
        if j == 1 then
          local nd = string.sub(design, k + 1)
          local isValid = _helper(nd)
          if isValid then
            cache[design] = true
            return cache[design]
          end
        end
      end
      cache[design] = false
      return cache[design]
    end
    return _helper
  end)()
  return helper(srcDesign)
end

local function countDesigns(towels, srcDesign)
  local function getHelper()
    local cache = {};
    local function helper(design)
      if cache[design] ~= nil then
        return cache[design]
      end
      local currCount = 0
      if #design == 0 then
        cache[design] = 1
        return cache[design]
      end
      for i, towel in ipairs(towels) do
        local j, k = string.find(design, towel)
        if j == 1 then
          currCount = currCount + helper(string.sub(design, k + 1))
        end
      end
      cache[design] = currCount
      return cache[design]
    end
    return helper
  end
  return getHelper()(srcDesign)
end

--[[ 
705756472327497 - correct
]]
local function day19Part2(inputLines)
  local day19Input = parseInput(inputLines)
  local patterns = day19Input.patterns
  local designs = day19Input.designs
  local allPossibleDesigns = 0
  for _, design in ipairs(designs) do
    local possibleDesigns = countDesigns(patterns, design)
    allPossibleDesigns = allPossibleDesigns + possibleDesigns
  end

  return allPossibleDesigns
end

--[[ 
304 - correct
]]
local function day19Part1(inputLines)
  local day19Input = parseInput(inputLines)
  local patterns = day19Input.patterns
  local designs = day19Input.designs
  
  -- for i, pattern in ipairs(patterns) do
  --   printf("%s%s", pattern, (i == #patterns and "\n") or " ")
  -- end
  local possibleDesignCount = 0
  for _, design in ipairs(designs) do
    local validDesign = checkDesign4(patterns, design)
    -- printf("%s: %s\n", design, validDesign)
    if validDesign then
      possibleDesignCount = possibleDesignCount + 1
    end
  end
  return possibleDesignCount
end

local day19MainModule = {
  day19Part1 = day19Part1,
  day19Part2 = day19Part2,
}

return day19MainModule
