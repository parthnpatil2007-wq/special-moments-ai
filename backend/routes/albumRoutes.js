const express = require("express");
const router = express.Router();
const Album = require("../models/Album");
const upload = require("../middleware/cloudinaryUpload");

// Generate Event ID
function generateEventId() {
  return "EVT-" + Math.random().toString(36).substring(2, 8).toUpperCase();
}

/* ===============================
   CREATE ALBUM + UPLOAD PHOTOS
================================ */
router.post("/create", upload.array("photos", 10), async (req, res) => {
  try {
    // ✅ CORRECT: Cloudinary already gives full URL
    const photoUrls = req.files.map(file => file.path);

    const album = await Album.create({
      albumName: req.body.albumName,
      eventId: generateEventId(),
      photos: photoUrls,
      hostId: req.body.hostId,
    });

    res.json({
      success: true,
      albumId: album._id,
      eventId: album.eventId,
    });

  } catch (err) {
    console.error("Album creation error:", err);
    res.status(500).json({ error: "Album creation failed" });
  }
});

/* ===============================
   ADD MORE PHOTOS TO EXISTING ALBUM
================================ */
router.post("/:id/add-photos", upload.array("photos", 10), async (req, res) => {
  try {

    const album = await Album.findById(req.params.id);
    if (!album) return res.status(404).json({ error: "Album not found" });

    // Cloudinary URLs of new photos
    const newPhotos = req.files.map(file => file.path);

    // Add photos to existing album
    album.photos.push(...newPhotos);

    await album.save();

    res.json({
      success: true,
      message: "Photos added successfully",
      photos: album.photos
    });

  } catch (err) {
    console.error("Add photos error:", err);
    res.status(500).json({ error: "Failed to add photos" });
  }
});

/* ===============================
   GET ALBUMS BY HOST
================================ */
router.get("/host/:hostId", async (req, res) => {
  try {
    const albums = await Album.find({ hostId: req.params.hostId })
      .sort({ createdAt: -1 });

    res.json(albums);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch albums" });
  }
});

/* ===============================
   GET ALBUM BY EVENT ID (GUEST)
================================ */
router.get("/event/:eventId", async (req, res) => {
  try {
    const album = await Album.findOne({ eventId: req.params.eventId });
    if (!album) {
      return res.status(404).json({ error: "Invalid Event ID" });
    }
    res.json(album);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch album" });
  }
});

/* ===============================
   GET SINGLE ALBUM
================================ */
router.get("/:id", async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album) return res.status(404).json({ error: "Album not found" });
    res.json(album);
  } catch (err) {
    res.status(500).json({ error: "Failed to load album" });
  }
});

/* ===============================
   DELETE SINGLE PHOTO
================================ */
router.delete("/:id/photo/:index", async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album) return res.status(404).json({ error: "Album not found" });

    album.photos.splice(req.params.index, 1);
    await album.save();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete photo" });
  }
});

/* ===============================
   DELETE ENTIRE ALBUM
================================ */
router.delete("/:id", async (req, res) => {
  try {
    await Album.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete album" });
  }
});

module.exports = router;