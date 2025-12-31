import request from "supertest";
import app from "../../app";

describe("Auth Positif Test", () => {
  it("should login successfully", async () => {
    const payload = {
      email: "admin@gmail.com",
      password: "password123",
    };

    const res = await request(app).post("/login").send(payload);

    expect(res.status).toBe(200);

    expect(res.body).toEqual(
      expect.objectContaining({
        status: 200,
        message: "Login success",
        data: expect.objectContaining({
          id: expect.any(String),
          email: "admin@gmail.com",
          token: expect.any(String),
        }),
      })
    );
  });
});

describe("Auth Negative Test", () => {
  it("should fail when password is wrong", async () => {
    const res = await request(app).post("/login").send({
      email: "admin@gmail.com",
      password: "wrongpassword",
    });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      status: 400,
      message: "Email or password doesn't correct",
      data: null,
    });
  });

  it("should fail when email not registered", async () => {
    const res = await request(app).post("/login").send({
      email: "unknown@gmail.com",
      password: "password123",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toEqual("Email or password doesn't correct");
  });

  it("should fail when email is missing", async () => {
    const res = await request(app).post("/login").send({
      password: "password123",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toEqual('"email" is required');
  });

  it("should fail when request body is empty", async () => {
    const res = await request(app).post("/login").send({});

    expect(res.status).toBe(400);
  });

  it("should fail when email format is invalid", async () => {
    const res = await request(app).post("/login").send({
      email: "admin-email",
      password: "password123",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toEqual('"email" must be a valid email');
  });

  it("should fail when using GET method", async () => {
    const res = await request(app).get("/login");

    expect(res.status).toBe(404);
  });
});
