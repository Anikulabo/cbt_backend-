const { assignClass } = require("../../controllers/jwtgeneration");
const Class = require("../../models/class");
const Registration = require("../../models/registration");
jest.mock("../../models/class");
jest.mock("../../models/registration");
const registrations = [
  {
    id: 1,
    first_name: "peters",
    last_name: "kelvin",
    category_id: 1,
    department_id: 2,
    year: 2,
    sex: "M",
    DOB: "06/07/2002",
    email: "peters@example.com",
    address: "15,alowonle street",
    class_id: 1,
    session_id: 1,
    regNo: "202311",
    parent: 0,
  },
  {
    id: 2,
    first_name: "peters",
    last_name: "Alfred",
    category_id: 1,
    department_id: 2,
    year: 2,
    sex: "M",
    DOB: "04/03/2005",
    email: "alfred@example.com",
    address: "15,alowonle street",
    class_id: 1,
    session_id: 1,
    regNo: "202312",
    parent: 0,
  },
  {
    id: 3,
    first_name: "peters",
    last_name: "wilson",
    category_id: 1,
    department_id: 2,
    year: 2,
    sex: "M",
    DOB: "03/04/2005",
    email: "wilson@example.com",
    address: "15,alowonle street",
    class_id: 1,
    session_id: 1,
    regNo: "202313",
    parent: 0,
  },
  {
    id: 4,
    first_name: "ogunremi",
    last_name: "samuel",
    category_id: 1,
    department_id: 2,
    year: 2,
    sex: "M",
    DOB: "05/03/1999",
    email: "samuel@example.com",
    address: "10,balogun street",
    class_id: 3,
    session_id: 1,
    regNo: "202334",
    parent: 0,
  },
  {
    id: 5,
    first_name: "Alade",
    last_name: "stephen",
    category_id: 1,
    department_id: 2,
    year: 2,
    sex: "M",
    DOB: "01/01/2002",
    email: "stephens@example.com",
    address: "1,adigbanla street",
    class_id: 3,
    session_id: 1,
    regNo: "202335",
    parent: 0,
  },
  {
    id: 6,
    first_name: "Odu",
    last_name: "Philip",
    category_id: 1,
    department_id: 2,
    year: 2,
    sex: "M",
    DOB: "14/11/2000",
    email: "Philip@example.com",
    address: "10,ifo street",
    class_id: 6,
    session_id: 1,
    regNo: "202366",
    parent: 0,
  },
];
const class2 = [
  {
    id: 1,
    year: 2,
    category_id: 1,
    department_id: 2,
    name: "Class A",
    teacherid: 2,
  },
  {
    id: 3,
    year: 2,
    category_id: 1,
    department_id: 2,
    name: "Class B",
    teacherid: 1,
  },
  {
    id: 6,
    year: 2,
    category_id: 1,
    department_id: 2,
    name: "Class C",
    teacherid: 5,
  },
];
describe("assignclass", () => {
  beforeAll(() => {
    jest.mock("../../models/class");
    jest.mock("../../models/registration");
  });
  afterAll(() => {
    jest.restoreAllMocks(); // Restore all mocks after tests
  });
  it("it should throw an error indicating the missing key", async () => {
    const main = { cate: 1, dept: 2 };
    await expect(assignClass(main)).rejects.toThrow(
      `expect three keys but you are missing key year`
    );
  });
  it("it should theow an error indicating unexpected key", async () => {
    const main = { cate: 1, dept: 2, level: 100 };
    await expect(assignClass(main)).rejects.toThrow(`unknown key level`);
  });
  it("it should throw an error if key is not a number", async () => {
    const main = { cate: 1, dept: 2, year: "2021" };
    await expect(assignClass(main)).rejects.toThrow(
      `expects a number in key year received a string`
    );
  });
  it("it should throw an error if class is not found", async () => {
    const main = { cate: 1, dept: 2, year: 2 };
    const emptyClasses = [];

    // Mock the findAll method to return an empty array
    Class.findAll.mockResolvedValue(emptyClasses);

    await expect(assignClass(main)).rejects.toThrow(
      "There is no class that meets such requirement"
    );

    // Verify that findAll was called with the correct arguments
    expect(Class.findAll).toHaveBeenCalledWith({
      where: {
        category_id: main.cate,
        department_id: main.dept,
        year: main.year,
      },
    });
  });
  it("it should return a class detail if all goes well", async () => {
    const main = { cate: 1, dept: 2, year: 2 };
    const class1 = [
      {
        id: 1,
        year: 2,
        category_id: 1,
        department_id: 2,
        name: "Class A",
        teacherid: 2,
      },
    ];
    Class.findAll.mockResolvedValue(class1);
    const result = await assignClass(main);
    const expectedResult = {
      classid: class1[0].id,
      classname: class1[0].name,
      teacher: class1[0].teacherid,
    };
    expect(result).toEqual(expectedResult);
    expect(Class.findAll).toHaveBeenCalledWith({
      where: {
        category_id: main.cate,
        department_id: main.dept,
        year: main.year,
      },
    });
  });
  it("it should return the class with the lowest population", async () => {
    const main = { cate: 1, dept: 2, year: 2 };
    Class.findAll.mockResolvedValue(class2);
    Registration.findAll.mockImplementation(({ where: { class_id } }) => {
      return Promise.resolve(
        registrations.filter((student) => student.class_id === class_id) || []
      );
    });

    const result = await assignClass(main);

    // Define the expected result for choosenClass
    const expectedChoosenClass = {
      classid: 6,
      classname: "Class C",
      teacher: 5,
    };
    expect(result).toEqual(expectedChoosenClass);
    expect(Class.findAll).toHaveBeenCalledWith({
      where: {
        category_id: main.cate,
        department_id: main.dept,
        year: main.year,
      },
    });
    class2.forEach((cls) => {
      expect(Registration.findAll).toHaveBeenCalledWith({
        where: { class_id: cls.id },
        attributes: ["class_id"],
      });
    });
  });
});

