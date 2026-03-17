const { spawn } = require("child_process");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Middleware for static files
app.use(express.static(path.join(__dirname, "..")));
app.use("/models", express.static(path.join(__dirname, "../models")));
app.use(express.static(path.join(__dirname, "public"))); 

// Auto start Python chatbot backend
const pythonPath = "python3"; // Render uses python3 by default
const chatbotPath = path.join(__dirname, "..", "chatbot", "backend", "main.py");

const chatbotProcess = spawn(pythonPath, [chatbotPath]);

chatbotProcess.stdout.on("data", (data) => {
  console.log(`Chatbot: ${data}`);
});

chatbotProcess.stderr.on("data", (data) => {
  console.error(`Chatbot Error: ${data}`);
});

console.log("✅ Python Chatbot process initiated");

// ✅ IMPORT ROUTES
const faceMatchRoutes = require("./routes/faceMatchRoutes");
const authRoutes = require("./routes/auth");
const albumRoutes = require("./routes/albumRoutes");

// ✅ USE ROUTES
app.use("/api/face", faceMatchRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/albums", albumRoutes);

// ✅ DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// ✅ PORT BINDING FOR RENDER
const PORT = process.env.PORT || 10000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
