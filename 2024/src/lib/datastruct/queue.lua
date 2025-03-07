
local QueueNode = (function ()
  ---@class QueueNode
  ---@field val any
  ---@field next QueueNode|nil
  local QueueNode = {}
  QueueNode.__index = QueueNode

  function QueueNode.new(val)
    local self = setmetatable({}, QueueNode)
    self.val = val
    self.next = nil

    return self
  end

  return QueueNode
end)()

local Queue = (function ()
  ---@class Queue
  ---@field head QueueNode
  ---@field tail QueueNode
  ---@field length integer
  local Queue = {}
  Queue.__index = Queue

  function Queue.new()
    local self = setmetatable({}, Queue)
    self.head = nil
    self.tail = nil
    self.length = 0

    return self
  end

  function Queue:push(val)
    local node = QueueNode.new(val)
    if self.head == nil then
      self.head = node
    elseif self.tail == nil then
      self.tail = node
      self.head.next = node
    else
      self.tail.next = node
      self.tail = node
    end
    self.length = self.length + 1
  end

  function Queue:pop()
    local node = nil
    if self.head ~= nil then
      node = self.head
      self.head = self.head.next
      if self.head == nil or self.head.next == nil then
        self.tail = nil
      end
    end
    if node ~= nil then
      self.length = self.length - 1
    end
    return node
  end

  function Queue:empty()
    return self.head == nil
  end

  return Queue
end)()

local queueModule = {
  Queue = Queue,
}

return queueModule
