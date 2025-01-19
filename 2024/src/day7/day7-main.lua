
local strUtil = require("../util/str-util")
local arr = require("../util/arr-util")

local errorf = require("../util/errorf")

local function parseInput(inputLines)
  local calibrationEqs = {}
  for _, inputLine in ipairs(inputLines) do
    local lineParts = strUtil.split(inputLine, ":")
    local valPart = lineParts[1]
    local numsPart = lineParts[2]
    local testVal = tonumber(valPart)
    if testVal == nil then
      errorf("invalid testVal string: %s", testVal)
    end
    local nums = {}
    for numStr in string.gmatch(numsPart, "(%d+)") do
      local num = tonumber(numStr)
      if num == nil then
        errorf("invalid eq num: %s", numStr)
      end
      table.insert(nums, num)
    end
    table.insert(calibrationEqs, {
      testVal = testVal,
      nums = nums,
    })
  end
  return calibrationEqs
end

local function addOp(a, b)
  return a + b
end
local function mulOp(a, b)
  return a * b
end
local function concatOp(a, b)
  return tonumber(a..b)
end

local function checkSolvableEq(testVal, nums, ops)
  --[[ helper ]]
  local function _checkSolvableEq(_nums, res)
    if #_nums < 1 then
      return res == testVal
    end
    for _, op in ipairs(ops) do
      local currRes = op(res, _nums[1])
      local validEq = _checkSolvableEq(arr.slice(_nums, 2), currRes)
      if validEq then
        return true
      end
    end
    return false
  end

  return _checkSolvableEq(arr.slice(nums, 2), nums[1])
end

local function day7Pt2(inputLines)
  local parsedInput = parseInput(inputLines)
  local calibrationRes = 0
  for _, currInput in ipairs(parsedInput) do
    local testVal = currInput.testVal
    local nums = currInput.nums
    local ops = { addOp, mulOp, concatOp }
    local solvableEq = checkSolvableEq(testVal, nums, ops)
    if solvableEq then
      calibrationRes = calibrationRes + testVal
    end
  end
  return calibrationRes
end

local function day7Pt1(inputLines)
  local parsedInput = parseInput(inputLines)
  local calibrationRes = 0
  for _, currInput in ipairs(parsedInput) do
    local testVal = currInput.testVal
    local nums = currInput.nums
    local ops = { addOp, mulOp }
    local solvableEq = checkSolvableEq(testVal, nums, ops)
    if solvableEq then
      calibrationRes = calibrationRes + testVal
    end
  end
  return calibrationRes
end

local day7MainNodule = {
  day7Pt1 = day7Pt1,
  day7Pt2 = day7Pt2,
}

return day7MainNodule
