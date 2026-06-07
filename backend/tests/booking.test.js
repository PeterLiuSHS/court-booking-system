process.env.DB_NAME = "bookingDB_test";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test_secret";

const request = require("supertest");
const { app, client, dbReady } = require("../server");

describe("Booking API", () => {
  let token;

  const testEmail = `booking_${Date.now()}@gmail.com`;
  const testPassword = "123456";

  const bookingData = {
    date: "2026-12-31",
    time: "10:00-11:00",
    court: "Basketball Court",
  };

  beforeAll(async () => {
    await dbReady;

    await request(app)
      .post("/api/register")
      .send({
        email: testEmail,
        password: testPassword,
        role: "user",
      });

    const loginResponse = await request(app)
      .post("/api/login")
      .send({
        email: testEmail,
        password: testPassword,
      });

    token = loginResponse.body.token;
  });

  afterAll(async () => {
    await client.close();
  });

  test("create booking success", async () => {
    const response = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${token}`)
      .send(bookingData);

    expect(response.statusCode).toBe(201);
    expect(response.body.date).toBe(bookingData.date);
    expect(response.body.time).toBe(bookingData.time);
    expect(response.body.court).toBe(bookingData.court);
    expect(response.body.status).toBe("Confirmed");
    expect(response.body.userEmail).toBe(testEmail);
  });

  test("duplicate booking conflict rejected", async () => {
    const response = await request(app)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${token}`)
      .send(bookingData);

    expect(response.statusCode).toBe(409);
    expect(response.body.message).toBe(
      "This court is already booked for the selected date and time."
    );
  });
});