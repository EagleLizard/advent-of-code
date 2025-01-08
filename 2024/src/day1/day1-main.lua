
local function parseInput(inputLines)
  local list1 = {}
  local list2 = {}
  for _, currLine in ipairs(inputLines) do
    local val1, val2 = currLine:gmatch("(%d+)%s+(%d+)")()
    local n1 = tonumber(val1)
    local n2 = tonumber(val2)
    table.insert(list1, n1)
    table.insert(list2, n2)
  end
  local res = {
    list1 = list1,
    list2 = list2,
  }
  return res
end

local function day2Pt2(inputLines)
  local parsedInput = parseInput(inputLines)
  local list1 = parsedInput.list1
  local list2 = parsedInput.list2
  local scores = {}
  for _, l in ipairs(list1) do
    local rCount = 0
    for _, r in ipairs(list2) do
      if l == r then
        rCount = rCount + 1
      end
    end
    local score = l * rCount
    table.insert(scores, score)
  end
  local scoreSum = 0
  for _, score in ipairs(scores) do
    scoreSum = scoreSum + score
  end
  return scoreSum
end

--[[ 
  2196996 - correct
]]
local function day1Pt1(inputLines)
  local parsedInput = parseInput(inputLines)
  local list1 = parsedInput.list1
  local list2 = parsedInput.list2
  table.sort(list1)
  table.sort(list2)
  local listDiffs = {}
  for i, n1 in ipairs(list1) do
    local currDiff = math.abs(n1 - list2[i])
    table.insert(listDiffs, currDiff)
  end
  local totalDistance = 0
  for _, n in ipairs(listDiffs) do
    totalDistance = totalDistance + n
  end
  return totalDistance
end

local day1Module = {
  day1Pt1 = day1Pt1,
  day2Pt2 = day2Pt2,
}

return day1Module
