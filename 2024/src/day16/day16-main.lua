
local printf = require("util.printf")

local Maze = (function ()
  ---@class Maze
  ---@field grid integer[][]
  ---@field width integer
  ---@field height integer
  local Maze = {}
  Maze.__index = Maze

  ---@param width integer
  ---@param height integer
  function Maze.new(width, height)
    local self = setmetatable({}, Maze)
    self.width = width
    self.height = height
    self.grid = {}
    for y = 1, height do
      local row = {}
      for x = 1, width do
        --[[ initialize to empty space ]]
        row[x] = 0
      end
      self.grid[y] = row
    end
    return self
  end

  ---@param x integer
  ---@param y integer
  function Maze:setWall(x, y)
    self.grid[y][x] = 1
  end

  function Maze:gridStr()
    local mazeStr = ""
    for y = 1, self.width do
      for x = 1, self.height do
        local val = self.grid[y][x]
        local c = nil
        if val == 0 then
          c = "."
        elseif val == 1 then
          c = "#"
        end
        mazeStr = mazeStr..c
      end
      mazeStr = mazeStr.."\n"
    end
    return mazeStr
  end

  return Maze
end)()

local function parseInput(inputLines)
  local maze = Maze.new(#inputLines[1], #inputLines)
  for y, inputLine in ipairs(inputLines) do
    local x = 1
    for c in string.gmatch(inputLine, ".") do
      if c == "#" then
        maze:setWall(x, y)
      end
      x = x + 1
    end
  end
  -- printf(maze:gridStr())
end

local function day16Pt1(inputLines)
  local day16Input = parseInput(inputLines)
  return -1
end

local day16MainModule = {
  day16Pt1 = day16Pt1,
}

return day16MainModule
