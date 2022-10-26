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