
local lfs = require("lfs")

local files = require("./util/files")
local day5 = require("./day5/day5-main")

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

local function runDay(day, inputFileName, pt1Fn, pt2Fn)
  local pt1Res
  local pt2Res
  local inputLines
  inputLines = getInputLines(inputFileName)
  io.write(string.format("~ Day %s ~\n", day))
  if pt1Fn ~= nil then
    -- io.write("Part 1:")
    pt1Res = runPart(1, inputLines, pt1Fn)
    io.write(string.format("Part %d: %d | %f s", pt1Res.partNum, pt1Res.solution, pt1Res.fnTime))
  end
end

local function main()
  -- local bannerTxt = "Advent of Code 2024 [lua]"
  -- print(bannerTxt)
  local bannerStr = aocBanner()
  io.write(string.format("\n%s\n\n", bannerStr))

  runDay(5, DAY_5_FILE_NAME, day5.day5pt1)
end

main()
