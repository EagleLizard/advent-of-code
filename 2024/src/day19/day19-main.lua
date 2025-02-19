
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

local function checkDesign3(patterns, srcDesign)
  patterns = arr.copy(patterns)
  table.sort(patterns, function (a, b)
    return #a > #b
  end)
  local designMatchMemo = (function ()
    local cache = {}
    return function(dSub, towel)
      local ck = dSub.."_"..towel
      if cache[ck] ~= nil then
        return cache[ck]
      end
      local j, k = string.find(dSub, towel)
      local res = {
        k = k,
        found = j == 1
      }
      cache[ck] = res
      return cache[ck]
    end
  end)()
  local sTime = os.clock()
  local hCache = {}
  local function helper(design, soFar)
    if hCache[design] ~= nil then
      return hCache[design]
    end
    -- printf("%s\n", design)
    if #design == 0 then
      return true
    end
    soFar = soFar or {}
    for i, towel in ipairs(patterns) do
      local dSub = string.sub(design, 1, #towel)
      local designMatch = designMatchMemo(dSub, towel)
      local found = designMatch.found
      local k = designMatch.k
      if found then
        local nTime = os.clock()
        local elapsedMs = (nTime - sTime) * 1e3
        -- printf("-%s\n", towel)
        local nd = string.sub(design, k + 1)
        -- printf("%s\n", nd)
        table.insert(soFar, i)
        local isValid = helper(nd, soFar)
        if elapsedMs > 100 then
          sTime = nTime
          -- printf("%s\n", psf(soFar, patterns))
        end
        table.remove(soFar)
        if isValid then
          hCache[design] = true
          return hCache[design]
        end
      end
    end
    hCache[design] = false
    return hCache[design]
  end
  -- printf("~~ %s\n", srcDesign)
  --[[
    find if any towel can satisfy the design at the initial idx,
      if not return early
  ]]
  local hasMatch = false
  for i, towel in ipairs(patterns) do
    local j, k = string.find(srcDesign, towel)
    if j == 1 then
      hasMatch = true
      break
    end
  end
  if not hasMatch then
    return false
  end
  return helper(srcDesign)
end

--[[ 
304 - correct
]]
local function day19Part1(inputLines)
  local day19Input = parseInput(inputLines)
  local patterns = day19Input.patterns
  local designs = day19Input.designs
  
  for i, pattern in ipairs(patterns) do
    printf("%s%s", pattern, (i == #patterns and "\n") or " ")
  end
  local possibleDesignCount = 0
  for _, design in ipairs(designs) do
    local validDesign = checkDesign3(patterns, design)
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
