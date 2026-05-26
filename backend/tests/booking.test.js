process.env.DB_NAME = "bookingDB_test";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test_secret";

const request = require("supertest");
const { app, client, dbReady } = require("../server");

describe("Booking API", () => {
  const bookingData = {
    date: "2026-12-31",
    time: "10:00-11:00",
    court: "Basketball Court",
    userId: "test-user-id",
    userEmail: "bookingtest@gmail.com",
  };

  beforeAll(async () => {
    await dbReady;
  });

  afterAll(async () => {
    await client.close();
  });

  test("create booking success", async () => {
    const response = await request(app)
      .post("/api/bookings")
      .send(bookingData);

    expect(response.statusCode).toBe(201);

    expect(response.body.date).toBe(bookingData.date);

    expect(response.body.time).toBe(bookingData.time);

    expect(response.body.court).toBe(bookingData.court);

    expect(response.body.status).toBe("Confirmed");
  });

  test("duplicate booking conflict rejected", async () => {
    const response = await request(app)
      .post("/api/bookings")
      .send(bookingData);

    expect(response.statusCode).toBe(409);

    expect(response.body.message).toBe(
      "This court is already booked for the selected date and time."
    );
  });
});