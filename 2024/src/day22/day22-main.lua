
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

local function day22Part2(inputLines)
  local day22Input = parseInput(inputLines)
  local secrets = day22Input.secrets

  for _, secret in ipairs(secrets) do
    printf("%d: \n", secret)
    local bestOffer = bananas(secret)
    if bestOffer ~= nil then
      local bestPrice = bestOffer.price
      local bestSeq = bestOffer.seq
      -- printf("%d - [%s]\n", bestPrice, seqStr(bestSeq))
    end
    break
  end
  return -1;
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
