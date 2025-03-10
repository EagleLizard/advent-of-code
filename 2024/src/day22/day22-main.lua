
local printf = require("util.printf")
local arr = require("util.arr-util")

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
  secret = op1(secret)
  secret = op2(secret)
  secret = op3(secret)
  return secret
end

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

local function bananas(secret)
  --[[ 
    for each secret in a sequence, the number of bananas
      being offered is the last digit
  ]]
  local nextSecret = secret
  local prevBananasPrice
  local bananasPrice = getBananasPrice(secret)
  local bananasPriceDiff
  local diffSeq = {}
  local maxSeq = {}
  local maxPrice = -math.huge
  local n = 2000
  -- n = 10
  for i=1,n do
    nextSecret = getNextSecret(nextSecret)
    prevBananasPrice = bananasPrice
    bananasPrice = getBananasPrice(nextSecret)
    bananasPriceDiff = bananasPrice - prevBananasPrice
    table.insert(diffSeq, bananasPriceDiff)
    if #diffSeq > 4 then
      table.remove(diffSeq, 1)
    end
    if bananasPrice > maxPrice and #diffSeq == 4 then
      maxPrice = bananasPrice
      maxSeq = arr.copy(diffSeq)
    end
    -- printf("%d - %d: %d (%d)\n", i, nextSecret, bananasPrice, bananasPriceDiff)
    -- if #diffSeq == 4 then
    --   printf("%d [%s]\n", bananasPrice, seqStr(diffSeq))
    -- end
  end
  -- for k, seqVal in ipairs(maxSeq) do
  --   printf("%d%s", seqVal, (k == #maxSeq and "\n") or ", ")
  -- end
  if #maxSeq < 1 then
    return nil
  end
  local res = {
    price = maxPrice,
    seq = maxSeq,
  }
  return res
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

--[[ 
  find the price of the first occurrence of the sequence in the secret
    if it exists
]]
local function findBestSeqPrice(srcSecrets)
  local n = 2000
  n = 10
  local function helper(secrets, secret, targetSeq)
    -- printf("secret: %d\n", secret)
    local secretN = secret
    local seq = {}
    local prevPrice
    local price = getBananasPrice(secret)
    for i=1,n do
      secretN = getNextSecret(secretN)
      prevPrice = price
      price = getBananasPrice(secretN)
      local priceDiff = price - prevPrice
      table.insert(seq, priceDiff)
      if #seq > 4 then
        table.remove(seq, 1)
      end
      if #seq == 4 then
        -- printf("%d - [%s]\n", price, seqStr(seq))
        local nTargetSeq
        if targetSeq == nil then
          nTargetSeq = seq
        else
          nTargetSeq = targetSeq
        end
        if #secrets > 0 then
          local nSecrets = arr.copy(secrets)
          local nextSecret = table.remove(nSecrets, 1)
          helper(nSecrets, nextSecret, nTargetSeq)
        end
      end
    end
    -- if #secrets > 0 then
    --   secrets = arr.copy(secrets)
    --   local nextSecret = table.remove(secrets, 1)
    --   helper(secrets, nextSecret)
    -- end
  end
  --[[
    for every sequence in the first sellers secrets, find the 
      sequence (if any) in the next seller's secrets.
  ]]
  local secrets = arr.copy(srcSecrets)
  local secret = table.remove(secrets, 1)
  helper(secrets, secret)
  for i, secret in ipairs(secrets) do
    
  end
end

local function sellAt(sellSeq, secret)
  local n = 2000
  local secretN = secret
  local seq = {}
  local prevPrice
  local price = getBananasPrice(secretN)
  for i=1,n do
    secretN = getNextSecret(secretN)
    prevPrice = price
    price = getBananasPrice(secretN)
    local priceDiff = price - prevPrice
    table.insert(seq, priceDiff)
    if #seq > 4 then
      table.remove(seq, 1)
    end
    if seqEq(sellSeq, seq) then
      return price
    end
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
      secretN = getNextSecret(secretN)
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
  local maxBPrice = -math.huge
  local maxBPriceSeq = nil
  for k, uniqSeq in ipairs(uniqSeqs) do
    local priceSum = 0
    for i, secret in ipairs(secrets) do
      local sellPrice = sellAt(uniqSeq, secret)
      if sellPrice ~= nil then
        -- printf("%d: %d - [%s]\n", i, sellPrice, seqStr(uniqSeq))
        priceSum = priceSum + sellPrice
        -- break
      end
    end
    -- if seqEq({-2, 1, -1, 3}, uniqSeq) then
    --   printf("%d - [%s]\n", priceSum, seqStr(uniqSeq))
    -- end
    if priceSum > maxBPrice then
      maxBPrice = priceSum
      maxBPriceSeq = uniqSeq
      printf("%d - [%s]\n", maxBPrice, seqStr(maxBPriceSeq))
    end
  end
  printf("%d - [%s]\n", maxBPrice, seqStr(maxBPriceSeq))
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
