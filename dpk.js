const crypto = require("crypto");
require("dotenv").config();

const stringifyVal = (val)=> JSON.stringify(val);

const getPartitionKey = (event) => {
  if(!event) {return null};
  let partitionKey;
  if (event.partitionKey) {
    partitionKey = event.partitionKey;
  } else {
    const data = stringifyVal(event);
    partitionKey = crypto.createHash("sha3-512").update(data).digest("hex");
  }
  return partitionKey
}

const stringifyKey = (key) => {
  let keyString;
  if (key) {
    if (typeof key !== "string") {
      keyString = stringifyVal(key)
    }
    return key
  } else {
    keyString = process.env.TRIVIAL_PARTITION_KEY;
  }
  return keyString;
}

const createHash = (data) => {
  return data?.length > process.env.MAX_PARTITION_KEY_LENGTH ? crypto.createHash("sha3-512").update(data).digest("hex") : data;
  }


const deterministicPartitionKey = (event) => {
  let candidate;

    const partitionKey =  getPartitionKey(event);
    
   const partitionKeyVal = partitionKey ? partitionKey : candidate

  const candidateString = stringifyKey(partitionKeyVal);

  
  candidate = createHash(candidateString);
  return candidate;
};


module.exports = {deterministicPartitionKey, stringifyVal, getPartitionKey, stringifyKey, createHash};