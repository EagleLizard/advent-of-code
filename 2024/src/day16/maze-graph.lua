
local mazeModule = require("day16.maze")
local mazeEnum = mazeModule.mazeEnum

local printf = require("util.printf")

local MazeNode = (function ()
  ---@class MazeNode
  ---@field x integer
  ---@field y integer
  ---@field id integer
  ---@field up MazeNode|nil
  ---@field right MazeNode|nil
  ---@field down MazeNode|nil
  ---@field left MazeNode|nil
  local MazeNode = {}
  MazeNode.__index = MazeNode

  local idCounter = 1

  ---@param x integer
  ---@param y integer
  function MazeNode.new(x, y)
    local self = setmetatable({}, MazeNode)
    self.x = x
    self.y = y
    self.id = idCounter
    idCounter = idCounter + 1
    return self
  end

  return MazeNode
end)()

local MazeGraph = (function ()
  ---@class MazeGraph
  ---@field grid integer[][]
  ---@field sPos Point
  local MazeGraph = {}
  MazeGraph.__index = MazeGraph

  function MazeGraph.new(grid, sPos)
    local self = setmetatable({}, MazeGraph)
    self.grid = grid
    self.sPos = sPos
    self:connect()
    return self
  end

  function MazeGraph:connect()
    printf("sPos: (%d, %d)\n", self.sPos.x, self.sPos.y)
    --[[ initialize a grid of nodes ]]
    local nodeGrid = {}
    for y in ipairs(self.grid) do
      local row = {}
      for x in ipairs(self.grid[y]) do
        local val = self.grid[y][x]
        -- printf("%d%s", val, (x == #self.grid[y] and "\n") or "")
        if val == mazeEnum.tile then
          row[x] = MazeNode.new(x, y)
        end
      end
      table.insert(nodeGrid, row)
    end
    for y in ipairs(nodeGrid) do
      for x in pairs(nodeGrid[y]) do
        printf("%d%s", nodeGrid[y][x].id, (x == #nodeGrid[y] and "\n") or " ")
      end
    end
  end

  return MazeGraph
end)()

local mazeGraphModule = {
  MazeGraph = MazeGraph,
}

return mazeGraphModule
