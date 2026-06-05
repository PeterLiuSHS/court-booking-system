require("dotenv").config();

const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "bookingDB";

const courts = [
  "Basketball Court",
  "Badminton Court",
  "Table Tennis Court",
];

const times = [
  "10:00-11:00",
  "11:00-12:00",
  "12:00-13:00",
  "13:00-14:00",
  "14:00-15:00",
];

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];  
  // Math.random() return a value bigger than or equal to 0 but less than 1
  // Math.floor == Round down to the nearest integer
  // this line means randomly return an element of the array
}

function getRandomDate() {
  const today = new Date();
  const randomDays = Math.floor(Math.random() * 30);

  const date = new Date(today);
  date.setDate(today.getDate() + randomDays);

  return date.toISOString().split("T")[0];
}

async function seedBookings() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");

    const db = client.db(dbName);

    const usersCollection = db.collection("users");
    const bookingsCollection = db.collection("bookings");

    const users = await usersCollection.find({ role: "user" }).toArray();

    if (users.length === 0) {
      console.log("No users found. Please run seedUsers.js first.");
      return;
    }

    const bookingsToInsert = [];
    const usedSlots = new Set();

    while (bookingsToInsert.length < 100) {
      const user = getRandomItem(users);
      const court = getRandomItem(courts);
      const time = getRandomItem(times);
      const date = getRandomDate();

      const slotKey = `${date}-${time}-${court}`;

      if (usedSlots.has(slotKey)) {
        continue;
      }

      const existingBooking = await bookingsCollection.findOne({
        date,
        time,
        court,
      });

      if (existingBooking) {
        continue;
      }

      usedSlots.add(slotKey);

      bookingsToInsert.push({
        date,
        time,
        court,
        status: "Confirmed",
        userId: user._id.toString(),
        userEmail: user.email,
      });
    }

    await bookingsCollection.insertMany(bookingsToInsert);

    console.log(`${bookingsToInsert.length} bookings inserted successfully`);
  } catch (error) {
    console.error("Seed bookings error:", error);
  } finally {
    await client.close();
    console.log("MongoDB connection closed");
  }
}

seedBookings();