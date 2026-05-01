const cors = require("cors");
const express = require("express");
const userRoutes = require("./routes/userRoutes");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const requestRoutes = require("./routes/requestRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();
const dotenv = require("dotenv");
dotenv.config();
// Connect Database
connectDB();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/messages", messageRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("API Running Successfully");
});

const PORT = process.env.PORT || 5000;

const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// 🔹 Socket.io Connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // ✅ JOIN USER ROOM (IMPORTANT)
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  // ✅ SEND MESSAGE
  socket.on("sendMessage", ({ sender, receiver, text }) => {
    console.log("Message:", sender, "->", receiver);

    // send message to receiver
    io.to(receiver).emit("newNotification", {
      sender,
      text,
    });

    // 🔔 send notification
    io.to(receiver).emit("newNotification", {
      message: "New message received",
    });
  });

  // 🔹 Disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
