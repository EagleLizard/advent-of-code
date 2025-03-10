
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
  local mul = mul64(secret)
  secret = mix(secret, mul)
  return prune(secret)
end
local function op2(secret)
  local div = div32(secret)
  secret = mix(secret, div)
  return prune(secret)
end
local function op3(secret)
  local mul = secret * 2048
  secret = mix(secret, mul)
  return prune(secret)
end

local function getNextSecret(secret)
  -- return op3(op2(op1(secret)))
  secret = op1(secret)
  secret = op2(secret)
  secret = op3(secret)
  return secret
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

local getBananasPriceMemo = (function ()
  local cache = {}
  return function (secret)
    if cache[secret] ~= nil then
      return cache[secret]
    end
    local res = getBananasPrice(secret)
    cache[secret] = res
    return cache[secret]
  end
end)()

local function seqStr(seq)
  local str = ""
  for i, seqVal in ipairs(seq) do
    str = str..seqVal..((i == #seq and "") or ", ")
  end
  return str
end

local function seqEq(a, b)
  local eq = true
  for i, aVal in ipairs(a) do
    eq = aVal == b[i]
    if not eq then
      return false
    end
  end
  return eq
end

local function getNextDiff(secret)
  local prevPrice = getBananasPrice(secret)
  local secretN = getNextSecretMemo(secret)
  local price = getBananasPrice(secretN)
  local diff = price - prevPrice
  local res = {
    secret = secretN,
    diff = diff,
    price = price,
  }
  return res
end

local function sellAt(sellSeq, secret)
  local n = 2000
  local secretN = secret
  local seq = {}
  local prevPrice
  local price = getBananasPrice(secretN)
  local sellSeqIdx = 1
  for i=1,n do
    secretN = getNextSecretMemo(secretN)
    prevPrice = price
    price = getBananasPrice(secretN)
    local priceDiff = price - prevPrice
    -- table.insert(seq, priceDiff)
    -- if #seq > 4 then
    --   table.remove(seq, 1)
    -- end
    if priceDiff == sellSeq[sellSeqIdx] then
      sellSeqIdx = sellSeqIdx + 1
      if sellSeqIdx > #sellSeq then
        return price
      end
    else
      sellSeqIdx = 1
    end
    -- if seqEq(sellSeq, seq) then
    --   return price
    -- end
  end
end

local function findBestSeqPrice2(srcSecrets)
  local n = 2000
  -- n = 10
  local secrets = arr.copy(srcSecrets)
  local uniqSeqMap = {}
  local uniqSeqs = {}
  for i, secret in ipairs(secrets) do
    printf("%d: %s\n", i, secret)
    local secretN = secret
    local seq = {}
    local prevPrice
    local price = getBananasPrice(secret)
    for k=1,n do
      -- printf("%d: %d\n", secretN, price)
      secretN = getNextSecretMemo(secretN)
      prevPrice = price
      price = getBananasPrice(secretN)
      -- printf("%d: %d\n", secretN, price)
      local priceDiff = price - prevPrice
      table.insert(seq, priceDiff)
      if #seq > 4 then
        table.remove(seq, 1)
      end
      if #seq == 4 then
        local seqKey = seqStr(seq)
        -- if seqEq(seq, {-2, 1, -1, 3}) then
        --   printf("%d: %d\n", i, price)
        -- end
        if uniqSeqMap[seqKey] == nil then
          uniqSeqMap[seqKey] = arr.copy(seq)
          table.insert(uniqSeqs, uniqSeqMap[seqKey])
        end
      end
    end
  end
  --[[
    for every unique sequence of 4 changes, find the price we would get from 
      each seller when that sequence occurs
  ]]
  local uniqSeqCount = 0
  for k, uniqSeq in pairs(uniqSeqMap) do
    uniqSeqCount = uniqSeqCount + 1
    -- table.insert(uniqSeqs, uniqSeq)
  end
  printf("uniqSeq count: %d\n", uniqSeqCount)
  local iterCount = 0
  local sellAtCount = 0
  local maxBPrice = -math.huge
  local maxBPriceSeq = nil
  for k, uniqSeq in ipairs(uniqSeqs) do
    local priceSum = 0
    for i, secret in ipairs(secrets) do
      local sellPrice = sellAt(uniqSeq, secret)
      if sellPrice ~= nil then
        -- printf("%d: %d: %d - [%s]\n", k, i, sellPrice, seqStr(uniqSeq))
        priceSum = priceSum + sellPrice
        -- break
      end
      iterCount = iterCount + 1
      if (iterCount % 1000) == 0 then
        -- printf("%d: %d: [%s]\n", k, i, seqStr(uniqSeq))
      end
    end
    -- if seqEq({-2, 1, -1, 3}, uniqSeq) then
    --   printf("%d - [%s]\n", priceSum, seqStr(uniqSeq))
    -- end
    if priceSum > maxBPrice then
      maxBPrice = priceSum
      maxBPriceSeq = uniqSeq
      -- printf("%d - [%s]\n", maxBPrice, seqStr(maxBPriceSeq))
    end
    printf("%d / %d ~ %d - [%s]\n", k, uniqSeqCount, maxBPrice, seqStr(maxBPriceSeq))
  end
  printf("%d - [%s]\n", maxBPrice, seqStr(maxBPriceSeq))
  printf("iterCount: %d\n", iterCount)
  printf("sellAtCountt: %d\n", sellAtCount)
  return maxBPrice
end

local function day22Part2(inputLines)
  local day22Input = parseInput(inputLines)
  local secrets = day22Input.secrets
  local mostBananas = findBestSeqPrice2(secrets)
  
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
