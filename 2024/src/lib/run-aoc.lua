
local lfs = require("lfs")

local files = require("util.files")
local strUtil = require("util.str-util")
local dateTimeUtil = require("util.date-time-util")

local printf = require("util.printf")

local function getInputLines(inputFileName)
  local inputFilePath = strUtil.join({
    lfs.currentdir(),
    "input",
    inputFileName,
  }, files.sep)
  if not files.check(inputFilePath) then
    error("File does't exist: "..inputFilePath)
  end
  local lines = {}
  for line in io.lines(inputFilePath) do
    lines[#lines + 1] = line
  end
  return lines
end

local function printPart(t, ptRes)
  local fnTimeMs = dateTimeUtil.sToMs(ptRes.fnTime)
  local solution = t.c3(string.format("%d", ptRes.solution))
  local fnTimeStr = t.c2(string.format("%.3f ms", fnTimeMs))

  local partStr = t.c1(string.format("Part %d", ptRes.partNum))
  printf("%s: %s | %s\n", partStr, solution, fnTimeStr)
end

local function runPart(partNum, inputLines, partFn)
  local startTime = os.clock()
  local partSolution = partFn(inputLines)
  local endTime = os.clock()
  local elapsed = endTime - startTime
  local partRes = {
    partNum = partNum,
    fnTime = elapsed,
    solution = partSolution,
  }
  return partRes
end

local function runDay(t, day, inputFileName, part1Fn, part2Fn)
  local pt1Res, pt2Res, inputLines, dayBanner
  dayBanner = string.format("~ Day %d ~", day)
  printf("%s\n", t.c1(dayBanner))
  inputLines = getInputLines(inputFileName)

  local totalStart = os.clock()
  if part1Fn ~= nil then
    pt1Res = runPart(1, inputLines, part1Fn)
    printPart(t, pt1Res)
  end
  if part2Fn ~= nil then
    pt2Res = runPart(2, inputLines, part2Fn)
    printPart(t, pt2Res)
  end
  local totalElapsedTime = os.clock() - totalStart
  local totalElapsedTimeMs = dateTimeUtil.sToMs(totalElapsedTime)
  local totalTimeStr = t.c2(string.format("%.3f ms", totalElapsedTimeMs))

  local divWidth = 6
  local divStr = string.rep("-", divWidth)
  local totalTxt = t.c1("total")
  local totalStr = t.italic(string.format("%s: %s", totalTxt, totalTimeStr))
  printf("%s\n%s\n", totalStr, divStr)
end

local runAocModule = {
  runPart = runPart,
  runDay = runDay,
}

return runAocModule
