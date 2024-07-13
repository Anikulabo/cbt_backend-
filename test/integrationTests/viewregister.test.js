const { viewregister } = require("../../controllers/registrationcontrollers");
const { mockRequest, mockResponse } = require("jest-mock-req-res");
const SequelizeMock = require("sequelize-mock");
const { QueryTypes } = require("sequelize");

describe("viewregister", () => {
  let req, res, models, sequelize;

  beforeEach(() => {
    // Mock request and response
    req = mockRequest();
    res = mockResponse();

    sequelize = new SequelizeMock();
    transaction = {
      commit: jest.fn(),
      rollback: jest.fn(),
    };

    sequelize.transaction = jest.fn(() => Promise.resolve(transaction));
    // Mock models
    models = {
      Registration: sequelize.define("Registration", {
        first_name: "John",
        last_name: "Doe",
        category_id: 1,
        department_id: 1,
        year: 2,
        sex: "M",
      }),
      Subjects: sequelize.define("Subjects", {
        id: 1,
        compulsory: true,
        category_id: 1,
        department_id: 1,
        year: 2,
      }),
      Registeredcourses: sequelize.define("Registeredcourses", {
        student_id: 1,
        sessionName: "2021/2022",
        subject_id: 1,
      }),
      Sessions: sequelize.define("Sessions", {
        status: 1,
        sessionName: "2021/2022",
      }),
      sequelize,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should return 200 and students for valid class_id", async () => {
    req.params = { class_id: 1 };

    models.Registration.findAll = jest
      .fn()
      .mockResolvedValue([{ first_name: "John", last_name: "Doe", sex: "M" }]);

    await viewregister(req, res, models);

    expect(models.Registration.findAll).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { class_id: 1 },
        attributes: ["first_name", "last_name", "sex"],
        transaction: expect.any(Object),
      })
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: [{ first_name: "John", last_name: "Doe", sex: "M" }],
    });
  });
it("it should return students for valid compulsory subject and a status of 200", async () => {
    req.params = { subject_id: 1 };
    models.Subjects.findOne = jest.fn().mockResolvedValue({
      id: 1,
      compulsory: true,
      category_id: 1,
      department_id: 1,
      year: 2,
    });
    models.Registration.findAll = jest
      .fn()
      .mockResolvedValue({ first_name: "John", last_name: "Doe", sex: "M" });
    await viewregister(req, res, models);
    expect(models.Subjects.findOne).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 1 },
        transaction: expect.any(Object),
      })
    );
    expect(models.Registration.findAll).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { category_id: 1, department_id: 1, year: 2 },
        attributes: ["first_name", "last_name", "sex"],
        transaction: expect.any(Object),
      })
    );
  });
  it("should return 404 if no students are found for class_id", async () => {
    req.params = { class_id: 1 };
    models.Registration.findAll = jest.fn().mockResolvedValue([]);

    await viewregister(req, res, models);

    expect(models.Registration.findAll).toHaveBeenCalledWith({
      where: { class_id: 1 },
      attributes: ["first_name", "last_name", "sex"],
      transaction: expect.any(Object),
    });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "There are no students registered to this class or subject",
    });
  });
  it("should return 500 if an error occurs during transaction", async () => {
    req.params = { class_id: 1 };
    models.Registration.findAll = jest
      .fn()
      .mockRejectedValue(new Error("Test error"));

    await viewregister(req, res, models);
    expect(transaction.rollback).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "An error occurred during the viewing process",
    });
  });
  it("should return 500 if an error occurs before transaction", async () => {
    req.params = { class_id: 1 };

    models.sequelize.transaction = jest
      .fn()
      .mockRejectedValue(new Error("Test error"));

    await viewregister(req, res, models);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "The server is down for now",
    });
  });
});
