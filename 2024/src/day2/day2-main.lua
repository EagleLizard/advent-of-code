
local strUtil = require("../util/str-util")

local printf = require("../util/printf")

local function parseInput(inputLines)
   local reports = {}
   for _, inputLine in ipairs(inputLines) do
    local report = {}
    for reportStr in string.gmatch(inputLine, "(%d+)") do
      table.insert(report, tonumber(reportStr))
    end
    table.insert(reports, report)
   end
   return reports
end

local function checkReport(report)
  local diffs = {}
  local prevLvl = report[1]
  for i=2, #report do
    local currDiff = report[i] - prevLvl
    table.insert(diffs, currDiff)
    prevLvl = report[i]
  end
  local prevDiff = nil
  for _, diff in ipairs(diffs) do
    local absDiff = math.abs(diff)
    if absDiff < 1 or absDiff > 3 then
      return false
    end
    if prevDiff == nil then
      prevDiff = diff
    else
      if prevDiff > 0 and diff < 0 or prevDiff < 0 and diff > 0 then
        return false
      end
    end
  end
  return true
  -- printf("%s\n", strUtil.join(diffs, " "))
end

--[[
306 - correct
]]
local function day2Pt1(inputLines)
  local reports = parseInput(inputLines)
  local safeReportCount = 0
  for _, report in ipairs(reports) do
    local reportSafe = checkReport(report)
    if reportSafe then
      safeReportCount = safeReportCount + 1
    end
    -- printf("%s | %s\n", strUtil.join(report, " "), reportSafe)
  end
  return safeReportCount
end

local day2MainModule = {
  day2Pt1 = day2Pt1,
}

return day2MainModule
