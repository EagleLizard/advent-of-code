
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

local function checkDesign(srcPatterns, srcDesign)
  srcPatterns = arr.copy(srcPatterns)
  -- printf("\nd: %s\n", srcDesign)
  local matches = {}
  local function helper(patterns, design, soFar)
    soFar = soFar or {}
    for i, sf in ipairs(soFar) do
      printf("%s%s", (i == #soFar and "\n") or " ", sf)
    end
    -- for i, pattern in ipairs(patterns) do
    --   printf("%s%s", pattern, (i == #patterns and "\n") or " ")
    -- end
    if string.len(design) == 0 then
      return true
    end
    for i, pattern in ipairs(patterns) do
      local j, k = string.find(design, pattern)
      if j == 1 then
        local nextDesign = string.sub(design, k + 1)
        local nextPatterns = arr.copy(patterns)
        -- printf("%s -> %s\n", pattern, nextDesign)
        table.insert(soFar, i)
        local isValid = helper(patterns, nextDesign, soFar)
        table.remove(soFar)
        if isValid == true then
          return true
        end
        -- table.remove(nextPatterns, i)
        -- local isValid = helper(nextPatterns, nextDesign)
        -- if isValid then
        --   return true
        -- end
      end
    end
    return false
  end
  -- for i, pattern in ipairs(srcPatterns) do
  --   -- printf("%s\n", pattern)
  --   local i, j = string.find(srcDesign, pattern)
  --   if i == 1 then
  --     local subDesign = string.sub(srcDesign, j + 1)
  --     printf("%s %s\n", i, j)
  --     printf("%s -> '%s'", pattern, subDesign)
  --   end
  -- end
  return helper(srcPatterns, srcDesign)
end

local function day19Part1(inputLines)
  local day19Input = parseInput(inputLines)
  local patterns = day19Input.patterns
  local designs = day19Input.designs
  
  for i, pattern in ipairs(patterns) do
    printf("%s%s", pattern, (i == #patterns and "\n") or " ")
  end
  local possibleDesignCount = 0
  for _, design in ipairs(designs) do
    local validDesign = checkDesign(patterns, design)
    printf("%s: %s\n", design, validDesign)
    if validDesign then
      possibleDesignCount = possibleDesignCount + 1
    end
  end
  return possibleDesignCount
end

local day19MainModule = {
  day19Part1 = day19Part1,
}

return day19MainModule
