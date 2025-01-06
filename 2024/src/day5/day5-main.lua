
local strUtil = require("../util/str-util")
local arr = require("../util/arr-util")

-- 5248 - correct

local function parseInput(inputLines)
  local parseRules = true
  local rules = {}
  local updates = {}
  for _, currLine in pairs(inputLines) do
    if parseRules then
      local pipeIdx = string.find(currLine, "|")
      if pipeIdx == nil then
        -- switch to parsing updates
        parseRules = false
      else
        local ruleParts = strUtil.split(currLine, "|")
        local rule = {
          lhs = tonumber(ruleParts[1]),
          rhs = tonumber(ruleParts[2]),
        }
        table.insert(rules, rule)
      end
    else
      local updateParts = strUtil.split(currLine, ",")
      local pageNums = {}
      for _, updatePart in ipairs(updateParts) do
        local pageNum = tonumber(updatePart)
        table.insert(pageNums, pageNum)
      end
      table.insert(updates, pageNums)
    end
  end
  local res = {
    rules = rules,
    updates = updates,
  }
  return res
end

local function checkUpdate(update, allRules)
  -- filter rules to only include rules for which are being
  --  updated
  local rules = {}
  for i, rule in ipairs(allRules) do
    local lhs = rule.lhs
    local rhs = rule.rhs
    local lhsIdx = arr.findIndex(update, function (pageNum)
      return lhs == pageNum
    end)
    local rhsIdx = arr.findIndex(update, function (pageNum)
      return rhs == pageNum
    end)
    if lhsIdx ~= nil and rhsIdx ~= nil then
      table.insert(rules, rule)
    end
  end

  local pagesSoFar = {}
  for i, currPageNum in ipairs(update) do
    -- get all rules containing the current page
    local validPage = true
    for _, rule in ipairs(rules) do
      if rule.rhs == currPageNum then
        -- lhs must come before
        if not arr.contains(pagesSoFar, rule.lhs) then
          validPage = false
          break
        end
      end
    end
    if not validPage then
      return false
    end
    table.insert(pagesSoFar, currPageNum)
  end
  return true
end

local function day5Pt1(inputLines)
  local parsedInput = parseInput(inputLines)
  local rules = parsedInput.rules
  local updates = parsedInput.updates
  local validUpdates = {}
  for _, update in ipairs(updates) do
    local validUpdate = checkUpdate(update, rules)
    if validUpdate then
      table.insert(validUpdates, update)
    end
  end
  local midPageSum = 0
  for _, validUpdate in ipairs(validUpdates) do
    local midIdx = math.floor(#validUpdate / 2)
    midPageSum = midPageSum + validUpdate[midIdx + 1]
  end
  return midPageSum
end

local day5MainModule = {
  day5pt1 = day5Pt1
}

return day5MainModule
