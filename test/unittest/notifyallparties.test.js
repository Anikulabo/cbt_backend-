const { Server } = require("socket.io");
const { notifyAllParties } = require("../../controllers/jwtgeneration");
const Notifications = require("../../models/notification");

// Mock the io and Notifications
jest.mock("socket.io", () => {
  return {
    Server: jest.fn().mockImplementation(() => {
      return {
        on: jest.fn(),
        to: jest.fn().mockReturnThis(),
        emit: jest.fn(),
        close: jest.fn(),
      };
    }),
  };
});

jest.mock("../../models/notification", () => ({
  create: jest.fn(),
}));

describe("notifyAllParties", () => {
  let transaction;
  let io;

  beforeEach(() => {
    transaction = {
      commit: jest.fn(),
      rollback: jest.fn(),
    };
    io = new Server();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should throw an error for unexpected key", async () => {
    const dep = {
      classid: 1,
      subject: ["physics", "mathematics"],
      transaction,
      classmessage: "Class message",
      subjectsmessage: "Subjects message",
      author: "Author",
      activity_id: 1,
      teacherid: 3,
    };

    await expect(notifyAllParties(dep)).rejects.toThrow(
      "You have an unexpected key subject"
    );
  });

  test("should throw an error for missing key", async () => {
    const dep = {
      classid: 1,
      subjects: ["physics", "mathematics"],
      transaction,
      classmessage: "Class message",
      subjectsmessage: "Subjects message",
      author: "Author",
      activity_id: 1,
    };

    await expect(notifyAllParties(dep)).rejects.toThrow(
      "You are missing keys: teacherid"
    );
  });

  test("should throw an error for wrong type", async () => {
    const dep = {
      classid: 1,
      subjects: ["physics", "mathematics"],
      transaction,
      classmessage: "Class message",
      subjectsmessage: "Subjects message",
      author: { from: "Author" },
      activity_id: 1,
      teacherid: 3,
    };

    await expect(notifyAllParties(dep)).rejects.toThrow(
      "Expected one of [string, number] as author, received a object"
    );
  });

  test("should notify class teacher and subject teachers", async () => {
    const dep = {
      classid: 1,
      subjects: [{ id: 2, teacherid: 3 }],
      transaction,
      classmessage: "class message",
      subjectsmessage: "subjects message",
      author: "author",
      activity_id: 1,
      teacherid: 1,
    };

    Notifications.create.mockResolvedValue({});

    const result = await notifyAllParties(dep);

    expect(Notifications.create).toHaveBeenCalledTimes(2);
    expect(transaction.commit).toHaveBeenCalled();
    //expect(io.to).toHaveBeenCalledWith("class_1");
    //expect(io.to().emit).toHaveBeenCalledWith("author class message");
    //expect(io.to).toHaveBeenCalledWith("subject_2");
    //expect(io.to().emit).toHaveBeenCalledWith("author subjects message");

    expect(result).toEqual({ message: "Notifications sent successfully" });
  });
});
