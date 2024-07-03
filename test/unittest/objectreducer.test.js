const{objectreducer}=require('../../controllers/jwtgeneration');
describe("objectreducer", () => {
    it("should throw an error", () => {
      const prev = {
        fname: "kelvin",
        lname: "peters",
        email: "peterskelvin123@gmail.com",
      };
      const current = {
        fname: "wilson",
        lname: "peters",
        email: "peterswilson234@gmail.com",
      };
      // Use a try-catch block to capture the error thrown by objectreducer
      try {
        objectreducer(prev, current);
        // If objectreducer did not throw an error, fail the test
        fail("Expected objectreducer to throw an error");
      } catch (error) {
        // Assert that the error message matches the expected message
        expect(error.message).toBe(
          "The first argument must have a toJSON method"
        );
      }
    });
    it("it should throw an error", () => {
      prev = null;
      current = "are you there";
      try {
        objectreducer(prev, current);
        // If objectreducer did not throw an error, fail the test
        fail("Expected objectreducer to throw an error");
      } catch (error) {
        // Assert that the error message matches the expected message
        expect(error.message).toBe("Both arguments must be non-null objects");
      }
    });
    it("should return an object", () => {
      const prev = {
        name: "Alice",
        age: 30,
        city: "Wonderland",
        toJSON() {
          // Return a custom representation of the object
          return {
            fullName: this.name,
            age: this.age,
            city: this.city,
          };
        },
      };
  
      const current = {
        fullName: "kelvin",
        age: 22,
        city: "Wonderland",
      };
  
      const expectedresult = {
        newobject: { fullName: current.fullName, age: current.age },
        changeditems: ["fullName", "age"],
      };
  
      const result = objectreducer(prev, current);
      expect(result).toEqual(expectedresult);
    }); 
  });
  