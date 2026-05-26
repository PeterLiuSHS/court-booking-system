process.env.DB_NAME = "bookingDB_test";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test_secret";

const request = require("supertest");
const { app, client, dbReady } = require("../server");

describe("Auth API", () => {
  const testEmail = `test_${Date.now()}@gmail.com`;
  const testPassword = "123456";

    beforeAll(async () => {
        await dbReady;
    });

  afterAll(async () => {
    await client.close();
  });

  test("register success", async () => {
    const response = await request(app)
      .post("/api/register")
      .send({
        email: testEmail,
        password: testPassword,
        role: "user",
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.email).toBe(testEmail);
    expect(response.body.role).toBe("user");
    expect(response.body.password).toBeUndefined();
  });

  test("duplicate email rejected", async () => {
    const response = await request(app)
      .post("/api/register")
      .send({
        email: testEmail,
        password: testPassword,
        role: "user",
      });

    expect(response.statusCode).toBe(409);
    expect(response.body.message).toBe("This email has already been registered.");
  });

  test("login success and returns token", async () => {
    const response = await request(app)
      .post("/api/login")
      .send({
        email: testEmail,
        password: testPassword,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.user.email).toBe(testEmail);
    expect(response.body.user.role).toBe("user");
  });

  test("wrong password rejected", async () => {
    const response = await request(app)
      .post("/api/login")
      .send({
        email: testEmail,
        password: "wrong-password",
      });

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Invalid email or password.");
  });

  test("/api/users without token rejected", async () => {
    const response = await request(app).get("/api/users");

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("No token provided.");
  });
});