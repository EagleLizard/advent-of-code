
module.exports = {
  day22Part1,
  day22Part2,
};

function day22Part2(inputLines) {
  let day22Input = parseInput(inputLines);
  let secrets = day22Input.secrets;
  for(let i = 0; i < secrets.length; ++i) {
    let secret = secrets[i];
    console.log(`${i}: ${secret}`);
  }
  let best = findBestPriceSeq(secrets);
  return best;
}

function findBestPriceSeq(srcSecrets) {
  let n = 2000;
  // n = 10;
  let secrets = srcSecrets.slice();
  let uniqSeqMap = new Map();
  let uniqSeqs = [];
  for(let i = 0; i < secrets.length; ++i) {
    let secret = secrets[i];
    let secretN = secret;
    let seq = [];
    let price = getBananaPrice(secretN);
    let prevPrice;
    for(let k = 1; k < n; ++k) {
      secretN = getNextSecret(secretN);
      prevPrice = price;
      price = getBananaPrice(secretN);
      let priceDiff = price - prevPrice;
      // console.log(`${secretN}: ${price} (${priceDiff})`);
      seq.push(priceDiff);
      if(seq.length > 4) {
        seq.shift();
      }
      if(seq.length === 4) {
        let seqKey = getSeqStr(seq);
        if(!uniqSeqMap.has(seqKey)) {
          uniqSeqMap.set(seqKey, seq.slice());
          uniqSeqs.push(uniqSeqMap.get(seqKey));
        }
      }
    }
  }
  console.log(`uniqSeq count: ${uniqSeqs.length}`);
  let maxBPrice = -Infinity;
  let maxBSeq = undefined;
  for(let k = 0; k < uniqSeqs.length; ++k) {
    let uniqSeq = uniqSeqs[k];
    let priceSum = 0n;
    for(let i = 0; i < secrets.length; ++i) {
      let secret = secrets[i];
      let sellPrice = sellAt(uniqSeq, secret);
      if(sellPrice !== undefined) {
        priceSum += sellPrice;
      }
    }
    if(priceSum > maxBPrice) {
      maxBPrice = priceSum;
      maxBSeq = uniqSeq;
      console.log(`${maxBPrice} - [${getSeqStr(maxBSeq)}]`);
    }
    console.log(`${k} / ${uniqSeqs.length} ~ ${maxBPrice} - [${getSeqStr(maxBSeq)}]`);
  }
  return maxBPrice;
}

function sellAt(sellSeq, secret) {
  let n = 2000;
  let secretN = secret;
  let seq = [];
  let prevPrice;
  let price = getBananaPrice(secret);
  let sellSeqIdx = 0;
  for(let i = 0; i < n; ++i) {
    secretN = getNextSecret(secretN);
    prevPrice = price;
    price = getBananaPrice(secretN);
    let priceDiff = price - prevPrice;
    if(priceDiff === sellSeq[sellSeqIdx]) {
      sellSeqIdx++;
      if(sellSeqIdx > sellSeq.length - 1) {
        return price;
      }
    } else {
      sellSeqIdx = 0;
    }
  }
}

function getSeqStr(seq) {
  return seq.join(',');
}

function getBananaPrice(secret) {
  return secret % 10n;
}

/*
14180628689 - correct
_*/
function day22Part1(inputLines) {
  let n = 2000;
  // n = 10;
  let day22Input = parseInput(inputLines);
  let secrets = day22Input.secrets;
  let secretSum = 0n;
  for(let i = 0; i < secrets.length; ++i) {
    let secret = secrets[i];
    let secretN = secret;
    for(let k = 0; k < n; ++k) {
      secretN = getNextSecret(secretN);
    }
    secretSum += secretN;
  }
  return secretSum;
}

function getNextSecret(secret) {
  secret = op1(secret);
  secret = op2(secret);
  secret = op3(secret);
  return secret;
}

function op1(secret) {
  let mul = secret * 64n;
  secret = mix(secret, mul);
  secret = prune(secret);
  return secret;
}

function op2(secret) {
  let div = secret / 32n;
  secret = mix(secret, div);
  secret = prune(secret);
  return secret;
}

function op3(secret){
  let mul = secret * 2048n;
  secret = mix(secret, mul);
  secret = prune(secret);
  return secret;
}

function mix(secret, val) {
  return secret ^ val;
}

function prune(secret) {
  return secret % 16777216n;
}

function parseInput(inputLines) {
  let secrets = [];
  for(let i = 0; i < inputLines.length; ++i) {
    let inputLine = inputLines[i];
    if(/^\d+$/.test(inputLine)) {
      secrets.push(BigInt(+inputLine));
    }
  }
  let res = {
    secrets,
  };
  return res;
}
