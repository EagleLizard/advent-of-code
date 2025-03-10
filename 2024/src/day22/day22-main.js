
module.exports = {
  day22Part1,
};

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
