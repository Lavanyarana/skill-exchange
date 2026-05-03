import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

dotenv.config();

const app = express();

// DB
connectDB();

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://skill-exchange-n717.vercel.app",
      "https://skill-exchange-n717-lavanyaranas-projects.vercel.app"
    ],
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/messages", messageRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API Running Successfully 🚀");
});

// ✅ ONLY ONE server
const server = http.createServer(app);

// ✅ Socket AFTER server
const io = new Server(server, {
  cors: {
    origin: [
      "https://skill-exchange-n717.vercel.app",
      "https://skill-exchange-n717-lavanyaranas-projects.vercel.app"
    ],
    methods: ["GET", "POST"],
  },
});

// Socket logic
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
  });

  socket.on("sendMessage", ({ sender, receiver, text }) => {
    io.to(receiver).emit("receiveMessage", {
      sender,
      text,
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id); });
});

const PORT = process.env.PORT || 5000;

// ✅ ONLY THIS LISTEN
server.listen(PORT, () => { console.log(`Server running on port ${PORT}`);
});
