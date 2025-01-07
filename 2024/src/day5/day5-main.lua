
local strUtil = require("../util/str-util")
local arr = require("../util/arr-util")

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

local function getRelevantRules(update, allRules)
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
  return rules
end

local function checkUpdate(update, allRules)
  local rules = getRelevantRules(update, allRules)
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

local function getBrokenRules(update, rules)
  local pagesSoFar = {}
  local rulesBroken = {}

  for _, currPage in ipairs(update) do
    local currRulesBroken = {}
    local validPage = true
    for _, rule in ipairs(rules) do
      if rule.rhs == currPage then
        if not arr.contains(pagesSoFar, rule.lhs) then
          table.insert(currRulesBroken, rule)
          validPage = false
        end
      end
    end
    if not validPage then
      -- only keep the rule that was broken
      --   for the page number with the max index
      local maxRule
      local maxRuleIdx = -1
      for _, rule in ipairs(currRulesBroken) do
        local resIdx = arr.findIndex(update, function (pageNum, pageIdx)
          return pageNum == rule.lhs
        end)
        if resIdx ~= nil and resIdx > maxRuleIdx then
          maxRuleIdx = resIdx
          maxRule = rule
        end
      end
      if maxRule ~= nil then
        table.insert(rulesBroken, maxRule)
      end
    end
    table.insert(pagesSoFar, currPage)
  end
  return rulesBroken
end

local function sortUpdate(update, allRules)
  update = arr.copy(update)
  local rules = getRelevantRules(update, allRules)
  local rulesBroken = getBrokenRules(update, rules)
  while #rulesBroken > 0 do
    -- fix first broken rule, then get broken rules again
    local ruleToFix = rulesBroken[1]
    local lhsIdx = arr.findIndex(update, function (pageNum)
      return pageNum == ruleToFix.lhs
    end)
    if not lhsIdx then
      error(string.format("page not found: %d", ruleToFix.lhs))
    end
    local rhsIdx = arr.findIndex(update, function (pageNum)
      return pageNum == ruleToFix.rhs
    end)
    if not rhsIdx then
      error(string.format("page not found: %d", ruleToFix.rhs))
    end

    update[lhsIdx] = ruleToFix.rhs
    update[rhsIdx] = ruleToFix.lhs
    rulesBroken = getBrokenRules(update, rules)
  end
  return update
end

-- 5248 - correct

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

-- 4507 - correct

local function day5Pt2(inputLines)
  local parsedInput = parseInput(inputLines)
  local invalidUpdates = {}
  for _, update in ipairs(parsedInput.updates) do
    local invalidUpdate = not checkUpdate(update, parsedInput.rules)
    if invalidUpdate then
      table.insert(invalidUpdates, update)
    end
  end
  local sortedUpdates = {}
  for _, update in ipairs(invalidUpdates) do
    local sortedUpdate = sortUpdate(update, parsedInput.rules)
    table.insert(sortedUpdates, sortedUpdate)
  end
  local midPageSum = 0
  for _, sortedUpdate in ipairs(sortedUpdates) do
    local midIdx = math.floor(#sortedUpdate / 2)
    midPageSum = midPageSum + sortedUpdate[midIdx + 1]
  end
  return midPageSum
end

local day5MainModule = {
  day5pt1 = day5Pt1,
  day5pt2 = day5Pt2,
}

return day5MainModule
