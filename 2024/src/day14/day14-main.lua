
local Point = require("geom.point")
local arr = require("util.arr-util")

local printf = require("util.printf")
local errorf = require("util.errorf")

-- local bWidth = 11
-- local bHeight = 7
local bWidth = 101
local bHeight = 103

local Bot = (function ()
  local Bot = {}
  Bot.__index = Bot

  ---@class Bot
  ---@field origin Point
  ---@field x integer
  ---@field y integer
  ---@field v Point
  ---@field move fun(self: Bot)  -- Add this line to annotate the move method
  function Bot.new(x, y, vx, vy)
    local self = setmetatable({}, Bot)
    self.origin = Point.new(x, y)
    self.x = x
    self.y = y
    self.v = Point.new(vx, vy)
    return self
  end

  --[[ advance 1s ]]
  function Bot:move()
    local x, y
    x = self.x + self.v.x
    y = self.y + self.v.y
    if x > bWidth then
      x = x % bWidth
    -- elseif x < 1 then
    --   x = x % bWidth
    elseif x == 0 then
      x = bWidth
    elseif x < 1 then
      -- printf("x: %d\n", x)
      x = x % bWidth
    end
    if y > bHeight then
      y = y % bHeight 
    elseif y == 0 then
      y = bHeight
    elseif y < 1 then
      y = y % bHeight
    end
    self.x = x
    self.y = y
  end

  return Bot
end)()

---comment
---@param inputLines string[]
---@return Bot[]
local function parseInput(inputLines)
  local bots = {}
  for _, inputLine in ipairs(inputLines) do
    local xStr, yStr, vxStr, vyStr = string.match(inputLine, "p=(%d+),(%d+) v=(%-?%d+),(%-?%d+)")
    local x = tonumber(xStr) or errorf("invalid number: %s", xStr)
    local y = tonumber(yStr) or errorf("invalid number: %s", yStr)
    local vx = tonumber(vxStr) or errorf("invalid number: %s", vxStr)
    local vy = tonumber(vyStr) or errorf("invalid number: %s", vyStr)
    -- table.insert(bots, {
    --   origin = Point.new(x, y),
    --   x = x,
    --   y = y,
    --   v = Point.new(vx, vy),
    -- })
    --[[ 
      add 1 to origin because lua uses 1 based indices
    ]]
    x = x + 1
    y = y + 1
    local bot = Bot.new(x, y, vx, vy)
    table.insert(bots, bot)
  end
  return bots
end

local function printGrid(grid, withQuads)
  local width = #grid[1]
  local height = #grid
  local midX = math.ceil(width / 2)
  local midY = math.ceil(height / 2)
  withQuads = withQuads or false
  if withQuads then
    printf("midX: %d\n", midX)
    printf("midY: %d\n", midY)
  end
  for y = 1, height do
    for x = 1, width do
      local val = grid[y][x]
      if withQuads and (y == midY or x == midX) then
        printf(" ")
      elseif val < 1 then
        printf(".")
      else
        printf("%d", val)
      end
      if x == #grid[y] then
        printf("\n")
      end
    end
  end
  printf("\n")
end

local function getBathroomGrid(bots, width, height)
  local grid = {}
  for y = 1, height do
    table.insert(grid, {})
    for x = 1, width do
      table.insert(grid[y], 0)
    end
  end
  for _, bot in ipairs(bots) do
    grid[bot.y][bot.x] = grid[bot.y][bot.x] + 1
  end
  return grid
end

local function printGrid2(bots)
  local grid = {}
  local width = bWidth
  local height = bHeight
  for y = 1, height do
    table.insert(grid, {})
    for _ = 1, width do
      table.insert(grid[y], 0)
    end
  end
  for _, bot in ipairs(bots) do
    grid[bot.y][bot.x] = grid[bot.y][bot.x] + 1
  end
  for y in ipairs(grid) do
    for x in ipairs(grid[y]) do
      local val = grid[y][x]
      if val < 1 then
        printf(".")
      else
        printf("o")
      end
      if x == width then
        printf("\n")
      end
    end
  end
end

local function checkXmasTree(bots)
  local width = bWidth
  local height = bHeight
  local hasTree = false
  local nBoxes = 6
  local boxWidth = math.floor(width / nBoxes)
  local boxHeight = math.floor(height / nBoxes)
  local numBots = #bots
  local grid = getBathroomGrid(bots, width, height)

  --[[
    search regions of the grid
  ]]
  for by = 1, nBoxes do
    for bx = 1, nBoxes do
      local subGrid = {}
      local yStart
      if by == 1 then
        yStart = 1
      else
        yStart = (by - 1) * boxHeight
      end
      local xStart
      if bx == 1 then
        xStart = 1
      else
        xStart = (bx - 1) * boxWidth
      end
      -- printf("%d, %d\n", xStart, yStart)
      -- printf("bw: %d\n", boxWidth)
      -- printf("xStart+bw-1: %d\n", xStart + boxWidth-1)
      local currBotCount = 0
      local cellCount = 0
      for y = yStart, yStart + boxHeight do
        for x = xStart, xStart + boxWidth do
          cellCount = cellCount + 1
          local val = grid[y][x]
          if val > 0 then
            currBotCount = currBotCount + 1
            -- printf("o")
          end
        end
        -- printf("\n")
      end
      local currBotPct = currBotCount / cellCount
      if currBotPct > 0.2 then
        return true
      end
    end
    -- printf("\n")
  end
  -- hasTree = true
  return hasTree
end

--[[ 
7672 - correct
]]

local function day14Pt2(inputLines)
  local bots = parseInput(inputLines)
  local hasTree = false
  local sec = 0
  -- local maxSecs = 500
  local maxSecs = 1e4
  while not hasTree and sec <= maxSecs do
    for _, bot in ipairs(bots) do
      bot:move()
    end
    sec = sec + 1
    -- printGrid2(bots)
    if checkXmasTree(bots) then
      hasTree = true
      -- printf("sec: %d\n", sec)
      -- printGrid2(bots)
    end
  end
  return sec
end

--[[
  230686500 - correct
]]
local function day14Pt1(inputLines)
  local bots = parseInput(inputLines)
  -- local testBotIdx = arr.findIndex(bots, function (bot)
  --   return bot.x == 3 and bot.y == 5
  -- end)
  -- bots = { bots[testBotIdx] }
  local secs = 100
  for _ = 1, secs do
    for _, bot in ipairs(bots) do
      bot:move()
    end
  end

  --[[
    Count bots in quadrants.
      For the sake of correctness, I'll use proper quadrants:
      2 1
      3 4
  ]]
  local midX = math.ceil(bWidth / 2)
  local midY = math.ceil(bHeight / 2)
  -- local grid = getBathroomGrid(bots, bWidth, bHeight)
  -- printGrid(grid)
  -- printf("midX: %d\n", midX)
  -- printf("midY: %d\n", midY)
  -- printGrid(grid, true)
  local quads = { 0, 0, 0, 0 }
  for _, bot in ipairs(bots) do
    if bot.y < midY then
      if bot.x > midX then
        quads[1] = quads[1] + 1
      elseif bot.x < midX then
        quads[2] = quads[2] + 1
      end
    elseif bot.y > midY then
      if bot.x < midX then
        quads[3] = quads[3] + 1
      elseif bot.x > midX then
        quads[4] = quads[4] + 1
      end
    end
  end
  local quadProduct = quads[1]
  for i = 2, #quads do
    quadProduct = quadProduct * quads[i]
  end
  return quadProduct
end

local day14Module = {
  day14Pt1 = day14Pt1,
  day14Pt2 = day14Pt2,
}

return day14Module
