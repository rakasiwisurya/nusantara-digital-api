import request from "supertest";
import app from "../../app";

let token = "";
let employeeId = "";

beforeAll(async () => {
  const res = await request(app).post("/login").send({
    email: "admin@gmail.com",
    password: "password123",
  });

  token = res.body.data.token;
});

describe("Employee CRUD Positive Test", () => {
  it("should create employee", async () => {
    const res = await request(app)
      .post("/employees")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "John Doe",
        age: 30,
        position: "Engineer",
        salary: 10000000,
      });

    employeeId = res.body.data.id;
    expect(res.status).toBe(200);
    expect(res.body.message).toEqual("Success add new data");
  });

  it("should get employee list", async () => {
    const res = await request(app)
      .get("/employees")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toEqual("Success get data");

    expect(res.body.data).toMatchObject({
      current_page: expect.any(Number),
      total_record: expect.any(Number),
      has_next: expect.any(Boolean),
      has_prev: expect.any(Boolean),
      records: expect.any(Array),
    });

    expect(Array.isArray(res.body.data.records)).toBe(true);

    if (res.body.data.records.length > 0) {
      expect(res.body.data.records[0]).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        age: expect.any(Number),
        position: expect.any(String),
        salary: expect.any(Number),
      });
    }
  });

  it("should get employee detail", async () => {
    const res = await request(app)
      .get(`/employees/${employeeId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toEqual("Success get detail data");
    expect(res.body.data).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
      age: expect.any(Number),
      position: expect.any(String),
      salary: expect.any(Number),
    });
  });

  it("should update employee", async () => {
    const payload = {
      name: "Doe John",
      age: 40,
      position: "UI/UX",
      salary: 20000000,
    };

    const res = await request(app)
      .put(`/employees/${employeeId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(payload);

    const resDetail = await request(app)
      .get(`/employees/${employeeId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toEqual("Success update data");
    expect(resDetail.body.data).toMatchObject(payload);
  });

  it("should delete employee", async () => {
    const res = await request(app)
      .delete(`/employees/${employeeId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toEqual("Success delete data");
  });
});
