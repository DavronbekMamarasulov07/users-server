import request from "supertest";
import app from "../../server.js";

describe("Auth API", () => {
  it("Register works", async () => {
    const res = await request(app).post("/auth/register").send({
      firstName: "Test",
      lastName: "User",
      email: "test1@mail.com",
      password: "12345678",
    });

    expect(res.statusCode).toBe(201);
  });
});
