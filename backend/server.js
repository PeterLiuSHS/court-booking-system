require("dotenv").config();
const uri = process.env.MONGODB_URI;
const { MongoClient } = require("mongodb");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 5000;

const client = new MongoClient(uri);

app.use(cors());
app.use(express.json());

let bookingsCollection;
let usersCollection;
let venuesCollection;

async function connectDB() {
  try {
    await client.connect();
    console.log("Connect to MongoDB");

    const dbName = process.env.DB_NAME || "bookingDB";
    const db = client.db(dbName);
    bookingsCollection = db.collection("bookings");
    usersCollection = db.collection("users");
    venuesCollection = db.collection("venues");
  } catch (error) {
    console.error(error);
  }
}

const dbReady = connectDB();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "No token provided.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token.",
    });
  }
};

app.get("/", (req, res) => {
  res.send("Backend server is running");
});

app.get("/api/venues", async (req, res) => {
  try {
    const venues = await venuesCollection.find().toArray();
    res.json(venues);
  } catch (error) {
    console.error("Error fetching venues:", error);
    res.status(500).json({
      message: "Failed to fetch venues.",
    });
  }
});

app.get("/api/bookings", async (req, res) => {
  try {
    const bookings = await bookingsCollection.find().toArray();

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);

    res.status(500).json({
      message: "Failed to fetch bookings.",
    });
  }
});

app.get("/api/users", verifyToken, async (req, res) => {
  try {
    const users = await usersCollection.find().toArray();

    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);

    res.status(500).json({
      message: "Failed to fetch users.",
    });
  }
});

app.post("/api/register", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const existingUser = await usersCollection.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "This email has already been registered.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      email,
      password: hashedPassword,
      role: role || "user",
    };

    const result = await usersCollection.insertOne(newUser);

    res.status(201).json({
      _id: result.insertedId,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({
      message: "Failed to register user.",
    });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const user = await usersCollection.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    res.json({
      token,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({
      message: "Failed to log in.",
    });
  }
});

app.post("/api/bookings", verifyToken, async (req, res) => {
  try {
    const { date, time, court } = req.body;
    const userId = req.user.userId;
    const userEmail = req.user.email;

    if (!date || !time || !court ) {
      return res.status(400).json({
        message: "Date, time, and court are required.",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selected = new Date(date);
    selected.setHours(0, 0, 0, 0);

    if (selected <= today) {
      return res.status(400).json({
        message: "Bookings must be made at least one day in advance.",
      });
    }

    const existingBooking = await bookingsCollection.findOne({
      date,
      time,
      court,
    });

    if (existingBooking) {
      return res.status(409).json({
        message: "This court is already booked for the selected date and time.",
      });
    }

    const newBooking = {
      date,
      time,
      court,
      status: "Confirmed",
      userId,
      userEmail,
    };

    const result = await bookingsCollection.insertOne(newBooking);

    res.status(201).json({
      _id: result.insertedId,
      ...newBooking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({
      message: "Failed to create booking.",
    });
  }
});

const { ObjectId } = require("mongodb");

app.delete("/api/bookings/:id", verifyToken, async (req, res) => {
  try {
    const id = req.params.id;

    const existingBooking = await bookingsCollection.findOne({
    _id: new ObjectId(id),
  });

    if (!existingBooking) {
      return res.status(404).json({
        message: "Booking not found.",
      });
    }
    
    const isOwner = existingBooking.userId === req.user.userId;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin){
      return res.status(403).json({
        message: "You are not authorized to cancel this booking.",
      });
    }

    await bookingsCollection.deleteOne({
      _id: new ObjectId(id),
    });

    res.json({
    message: "Booking cancelled successfully.",
    deletedBooking: existingBooking,
  });
  } catch (error){
    console.error("Error deleting booking:", error);
    res.status(500).json({
      message: "Failed to cancel booking.",
    });
  }
});

if (require.main === module){
  app.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = {
  app,
  client,
  dbReady,
};
