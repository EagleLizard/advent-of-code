
local aoc = require("lib.run-aoc")
local cliColors = require("util.cli-colors")
local parseArgs = require("lib.parse-args")
local arr = require("util.arr-util")

local colors = cliColors.colors

local day1 = require("day1.day1-main")
local day2 = require("day2.day2-main")
local day3 = require("day3.day3-main")
local day5 = require("day5.day5-main")
local day7 = require("day7.day7-main")
local day9 = require("day9.day9-main")
local day10 = require("day10.day10-main")
local day11 = require("day11.day11-main")
local day12 = require("day12.day12-main")
local day13 = require("day13.day13-main")
local day14 = require("day14.day14-main")
local day15 = require("day15.day15-main")
local day16 = require("day16.day16-main")

local printf = require("util.printf")
local errorf = require("util.errorf")

-- local DAY_1_FILE_NAME = "day1_test1.txt"
local DAY_1_FILE_NAME = "day1.txt"
-- local DAY_2_FILE_NAME = "day2_test.txt"
local DAY_2_FILE_NAME = "day2.txt"
-- local DAY_3_FILE_NAME = "day3_test.txt"
-- local DAY_3_FILE_NAME = "day3_test2.txt"
local DAY_3_FILE_NAME = "day3.txt"
-- local DAY_5_FILE_NAME = "day5_test.txt"
local DAY_5_FILE_NAME = "day5.txt"
-- local DAY_7_FILE_NAME = "day7_test.txt"
local DAY_7_FILE_NAME = "day7.txt"
-- local DAY_9_FILE_NAME = "day9_test1.txt"
-- local DAY_9_FILE_NAME = "day9_test2.txt"
local DAY_9_FILE_NAME = "day9.txt"
-- local DAY_10_FILE_NAME = "day10_test.txt"
local DAY_10_FILE_NAME = "day10.txt"
-- local DAY_11_FILE_NAME = "day11_test.txt"
local DAY_11_FILE_NAME = "day11.txt"
-- local DAY_12_FILE_NAME = "day12_test.txt"
-- local DAY_12_FILE_NAME = "day12_test2.txt"
-- local DAY_12_FILE_NAME = "day12_test3.txt"
-- local DAY_12_FILE_NAME = "day12_test4.txt"
local DAY_12_FILE_NAME = "day12.txt"
-- local DAY_13_FILE_NAME = "day13_test.txt"
local DAY_13_FILE_NAME = "day13.txt"
-- local DAY_14_FILE_NAME = "day14_test.txt"
local DAY_14_FILE_NAME = "day14.txt"
-- local DAY_15_FILE_NAME = "day15_test.txt"
-- local DAY_15_FILE_NAME = "day15_test2.txt"
-- local DAY_15_FILE_NAME = "day15_test3.txt"
-- local DAY_15_FILE_NAME = "day15_test-e2.txt"
-- local DAY_15_FILE_NAME = "day15_test1.txt"
local DAY_15_FILE_NAME = "day15.txt"
-- local DAY_16_FILE_NAME = "day16_test1.txt"
-- local DAY_16_FILE_NAME = "day16_test2.txt"
-- local DAY_16_FILE_NAME = "day16_test-e1.txt"
-- local DAY_16_FILE_NAME = "day16_test-e2.txt"
-- local DAY_16_FILE_NAME = "day16_test-e3.txt"
-- local DAY_16_FILE_NAME = "day16_test-e4.txt"
local DAY_16_FILE_NAME = "day16.txt"

local function aocBanner(t)
  local padStr = "*"
  local left = t.c1(padStr)
  local right = t.c1(padStr)
  local bannerTxt = " Advent of Code 2024 [lua] "
  local bannerTxtStr = t.c4(bannerTxt)
  local bannerTxtLine = string.format("%s%s%s", left, bannerTxtStr, right)
  local topTxt = string.rep(padStr, bannerTxt:len() + (padStr:len() * 2))
  local bottomTxt = topTxt
  local top = t.c1(topTxt)
  local bottom = t.underline(t.c1(bottomTxt))
  local bannerStr = string.format("%s\n%s\n%s", top, bannerTxtLine, bottom)
  return bannerStr
end

local dayArgsArr = {
  {1, DAY_1_FILE_NAME, day1.day1Pt1, day1.day2Pt2},
  {2, DAY_2_FILE_NAME, day2.day2Pt1, day2.day2Pt2},
  {3, DAY_3_FILE_NAME, day3.day3Pt1, day3.day3Pt2},
  {5, DAY_5_FILE_NAME, day5.day5pt1, day5.day5pt2},
  {7, DAY_7_FILE_NAME, day7.day7Pt1, day7.day7Pt2},
  {9, DAY_9_FILE_NAME, day9.day9Pt1, day9.day9Pt2},
  {10, DAY_10_FILE_NAME, day10.day10Pt1, day10.day10Pt2},
  {11, DAY_11_FILE_NAME, day11.day11Pt1, day11.day11Pt2},
  {12, DAY_12_FILE_NAME, day12.day12Pt1, day12.day12Pt2},
  {13, DAY_13_FILE_NAME, day13.day13Pt1, day13.day13Pt2},
  {14, DAY_14_FILE_NAME, day14.day14Pt1, day14.day14Pt2},
  {15, DAY_15_FILE_NAME, day15.day15Pt1, day15.day15Pt2},
  {16, DAY_16_FILE_NAME, day16.day16Pt1, nil},
}

local function main()
  local theme = {
    c1 = colors.green_bright,
    c2 = colors.cyan,
    c3 = colors.pear,
    c4 = colors.white_bright,
    italic = cliColors.italic,
    underline = cliColors.underline,
  }

  local bannerStr = aocBanner(theme)
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
    -- runDay(dayArgs[1], dayArgs[2], dayArgs[3], dayArgs[4])
    aoc.runDay(theme, dayArgs[1], dayArgs[2], dayArgs[3], dayArgs[4])
  end
end

main()
