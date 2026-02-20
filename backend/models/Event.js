const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: String,
  dateTime: String,
  venueName: String,
  address: String,
  city: { type: String, default: "Sydney" },
  description: String,
  category: [String],
  imageUrl: String,
  sourceWebsite: String,
  originalUrl: { type: String, unique: true },

  status: {
    type: String,
    enum: ["new", "updated", "inactive", "imported"],
    default: "new"
  },

  importedAt: Date,
  importedBy: String,
  importNotes: String,

  lastScrapedAt: Date,
  hash: String
});

module.exports = mongoose.model("Event", eventSchema);