
local printf = require("util.printf")
local arr = require("util.arr-util")
local queueModule = require("lib.datastruct.queue")
local Queue = queueModule.Queue

local function parseInput(inputLines)
  local secrets = {}
  for _, inputLine in ipairs(inputLines) do
    local numStr = string.match(inputLine, "%d+")
    local num = tonumber(numStr)
    if num ~= nil then
      table.insert(secrets, num)
    end
  end
  local res = {
    secrets = secrets,
  }
  return res
end

local function mix(secret, val)
  -- printf("mix: %s ~ %s\n", val, secret)
  return secret ~ val
end

local function prune(val)
  return val % 16777216
end

local function div32(secret)
  local res = math.floor(secret / 32)
  -- local remainder = divRes % 1
  -- local res
  -- if(remainder < 0.5) then
  --   res = math.floor(divRes)
  -- else
  --   res = math.floor(divRes + 1)
  -- end
  -- printf("%s, %d\n", divRes, res)
  return res
end

local function mul64(secret)
  return secret * 64
end

local function op1(secret)
  -- local mul = mul64(secret)
  -- secret = mix(secret, mul)
  -- return prune(secret)
  return (secret ~ (secret * 64)) % 16777216
end
local function op2(secret)
  -- local div = div32(secret)
  -- secret = mix(secret, div)
  -- return prune(secret)
  -- return prune(mix(secret, math.floor(secret / 32)))
  return (secret ~ math.floor(secret / 32)) % 16777216
end
local function op3(secret)
  -- local mul = secret * 2048
  -- secret = mix(secret, mul)
  -- return prune(secret)
  -- secret = mix(secret, secret * 2048)
  return (secret ~ (secret * 2048)) % 16777216
end

local function getNextSecret(secret)
  secret = (secret ~ (secret * 64)) % 16777216
  secret = (secret ~ math.floor(secret / 32)) % 16777216
  return (secret ~ (secret * 2048)) % 16777216
  -- return op3(op2(op1(secret)))
  -- secret = op1(secret)
  -- secret = op2(secret)
  -- secret = op3(secret)
  -- return secret
end

local getNextSecretMemo = (function ()
  local cache = {}
  return function(secret)
    if cache[secret] ~= nil then
      return cache[secret]
    end
    local res = getNextSecret(secret)
    cache[secret] = res
    return cache[secret]
  end
end)()

local function getSecretN(secret, n)
  for i=1, n do
    secret = getNextSecret(secret)
  end
  return secret
end

local function getBananasPrice(secret)
  return secret % 10
end

local function seqStr(seq)
  local str = ""
  for i, seqVal in ipairs(seq) do
    str = str..seqVal..((i == #seq and "") or ", ")
  end
  return str
end

local function getUniqueSeqs(srcSecrets)
  local n = 2001
  local secrets = arr.copy(srcSecrets)
  local uniqSeqMap = {}
  local uniqSeqs = {}
  for i, secret in ipairs(secrets) do
    local secretN = secret
    local seq = {}
    local price = getBananasPrice(secretN)
    local prevPrice
    for k=1, n do
      prevPrice = price
      secretN = getNextSecret(secretN)
      price = getBananasPrice(secretN)
      local priceDiff = price - prevPrice
      table.insert(seq, priceDiff)
      if #seq > 4 then
        table.remove(seq, 1)
      end
      if #seq == 4 then
        local seqKey = seqStr(seq)
        if uniqSeqMap[seqKey] == nil then
          uniqSeqMap[seqKey] = arr.copy(seq)
          table.insert(uniqSeqs, uniqSeqMap[seqKey])
        end
      end
    end
  end
  printf("%d\n", #uniqSeqs)
  return uniqSeqs
end

local function findBestSeqPrice3(srcSecrets)
  local n = 2001
  local secrets = arr.copy(srcSecrets)
  local uniqSeqs = getUniqueSeqs(secrets)
  local seqMaps = {}
   for i, secret in ipairs(secrets) do
    local secretN = secret
    local seq = {}
    local price = getBananasPrice(secretN)
    local prevPrice
    local seqMap = {}
    for k=1,n do
      prevPrice = price
      secretN = getNextSecret(secretN)
      price = getBananasPrice(secretN)
      local priceDiff = price - prevPrice
      table.insert(seq, priceDiff)
      if #seq > 4 then
        table.remove(seq, 1)
      end
      if #seq == 4 then
        local seqKey = seqStr(seq)
        if seqMap[seqKey] == nil then
          seqMap[seqKey] = price
        end
      end
    end
    table.insert(seqMaps, seqMap)
  end
  local globalSeqMap = {}
  for i, uniqSeq in ipairs(uniqSeqs) do
    local uniqSeqKey = seqStr(uniqSeq)
    for k, seqMap in ipairs(seqMaps) do
      if seqMap[uniqSeqKey] ~= nil then
        globalSeqMap[uniqSeqKey] = (globalSeqMap[uniqSeqKey] or 0) + seqMap[uniqSeqKey]
      end
    end
  end
  local bestPrice = -math.huge
  local bestPriceSeq = nil
  for seqKey, seqPrice in pairs(globalSeqMap) do
    if seqPrice > bestPrice then
      bestPrice = seqPrice
      bestPriceSeq = seqKey
    end
  end
  printf("[%s] - %s\n", bestPriceSeq, bestPrice)
  return bestPrice
end

--[[ 
  1690 - correct
]]
local function day22Part2(inputLines)
  local day22Input = parseInput(inputLines)
  local secrets = day22Input.secrets
  local mostBananas = findBestSeqPrice3(secrets)
  return mostBananas;
end

--[[ 
  14180628689 - correct
]]
local function day22Part1(inputLines)
  local day22Input = parseInput(inputLines)
  local secrets = day22Input.secrets
  local secretSum = 0
  for i, secret in ipairs(secrets) do
    -- printf("%d: %d :\n", i, secret)
    -- local nextSecret = secret
    local nextSecret = getSecretN(secret, 2000)
    -- printf("%s\n", nextSecret)
    secretSum = secretSum + nextSecret
  end
  return secretSum
end

local day22MainModule = {
  day22Part1 = day22Part1,
  day22Part2 = day22Part2,
}

return day22MainModule
