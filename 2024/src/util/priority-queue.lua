
local PriorityQueue = (function ()
  ---@class PriorityQueue
  ---@field plist  {p: integer, val: any}[]
  local PriorityQueue = {}
  PriorityQueue.__index = PriorityQueue

  function PriorityQueue.new()
    local self = setmetatable({}, PriorityQueue)
    self.plist = {}
    return self
  end

  function PriorityQueue:insert(p, val)
    table.insert(self.plist, {
      p = p,
      val = val,
    })
  end

  function PriorityQueue:peekMin()
    local smallest = nil
    for _, pItem in ipairs(self.plist) do
      if (smallest == nil) or (pItem.p < smallest.p) then
        smallest = pItem
      end
    end
    return smallest and smallest.val
  end

  function PriorityQueue:pullMin()
    local smallest = nil
    local smallestIdx = nil
    for i, pItem in ipairs(self.plist) do
      if (smallest == nil) or (pItem.p < smallest.p) then
        smallest = pItem
        smallestIdx = i
      end
    end
    if smallestIdx ~= nil then
      smallest = table.remove(self.plist, smallestIdx)
    end
    return smallest and smallest.val
  end

  return PriorityQueue
end)()

local priorityQueueModule = {
  PriorityQueue = PriorityQueue,
}

return priorityQueueModule
