require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");



const app = express();

/* ==============================
   MIDDLEWARE
============================== */



app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(passport.initialize());

/* ==============================
   MONGODB CONNECTION
============================== */

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

/* ==============================
   GOOGLE OAUTH CONFIG
============================== */

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      // Create JWT token
      const token = jwt.sign(
        {
          email: profile.emails[0].value,
          name: profile.displayName
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return done(null, { profile, token });
    }
  )
);

/* ==============================
   AUTH ROUTES
============================== */

// Step 1: Redirect to Google
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Step 2: Google callback
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    // Redirect to frontend with token
    res.redirect(
      `http://localhost:5173/dashboard?token=${req.user.token}`
    );
  }
);

/* ==============================
   JWT MIDDLEWARE
============================== */

function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
}

/* ==============================
   EVENTS ROUTES
============================== */

// Public: Get active events
app.get("/api/events", async (req, res) => {
  const events = await Event.find({ status: { $ne: "inactive" } })
    .sort({ lastScrapedAt: -1 });

  res.json(events);
});

// Protected: Import event
app.post("/api/events/import/:id", verifyToken, async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) return res.status(404).json({ message: "Event not found" });

  event.status = "imported";
  event.importedAt = new Date();
  event.importedBy = req.user.email;

  await event.save();

  res.json({ message: "Event imported successfully" });
});

const Event = require("./models/Event");

// TEST ROUTE
app.get("/api/test-insert", async (req, res) => {
  try {
    const newEvent = await Event.create({
      title: "Sydney Music Festival",
      dateTime: "2026-03-15 7:00 PM",
      venueName: "Sydney Opera House",
      description: "A grand live music event in Sydney.",
      sourceWebsite: "Test Source",
      originalUrl: "https://example.com/event",
      lastScrapedAt: new Date()
    });

    res.json({ message: "Event inserted", event: newEvent });
  } catch (error) {
    res.json({ error: error.message });
  }
});
/* ==============================
   EMAIL CAPTURE ROUTE
============================== */

app.post("/api/subscribe", async (req, res) => {
  const { email, consent, eventId } = req.body;

  if (!email || !consent)
    return res.status(400).json({ message: "Consent required" });

  await mongoose.connection.collection("subscriptions").insertOne({
    email,
    consent,
    eventId,
    createdAt: new Date()
  });

  res.json({ message: "Email saved" });
});
const scrapeEventbrite = require("./scrapers/eventbrite");

app.get("/api/run-scraper", async (req, res) => {
  await scrapeEventbrite();
  res.send("Scraper executed");
});
/* 
==============================
   CRON (AUTO SCRAPER)
============================== */

require("./cron");

/* ==============================
   SERVER START
============================== */

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});