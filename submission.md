
### Refactoring Explanation

The `deterministicPartitionKey` function has 3 basic tasks that it does before returning an output (which is; either generating a partition key or the default `TRIVIAL_PARTITION_KEY` value).

So for me, the first approach would be to refactor the `deterministicPartitionKey` function into these 3 sub-functions namely:

1. getPartitionKey
2. stringifyKey
3. createHash


In the spirit of **DRY**, I also decided to extract JSON.stringify(val) into a mini function since we have repeated it twice in the same code block.

Also, to make this code more production ready, I extracted the constants (**TRIVIAL_PARTITION_KEY** and **MAX_PARTITION_KEY_LENGTH** ) into an env file, so that they can be easily reused across files and methods, while keeping them secure, with a single point of failure/changes.





### Refactored Function
```javascript
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
  return data.length > process.env.MAX_PARTITION_KEY_LENGTH ? crypto.createHash("sha3-512").update(data).digest("hex") : data;
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
```

### Unit tests
```javascript

const { deterministicPartitionKey, stringifyVal, getPartitionKey, stringifyKey, createHash } = require("./dpk");
const testKey = "b140ee56ceee1a1a12630216763051340cbe2bd4b5cb4934980cc0635a110602b850e7c560775e75e0551b7ff1129fa342fe2bc18ea73d9cf9c6d8679311a511"
describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
    expect(typeof trivialKey).toBe("string");
  });

  it("Returns a partition key when given input", () => {
    const trivialKey = deterministicPartitionKey("click");
    expect(trivialKey).toBe(testKey)
    expect(typeof trivialKey).toBe("string");
    expect(trivialKey.length).toBe(128);
  });

  it("Returns a partition key for non strings", ()=> {
    const trivialKey = deterministicPartitionKey(14);
    expect(trivialKey).toBe("438f5def8bb2fccc9a8d99e73bb6f93efaffd5f246374a7dac98fb12c43792a8a52cd15c5d16545158dfcc7a9f69ea68ed052dc96025fb7f54f8ea15dd0be1d6")
    expect(typeof trivialKey).toBe("string");
  })
});

describe("strigifyVal", ()=>{
  it("returns a string", ()=>{
    const value = stringifyVal(3);
    expect(typeof value).toBe("string");
  })
});


describe("getPartitionKey", ()=>{
  it("returns string hashes an input", ()=>{
    const value = getPartitionKey("click");
    expect(value).toBe(testKey);
    expect(typeof value).toBe("string");
    expect(value.length).toBe(128);
  })


  it("returns the same partitionKey if it already exists", ()=>{
    const value = getPartitionKey({partitionKey: testKey});
    expect(value).toBe(testKey);
    expect(typeof value).toBe("string");
    expect(value.length).toBe(128);
  })

  it('returns null for empty input', ()=>{
    const value = getPartitionKey();
    expect(value).toBe(null);
    expect(value).toBeNull();
  })
});


describe("stringifyKey", ()=>{
  it("returns string input as it is", ()=>{
    const value = stringifyKey("click");
    expect(value).toBe("click");
    expect(typeof value).toBe("string");
  })

  it('returns "0" for empty input', ()=>{
    const value = stringifyKey();
    expect(value).toBe("0");
    expect(typeof value).toBe("string");
  })
});


describe("createHash", ()=>{
  it("returns hash as it is if it is less than 256", ()=>{
    const value = createHash("438f5def8bb2fccc9a8d99e73bb6f93efaffd5f246374a7dac98fb12c43792a8a52cd15c5d16545158dfcc7a9f69ea68ed052dc96025fb7f54f8ea15dd0be1d6");
    expect(value).toBe("438f5def8bb2fccc9a8d99e73bb6f93efaffd5f246374a7dac98fb12c43792a8a52cd15c5d16545158dfcc7a9f69ea68ed052dc96025fb7f54f8ea15dd0be1d6");
    expect(typeof value).toBe("string");
  })

  it("rehashes if value is greater than 256", ()=>{
    const key = "438f5def8bb2fccc9a8d99e73bb6f93efaffd5f246374a7dac98fb12c43792a8a52cd15c5d16545158dfcc7a9f69ea68ed052dc96025fb7f54f8ea15dd0be1d6438f5def8bb2fccc9a8d99e73bb6f93efaffd5f246374a7dac98fb12c43792a8a52cd15c5d16545158dfcc7a9f69ea68ed052dc960253efaffd5f246374a7dac98fb12c43792a8a52cd15c5d16545158dfcc7a9f69ea68ed052dc960253efaffd5f246374a7dac98fb12c43792a8a52cd15c5d16545158dfcc7a9f69ea68ed052dc96025"
    const value = createHash(key);
    expect(value).toBe("fba10e6a0905398c70b5ac7d4c55db8a2e7bfd9a892c11fed4a2fd88290853670b5097153f47548a141156d0152cd210e23ee758b1bae5f27921d1226c18cd60");
    expect(typeof value).toBe("string");
    expect(value.length).toBe(128);
  })

  it('returns undefined for empty input', ()=>{
    const value = createHash();
    expect(value).toBeUndefined();
    expect(typeof value).toBe("undefined");
  })
});
```

### Ticket Breakdown

Ticket 1
- Ticket Id:  Feat-001
- Tictket Title: "Add customId to Agent Table"
- Ticket Description: Add a new varchar field to Agent's table. This field should be unique, not required, and act as a Foreign Key which has relations with the Facilities' table. The internally generated database id, should remain as the Primary Key
- Ticket Category: Backend/DB
- Ticket estimate: 2 points
- Acceptance criteria: Every Agent should have a nullable customId field.

Ticket 2
- Ticket Id: Feat-002
- Ticket Title: "Facilities can add customID to Agent Table"
- Ticket Description: Facility Manager should be able to add customId while creating a new Agent. Also Facility Manager should be able to add customId to existing Agent.
- Ticket Category: Backend/Frontend
- Ticket Estimate: 7 points (This is a full stack task)
- Acceptance criteria: Facility Manger can add and update customId on new and existing agents. Comprehensive unite tests.

Ticket 3
- Ticket Id:  Feat-003
- Tictket Title: "Add customId to Agent Report"
- Ticket Description: When generating Agent report, Facility Manager should be able to include customId and remove db id from generated result.
- Ticket Category: Frontend
- Ticket estimate: 2 points
- Acceptance criteria: Agent Reports should include customId if required by Facility Manager.