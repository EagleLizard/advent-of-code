
local lfs = require("lfs")

local files = require("./util/files")

local day1 = require("./day1/day1-main")
local day5 = require("./day5/day5-main")

local printf = require("./util/printf")

-- local DAY_1_FILE_NAME = "day1_test1.txt"
local DAY_1_FILE_NAME = "day1.txt"
-- local DAY_5_FILE_NAME = "day5_test.txt"
local DAY_5_FILE_NAME = "day5.txt"

local function aocBanner()
  local padStr = "*"
  local pre = padStr
  local post = padStr
  local bannerTxt = "Advent of Code 2024 [lua]"
  local bannerStr = string.format("%s %s %s", pre, bannerTxt, post)
  return bannerStr
end

local function getInputLines(inputFileName)
  -- local inputFilePath = lfs.currentdir()..files.sep..inputFileName
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
  printf("Part %d: %d | %f s\n", ptRes.partNum, ptRes.solution, ptRes.fnTime)
end

local function runDay(day, inputFileName, pt1Fn, pt2Fn)
  local pt1Res
  local pt2Res
  local inputLines
  printf("~ Day %s ~\n", day)
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

  local divWidth = 6
  local divStr = string.rep("-", divWidth)
  printf("total: %f s\n%s\n", totalElapsedTime, divStr)
end

local function main()
  local bannerStr = aocBanner()
  printf("\n%s\n\n", bannerStr)

  runDay(1, DAY_1_FILE_NAME, day1.day1Pt1, nil)
  runDay(5, DAY_5_FILE_NAME, day5.day5pt1, day5.day5pt2)
end

main()
