
local function findIndex(arr, compFn)
  local foundIdx = nil
  for i, v in ipairs(arr) do
    if compFn(v, i, arr) then
      foundIdx = i
      break
    end
  end
  return foundIdx
end

local function indexOf(arr, searchVal)
  local foundIdx = nil
  for i, v in ipairs(arr) do
    if searchVal == v then
      foundIdx = i
      break
    end
  end
  return foundIdx
end

local function contains(tab, searchEl)
  for _, val in pairs(tab) do
    if searchEl == val then
      return true
    end
  end
  return false
end

-- shallow clone
local function copy(tab)
  local tabCopy = {}
  for k, v in pairs(tab) do
    tabCopy[k] = v
  end
  return tabCopy
end

--[[ 
  remove elem at idx and return copy
]]
local function removeIdx(tab, idx)
  local resTab = {}
  for k, v in ipairs(tab) do
    if k ~= idx then
      table.insert(resTab, v)
    end
  end
  return resTab
end

local arrUtilModule = {
  findIndex = findIndex,
  indexOf = indexOf,
  contains = contains,
  copy = copy,
  removeIdx = removeIdx,
}

return arrUtilModule
