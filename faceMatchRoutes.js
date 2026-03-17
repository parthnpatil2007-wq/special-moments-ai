const express = require("express");
const multer = require("multer");
const Album = require("../models/Album"); // adjust path if needed

const router = express.Router();

// Multer config (memory storage for AI)
const upload = multer({ storage: multer.memoryStorage() });

/**
 * POST: /api/face/match/:eventId
 * Guest uploads one photo → matched photos returned
 */
router.post("/match/:eventId", upload.single("photo"), async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "No photo uploaded" });
    }

    const album = await Album.findOne({ eventId });
    if (!album) {
      return res.status(404).json({ message: "Event not found" });
    }

    /**
     * ✅ TEMP AI LOGIC
     * Your real AI face matching will go here
     * Currently returning all album photos
     */
    res.json({
      success: true,
      matchedPhotos: album.photos
    });

  } catch (err) {
    console.error("Face match error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router; // ✅ THIS IS THE KEY LINE
