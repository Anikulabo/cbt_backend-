const { typechecker } = require("../../controllers/jwtgeneration");
describe("typechecker", () => {
  it("it should throw an error for wrong input type", () => {
    let expectedkeys = { key: "hello", type: "string" };
    let incomingobject = "we're ready boss";
    expect(() => typechecker(incomingobject, expectedkeys)).toThrow(
      "The second parameter should be an array of objects with key-value pairs of 'key' and 'type'"
    );
  });
  it("it should throw an error indicating wrong array element", () => {
    let expectedkeys = [
      { key: "message", type: "string" },
      { key: 5, part: "the fifth part" },
    ];
    let incomingobject = { key: "hello", type: "string" };
    expect(() => typechecker(incomingobject, expectedkeys)).toThrow(
      `Abnormal key: ${JSON.stringify({
        key: 5,
        part: "the fifth part",
      })}. We need an array of objects with keys ['key', 'type'] as the second parameter, and both key and type must be strings.`
    );
  });
  it("it should throw an error for invalid type for the first parameter", () => {
    let expectedkeys = [
      { key: "message", type: "string" },
      { key: "hello", type: "string" },
    ];
    let incomingobject = null;
    expect(() => typechecker(incomingobject, expectedkeys)).toThrow(
      "The first parameter should be a non null object, but you provided a object or a null object."
    );
  });
  it("throw an error for an unexpected key in the first parameter", () => {
    let expectedkeys = [
      { key: "message", type: "string" },
      { key: "recipient", type: "number" },
      { key: "sender", type: "number" },
    ];
    let incomingobject = {
      message: "how are you kelvin",
      locations: "olawole",
      recipient: 2,
    };
    expect(() => typechecker(incomingobject, expectedkeys)).toThrow(
      "Your incoming object has an unexpected key: locations."
    );
  });
  it("throw error indicating missing keys", () => {
    let expectedkeys = [
      { key: "message", type: "string" },
      { key: "recipient", type: "number" },
      { key: "sender", type: "number" },
    ];
    let incomingobject = {
      message: "how are you kelvin",
      recipient: 2,
    };
    expect(() => typechecker(incomingobject, expectedkeys)).toThrow(
      "You are missing keys [sender]."
    );
  });
  it("it should throw an error for mismatched key type", () => {
    let expectedkeys = [
      { key: "message", type: "string" },
      { key: "recipient", type: "number" },
      { key: "sender", type: ["number",'string'] },
    ];
    let incomingobject = {
      message: "how are you kelvin",
      recipient: 2,
      sender: {name:"Abdullahi"},
    };
    expect(() => typechecker(incomingobject, expectedkeys)).toThrow(
      "Expected a number,string for key sender in the first parameter, but received a object."
    );
  });
  it("it should return an array if all goes well", () => {
    let expectedkeys = [
      { key: "message", type: "string" },
      { key: "recipient", type: "number" },
      { key: "sender", type: "number" },
    ];
    let incomingobject = {
      message: "how are you kelvin",
      recipient: 2,
      sender: 1,
    };
    expect(typechecker(incomingobject, expectedkeys)).toEqual([
      "message",
      "recipient",
      "sender",
    ]);
  });
});
