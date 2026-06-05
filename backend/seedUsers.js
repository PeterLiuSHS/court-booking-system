require("dotenv").config();

const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "bookingDB";

async function seed() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");

    const db = client.db(dbName);
    const usersCollection = db.collection("users");

    const hashedPassword = await bcrypt.hash("Password123", 10);

    const sampleUsers = [];

    for (let i = 1; i <= 20; i++) {
      sampleUsers.push({
        name: `Student ${i}`,
        email: `student${i}@gmail.com`,
        password: hashedPassword,
        role: "user",
      });
    }

    await usersCollection.insertMany(sampleUsers);

    console.log("20 Sample users inserted successfully");
  } catch (error) {
    console.error("Seed error:", error);
  } finally {
    await client.close();
    console.log("MongoDB connection closed");
  }
}

seed();
