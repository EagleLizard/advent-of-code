
local Point = require("geom.point")
local arr = require("util.arr-util")

local printf = require("util.printf")
local errorf = require("util.errorf")

local bWidth = 11
local bHeight = 7
-- local bWidth = 101
-- local bHeight = 103

local Bot = (function ()
  local Bot = {}
  Bot.__index = Bot

  ---@class Bot
  ---@field origin Point
  ---@field x integer
  ---@field y integer
  ---@field v Point
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

local function printGrid(grid, bots)
  for y in ipairs(grid) do
    for x in ipairs(grid[y]) do
      local val = grid[y][x]
      if val < 1 then
        printf(".")
      else
        printf("%d", val)
      end
      if x == #grid[y] then
        printf("\n")
      end
    end
  end
end

local function day14Pt1(inputLines)
  local bots = parseInput(inputLines)
  local testBotIdx = arr.findIndex(bots, function (bot)
    return bot.x == 3 and bot.y == 5
  end)
  -- bots = { bots[testBotIdx] }
  local secs = 100
  for sec = 1, secs do
    -- local grid = {}
    -- for y = 1, bHeight do
    --   table.insert(grid, {})
    --   for x = 1, bWidth do
    --     table.insert(grid[y], 0)
    --   end
    -- end
    for _, bot in ipairs(bots) do
      -- if bot.x == 2 and bot.y == 4 then
        -- printf("%d, %d -> ", bot.x, bot.y)
        bot:move()
        -- printf("%d, %d", bot.x, bot.y)
        -- print("\n")
        -- grid[bot.y][bot.x] = grid[bot.y][bot.x] + 1
      -- end
    end

    -- printGrid(grid)
    -- print("\n")
  end
  --[[
    Count bots in quadrants.
      For the sake of correctness, I'll use proper quadrants:
      2 1
      3 4
  ]]
  local midX = math.ceil(bWidth / 2)
  local midY = math.ceil(bHeight / 2)
  printf("midX: %d\n", midX)
  printf("midY: %d\n", midY)
  return -1
end

local day14Module = {
  day14Pt1 = day14Pt1,
}

return day14Module
