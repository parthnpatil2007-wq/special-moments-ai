const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema({
  albumName: { type: String, required: true },
  eventId: { type: String, required: true, unique: true },
  photos: { type: [String], required: true }, // store Cloudinary URLs
  hostId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Album", albumSchema);
