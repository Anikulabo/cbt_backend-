const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");
const { generalauthentication } = require("../../controllers/jwtgeneration"); // Adjust the path accordingly
const secretKey = process.env.JWT_KEY_SECRET || "KELVIN";
// Use the actual secret key used in your application
// Create a simple Express app for testing
const app = express();
app.use(express.json());

app.get("/protected", generalauthentication, (req, res) => {
  res.status(200).json({ message: "Authorized", user: req.user });
});

describe("generalauthentication middleware", () => {
  it("should return 401 if no token is provided", async () => {
    const res = await request(app).get("/protected");
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Unauthorized" });
  });

  it("should return 403 if token is invalid or expired", async () => {
    const res = await request(app)
      .get("/protected")
      .set("Authorization", "Bearer invalidtoken");
    expect(res.status).toBe(403);
    expect(res.body).toEqual({ error: "Invalid or expired token" });
  });

  it("should call next and attach payload to req.user if token is valid", async () => {
    const payload = { id: 1, name: "Test User" };
    const token = jwt.sign(payload, secretKey);

    const res = await request(app)
      .get("/protected")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Authorized");
  });
});
