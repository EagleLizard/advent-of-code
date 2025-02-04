
local mazeEnum = {
  tile = 0,
  wall = 2,
}

--[[ from int val to char ]]
local mazeCharMap = {
  [0] = ".",
  [2] = "#",
}

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
        --[[ initialize to empty tiles ]]
        row[x] = mazeEnum.tile
      end
      self.grid[y] = row
    end
    return self
  end

  ---@param x integer
  ---@param y integer
  function Maze:setWall(x, y)
    self.grid[y][x] = mazeEnum.wall
  end

  ---@return integer[][]
  function Maze:gridCopy()
    local cpy = {}
    for y in ipairs(self.grid) do
      local row = {}
      for x in ipairs(self.grid[y]) do
        row[x] = self.grid[y][x]
      end
      cpy[y] = row
    end
    return cpy
  end

  ---@param visited? boolean[][]
  function Maze:gridStr(visited)
    local mazeStr = ""
    for y = 1, self.width do
      for x = 1, self.height do
        local val = self.grid[y][x]
        local c = mazeCharMap[val]
        mazeStr = mazeStr..c
      end
      mazeStr = mazeStr.."\n"
    end
    return mazeStr
  end

  return Maze
end)()

local mazeModule = {
  Maze = Maze,
  mazeEnum = mazeEnum,
}
return mazeModule
