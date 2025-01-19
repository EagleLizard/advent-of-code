
local lfs = require("lfs")

local files = require("./util/files")
local cliColors = require("./util/cli-colors")
local dateTimeUtil = require("./util/date-time-util")
local parseArgs = require("./lib/parse-args")
local arr = require("./util/arr-util")

local colors = cliColors.colors

local day1 = require("./day1/day1-main")
local day2 = require("./day2/day2-main")
local day3 = require("./day3/day3-main")
local day5 = require("./day5/day5-main")
local day9 = require("./day9/day9-main")

local printf = require("./util/printf")
local errorf = require("./util/errorf")

local c1 = colors.green_bright
local c2 = colors.cyan
-- local c3 = colors.pear_light
local c3 = colors.pear
local c4 = colors.white_bright
-- local c4 = colors.pear_light

-- local DAY_1_FILE_NAME = "day1_test1.txt"
local DAY_1_FILE_NAME = "day1.txt"
-- local DAY_2_FILE_NAME = "day2_test.txt"
local DAY_2_FILE_NAME = "day2.txt"
-- local DAY_3_FILE_NAME = "day3_test.txt"
-- local DAY_3_FILE_NAME = "day3_test2.txt"
local DAY_3_FILE_NAME = "day3.txt"
-- local DAY_5_FILE_NAME = "day5_test.txt"
local DAY_5_FILE_NAME = "day5.txt"
-- local DAY_9_FILE_NAME = "day9_test1.txt"
-- local DAY_9_FILE_NAME = "day9_test2.txt"
local DAY_9_FILE_NAME = "day9.txt"

local function aocBanner()
  local padStr = "*"
  local left = c1(padStr)
  local right = c1(padStr)
  local bannerTxt = " Advent of Code 2024 [lua] "
  local bannerTxtStr = c4(bannerTxt)
  local bannerTxtLine = string.format("%s%s%s", left, bannerTxtStr, right)
  local topTxt = string.rep(padStr, bannerTxt:len() + (padStr:len() * 2))
  local bottomTxt = topTxt
  local top = c1(topTxt)
  local bottom = cliColors.underline(c1(bottomTxt))
  local bannerStr = string.format("%s\n%s\n%s", top, bannerTxtLine, bottom)
  return bannerStr
end

local function getInputLines(inputFileName)
  local inputFilePath = lfs.currentdir()..files.sep.."input"..files.sep..inputFileName
  if not files.check(inputFilePath) then
    error("File does't exist: "..inputFilePath)
  end
  local lines = {}
  for line in io.lines(inputFilePath) do
    lines[#lines + 1] = line
  end
  return lines
end

local function runPart(ptNum, inputLines, ptFn)
  local startTime = os.clock()
  local ptSolution = ptFn(inputLines)
  local endTime = os.clock()
  local elapsed = endTime - startTime
  local partRes = {
    partNum = ptNum,
    fnTime = elapsed,
    solution = ptSolution,
  }
  return partRes
end

local function printPart(ptRes)
  local fnTimeMs = dateTimeUtil.sToMs(ptRes.fnTime)
  local solution = c3(string.format("%d", ptRes.solution))
  local fnTimeStr = c2(string.format("%.3f ms", fnTimeMs))

  local partStr = c1(string.format("Part %d", ptRes.partNum))
  printf("%s: %s | %s\n", partStr, solution, fnTimeStr)
end

local function runDay(day, inputFileName, pt1Fn, pt2Fn)
  local pt1Res
  local pt2Res
  local inputLines
  local dayBanner = string.format("~ Day %s ~", day)
  printf("%s\n", c1(dayBanner))
  inputLines = getInputLines(inputFileName)

  local totalStart = os.clock()
  if pt1Fn ~= nil then
    pt1Res = runPart(1, inputLines, pt1Fn)
    printPart(pt1Res)
  end
  if pt2Fn ~= nil then
    pt2Res = runPart(2, inputLines, pt2Fn)
    printPart(pt2Res)
  end
  local totalElapsedTime = os.clock() - totalStart
  local totalElapsedTimeMs = dateTimeUtil.sToMs(totalElapsedTime)
  local totalTimeStr = c2(string.format("%.3f ms", totalElapsedTimeMs))

  local divWidth = 6
  local divStr = string.rep("-", divWidth)
  local totalTxt = c1("total")
  local totalStr = cliColors.italic(string.format("%s: %s", totalTxt, totalTimeStr))
  printf("%s\n%s\n", totalStr, divStr)
end

local dayArgsArr = {
  {1, DAY_1_FILE_NAME, day1.day1Pt1, day1.day2Pt2},
  {2, DAY_2_FILE_NAME, day2.day2Pt1, day2.day2Pt2},
  {3, DAY_3_FILE_NAME, day3.day3Pt1, day3.day3Pt2},
  {5, DAY_5_FILE_NAME, day5.day5pt1, day5.day5pt2},
  {9, DAY_9_FILE_NAME, day9.day9Pt1, day9.day9Pt2},
}

local function main()
  local bannerStr = aocBanner()
  printf("\n%s\n\n", bannerStr)
  local cmdOpts = parseArgs.parse(arg)

  local daysToRun = {}
  if cmdOpts.day < 1 then
    for _, dayArgs in ipairs(dayArgsArr) do
      table.insert(daysToRun, dayArgs)
    end
  else
    local foundIdx = arr.findIndex(dayArgsArr, function(dayArgs)
      return dayArgs[1] == cmdOpts.day
    end)
    if foundIdx == nil then
      errorf("Day not found: %d", cmdOpts.day)
    end
    table.insert(daysToRun, dayArgsArr[foundIdx])
  end

  for _, dayArgs in ipairs(daysToRun) do
    runDay(dayArgs[1], dayArgs[2], dayArgs[3], dayArgs[4])
  end
end

main()
