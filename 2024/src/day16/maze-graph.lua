
local mazeModule = require("day16.maze")
local mazeEnum = mazeModule.mazeEnum
local mazeCharMap = mazeModule.mazeCharMap

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

  ---@param direction integer
  ---@return MazeNode|nil
  function MazeNode:next(direction)
    local nextNode
    if direction == 1 then
      nextNode = self.up
    elseif direction == 2 then
      nextNode = self.right
    elseif direction == 3 then
      nextNode = self.down
    elseif direction == 4 then
      nextNode = self.left
    end
    return nextNode
  end

  return MazeNode
end)()

local function getNodeGrid(grid)
  local nodeGrid = {}
  for y in ipairs(grid) do
    local row = {}
    for x in ipairs(grid[y]) do
      local val = grid[y][x]
      if val == mazeEnum.tile then
        row[x] = MazeNode.new(x, y)
      end
      -- printf("%d%s", grid[y][x], (x == #grid[y] and "\n") or "")
    end
    nodeGrid[y] = row
  end
  --[[ connect nodes ]]
  for y in ipairs(grid) do
    for x in ipairs(grid[y]) do
      local node = nodeGrid[y][x]
      if node ~= nil then
        --[[ connect to adjacent nodes ]]
        if grid[y - 1][x] == mazeEnum.tile then
          node.up = nodeGrid[y - 1][x]
        end
        if grid[y][x + 1] == mazeEnum.tile then
          node.right = nodeGrid[y][x + 1]
        end
        if grid[y + 1][x] == mazeEnum.tile then
          node.down = nodeGrid[y + 1][x]
        end
        if grid[y][x - 1] == mazeEnum.tile then
          node.left = nodeGrid[y][x - 1]
        end
      end
    end
  end
  return nodeGrid
end

local MazeGraph = (function ()
  ---@class MazeGraph
  ---@field grid integer[][]
  ---@field width integer
  ---@field height integer
  ---@field nodes MazeNode[]
  ---@field nodeGrid MazeNode[][]
  local MazeGraph = {}
  MazeGraph.__index = MazeGraph

  function MazeGraph.new(grid, sPos, ePos)
    local self = setmetatable({}, MazeGraph)
    self.grid = grid
    self.width = #self.grid[1]
    self.height = #self.grid
    self.nodes = {}
    self.nodeGrid = getNodeGrid(self.grid)
    for _, row in pairs(self.nodeGrid) do
      for _, node in pairs(row) do
        table.insert(self.nodes, node)
      end
    end
    return self
  end

  function MazeGraph:getNodeById(id)
    for _, node in pairs(self.nodes) do
      if id == node.id then
        return node
      end
    end
    return nil
  end

  function MazeGraph:gridCopy()
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

  ---@param visited? boolean[]
  function MazeGraph:gridStr(visited)
    visited = visited or {}
    local mazeStr = ""
    for y = 1, self.height do
      for x = 1, self.width do
        local node = self.nodeGrid[y][x]
        local nodeId = node and node.id
        local c = (visited[nodeId] and "o") or mazeCharMap[self.grid[y][x]]
        mazeStr = mazeStr..c
      end
      mazeStr = mazeStr.."\n"
    end
    return mazeStr
  end

  ---@param path { node: MazeNode, direction: integer, cost: integer }[]
  ---@return string
  function MazeGraph:pathStr(path)
    local grid = self:gridCopy()
    local charGrid = {}
    for y in ipairs(grid) do
      local row = {}
      for x in ipairs(grid[y]) do
        local c = mazeCharMap[grid[y][x]]
        row[x] = c
      end
      charGrid[y] = row
    end
    local arrows = { "^", ">", "v", "<", }
    for _, pathPart in ipairs(path) do
      charGrid[pathPart.node.y][pathPart.node.x] = arrows[pathPart.direction]
    end
    local gridStr = ""
    for y in ipairs(charGrid) do
      for _, c in ipairs(charGrid[y]) do
        gridStr = gridStr..c
      end
      gridStr = gridStr.."\n"
    end
    return gridStr
  end
  
  return MazeGraph
end)()

local mazeGraphModule = {
  MazeGraph = MazeGraph,
  MazeNode = MazeNode,
}

return mazeGraphModule
