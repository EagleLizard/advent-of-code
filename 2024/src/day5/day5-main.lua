
local strUtil = require("../util/str-util")

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
      -- io.write(string.format("%s\n", currLine))
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

local function day5Pt1(inputLines)
  local parsedInput = parseInput(inputLines)
  io.write(string.format("num rules: %d\nnum updates: %d\n", #parsedInput.rules, #parsedInput.updates))
  return -1
end

local day5MainModule = {
  day5pt1 = day5Pt1
}

return day5MainModule
