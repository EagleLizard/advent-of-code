
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

local function contains(tab, searchEl)
  for _, val in pairs(tab) do
    if searchEl == val then
      return true
    end
  end
  return false
end

local arrUtilModule = {
  findIndex = findIndex,
  contains = contains,
}

return arrUtilModule
