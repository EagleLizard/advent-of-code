
module.exports = {
  day22Part1,
  day22Part2,
};

/*
1499 | 3039737.26925 ms - too low. Curiously, it's the right answer for someone else.
1690 | 16030.579125 ms - correct
_*/
function day22Part2(inputLines) {
  let day22Input = parseInput(inputLines);
  let secrets = day22Input.secrets;
  // for(let i = 0; i < secrets.length; ++i) {
  //   let secret = secrets[i];
  //   console.log(`${i}: ${secret}`);
  // }
  let best;
  // best = findBestPriceSeq(secrets);
  best = findBestPriceSeq2(secrets);
  return best;
}

function findBestPriceSeq(srcSecrets) {
  // const getNextSecretMemo = getGetNextSecretMemo();
  let n = 2001;
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
    for(let k = 0; k < n; ++k) {
      secretN = getNextSecret(secretN);
      prevPrice = price;
      price = getBananaPrice(secretN);
      let priceDiff = price - prevPrice;
      // console.log(`${secretN}: ${price} (${priceDiff})`);
      if(seq.length === 4) {
        let seqKey = getSeqStr(seq);
        if(!uniqSeqMap.has(seqKey)) {
          uniqSeqMap.set(seqKey, seq.slice());
          uniqSeqs.push(uniqSeqMap.get(seqKey));
          // uniqSeqs.push(uniqSeqMap.get(seqKey));
        }
      }
      seq.push(priceDiff);
      if(seq.length > 4) {
        seq.shift();
      }
    }
  }
  console.log(`uniqSeq count: ${uniqSeqs.length}`);
  console.log(`uniqSeq count: ${uniqSeqMap.size}`);
  let maxBPrice = -Infinity;
  let maxBSeq = undefined;
  for(let k = 0; k < uniqSeqs.length; ++k) {
    let uniqSeq = uniqSeqs[k];
    let priceSum = 0n;
    for(let i = 0; i < secrets.length; ++i) {
      let secret = secrets[i];
      let sellPrice = sellAt(uniqSeq, secret);
      priceSum += sellPrice;
    }
    if(priceSum > maxBPrice) {
      maxBPrice = priceSum;
      maxBSeq = uniqSeq;
      console.log(`${maxBPrice} - [${getSeqStr(maxBSeq)}]`);
    }
    // process.stdout.write(`${k} / ${uniqSeqs.length} ~ ${maxBPrice} - [${getSeqStr(maxBSeq)}]\n`);
  }
  return maxBPrice;
}

function findBestPriceSeq2(srcSecrets) {
  let n = 2001;
  let secrets = srcSecrets.slice();
  let uniqSeqs = getUniqueSeqs(secrets);
  let seqMaps = [];
  for(let i = 0; i < secrets.length; ++i) {
    let secret = secrets[i];
    let secretN = secret;
    let seq = [];
    let price = getBananaPrice(secretN);
    let prevPrice;
    let seqMap = new Map();
    // for(let k = 0; k < uniqSeqs.length; ++k) {
    //   let uniqSeq = uniqSeqs[k];
    //   let seqKey = getSeqStr(uniqSeq);
    //   seqMap.set(seqKey, 0);
    // }
    for(let k = 0; k < n; ++k) {
      prevPrice = price;
      secretN = getNextSecret(secretN);
      price = getBananaPrice(secretN);
      let priceDiff = price - prevPrice;
      seq.push(priceDiff);
      if(seq.length > 4) {
        seq.shift();
      }
      if(seq.length === 4) {
        let seqKey = getSeqStr(seq);
        if(!seqMap.has(seqKey)) {
          seqMap.set(seqKey, price);
        }
      }
    }
    seqMaps.push(seqMap);
  }
  let globalSeqMap = new Map();
  for(let i = 0; i < uniqSeqs.length; ++i) {
    let uniqSeq = uniqSeqs[i];
    let uniqSeqKey = getSeqStr(uniqSeq);
    for(let k = 0; k < seqMaps.length; ++k) {
      let seqMap = seqMaps[k];
      if(seqMap.has(uniqSeqKey)) {
        if(!globalSeqMap.has(uniqSeqKey)) {
          globalSeqMap.set(uniqSeqKey, 0n);
        }
        let globalSeqPrice = globalSeqMap.get(uniqSeqKey);
        globalSeqMap.set(uniqSeqKey, globalSeqPrice + seqMap.get(uniqSeqKey));
      }
    }
  }
  let bestPrice = -Infinity;
  let bestPriceSeq;
  let globalSeqTuples = [ ...globalSeqMap ];
  for(let i = 0; i < globalSeqTuples.length; ++i) {
    let [ seqKey, seqPrice ] = globalSeqTuples[i];
    if(seqPrice > bestPrice) {
      bestPrice = seqPrice;
      bestPriceSeq = seqKey;
    }
  }
  console.log(`${bestPriceSeq} - ${bestPrice}`);
  return bestPrice;
}

function getUniqueSeqs(srcSecrets) {
  let n = 2001;
  let secrets = srcSecrets.slice();
  let uniqSeqMap = new Map();
  let uniqSeqs = [];
  for(let i = 0; i < secrets.length; ++i) {
    let secret = secrets[i];
    let secretN = secret;
    let seq = [];
    let price = getBananaPrice(secretN);
    let prevPrice;
    for(let k = 0; k < n; ++k) {
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
          // uniqSeqs.push(uniqSeqMap.get(seqKey));
        }
      }
    }
  }
  console.log(uniqSeqs.length);
  console.log(uniqSeqMap.size);
  return uniqSeqs;
}

function sellAt(sellSeq, secret) {
  let n = 2001;
  let secretN = secret;
  // let seq = [];
  let prevPrice;
  let price = getBananaPrice(secret);
  let sellSeqIdx = 0;
  for(let i = 0; i < n; ++i) {
    secretN = getNextSecret(secretN);
    prevPrice = price;
    price = getBananaPrice(secretN);
    // let priceDiff = price - prevPrice;
    // if(priceDiff === sellSeq[sellSeqIdx]) {
    if((price - prevPrice) === sellSeq[sellSeqIdx]) {
      sellSeqIdx++;
      if(sellSeqIdx > 3) {
        return price;
      }
    } else {
      sellSeqIdx = 0;
    }
  }
  return 0n;
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
  secret = (secret ^ (secret * 64n)) % 16777216n;
  secret = (secret ^ (secret / 32n)) % 16777216n;
  return (secret ^ (secret * 2048n)) % 16777216n;;
  // return secret;
  // secret = op1(secret);
  // secret = op2(secret);
  // secret = op3(secret);
  // return secret;
}

function op1(secret) {
  // let mul = secret * 64n;
  // secret = mix(secret, secret * 64n);
  // secret = prune(mix(secret, secret * 64n));
  return (secret ^ (secret * 64n)) % 16777216n;
}

function op2(secret) {
  // let div = secret / 32n;
  // secret = mix(secret, secret / 32n);
  // secret = prune(secret);
  return (secret ^ (secret / 32n)) % 16777216n;
}

function op3(secret){
  // let mul = secret * 2048n;
  // secret = mix(secret, mul);
  // secret = mix(secret, secret * 2048n);
  // secret = prune(secret);
  return (secret ^ (secret * 2048n)) % 16777216n;
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
    if(/\d+/.test(inputLine)) {
      secrets.push(BigInt(+inputLine));
    }
  }
  let res = {
    secrets,
  };
  return res;
}
