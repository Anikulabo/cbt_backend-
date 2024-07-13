const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const SequelizeMock = require("sequelize-mock");
const app = express();
app.use(bodyParser.json());

const { register } = require("../../controllers/registrationcontrollers");
// Mock functions
const DBConnectionMock = new SequelizeMock();
const Categories = DBConnectionMock.define("Categories", {
  id: 1,
  years: 4,
});
const Subjects = DBConnectionMock.define("Subjects", {
  id: 1,
  category_id: 1,
  year: 1,
  compulsory: true,
  department_id: 0,
});
const Sessions = DBConnectionMock.define("Sessions", {
  id: 1,
  sessionName: "2024/2025",
});
const Registration = DBConnectionMock.define("Registration", {
  id: 1,
});
const Activities = DBConnectionMock.define("Activities", {
  id: 1,
});

// Mock sequelize.transaction()
DBConnectionMock.transaction = () => {
  return {
    commit: jest.fn(),
    rollback: jest.fn(),
  };
};
const assignClass = jest.fn(() => ({
  classid: 1,
  classname: "Class A",
  teacher: 1,
}));
const notifyallparties = jest.fn();
const models = {
  Categories: Categories,
  Subjects: Subjects,
  Sessions: Sessions,
  Registration: Registration,
  Activities: Activities,
  sequelize: DBConnectionMock,
};
// Setup Express route for testing
app.post("/register", (req, res) => {
  req.user = { userid: 1, username: "kelvin", role: 1 };
  register(req, res, { assignClass, notifyallparties, models });
});

describe("POST /register", () => {
  it("it should register student if all goes well", async () => {
    const res = await request(app).post("/register").send({
      fname: "John",
      lname: "Doe",
      cate: 1,
      dept: 1,
      year: 1,
      sex: "M",
      session: 1,
      DOB: "2000-01-01",
      email: "john.doe@example.com",
      address: "123 Main St",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toMatch(/successfully registered/);
    expect(assignClass).toHaveBeenCalled();
    expect(notifyallparties).toHaveBeenCalled();
  });
  /*it("it should register student if all goes well", async () => {
    const DBConnectionMock = new SequelizeMock();
    const Categories = DBConnectionMock.define("Categories", {
      id: 1,
      years: 4,
    });
    const Subjects = DBConnectionMock.define("Subjects", {
      id: 1,
      category_id: 1,
      year: 1,
      compulsory: true,
      department_id: 0,
    });
    const Sessions = DBConnectionMock.define("Sessions", {
      id: 1,
      sessionName: "2024/2025",
    });
    const Registration = DBConnectionMock.define("Registration", {
      id: 1,
    });
    const Activities = DBConnectionMock.define("Activities", {
      id: 1,
    });

    // Mock sequelize.transaction()
    DBConnectionMock.transaction = () => {
      return {
        commit: jest.fn(),
        rollback: jest.fn(),
      };
    };
    const res = await request(app).post("/register").send({
      fname: "John",
      lname: "Doe",
      cate: 1,
      dept: 1,
      year: 1,
      sex: "M",
      session: 1,
      DOB: "2000-01-01",
      email: "john.doe@example.com",
      address: "123 Main St",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toMatch(/successfully registered/);
    expect(assignClass).toHaveBeenCalled();
    expect(notifyallparties).toHaveBeenCalled();
  });*/
  // Add more tests as needed
});
