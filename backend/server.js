const { spawn } = require("child_process");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..")));
app.use("/models", express.static(path.join(__dirname, "../models")));
app.use(express.static(path.join(__dirname, "public"))); // optional for face-api.min.js


// Auto start Python chatbot backend
const pythonPath = "python"; // or "python3" if needed

const chatbotPath = path.join(__dirname, "..", "chatbot", "backend", "main.py");


const chatbotProcess = spawn(pythonPath, [chatbotPath]);

chatbotProcess.stdout.on("data", (data) => {
  console.log(`Chatbot: ${data}`);
});

chatbotProcess.stderr.on("data", (data) => {
  console.error(`Chatbot Error: ${data}`);
});

console.log("✅ Python Chatbot started automatically");

// ✅ IMPORT ROUTES
const faceMatchRoutes = require("./routes/faceMatchRoutes");
const authRoutes = require("./routes/auth");
const albumRoutes = require("./routes/albumRoutes");

// ✅ USE ROUTES
app.use("/api/face", faceMatchRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/albums", albumRoutes);

// DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error(err));

//const PORT = 5000;
const PORT = process.env.PORT || 10000;
//app.listen(PORT, () =>
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
