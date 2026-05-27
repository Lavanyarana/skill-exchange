import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();
app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://skillchat.duckdns.org",
    "https://skill-exchange-n717.vercel.app",
    "https://skill-exchange-n717-lavanyaranas-projects.vercel.app",
    "https://skill-exchange-n717-rmeoqt7rf-lavanyaranas-projects.vercel.app",
    "https://skill-exchange-beige.vercel.app",
    "https://skill-exchange-n717.vercel.app",
    "https://skill-exchange-n717-git-main-lavanyaranas-projects.vercel.app",
  ],
  credentials: true,
}));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/ai", aiRoutes);

app.use(express.static(path.join(__dirname, "../frontend/build")));
app.use((req, res) => {
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://skillchat.duckdns.org",
      "https://skill-exchange-n717.vercel.app",
      "https://skill-exchange-beige.vercel.app",
    "https://skill-exchange-n717.vercel.app",
    "https://skill-exchange-n717-git-main-lavanyaranas-projects.vercel.app",
    ],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  socket.on("join", (userId) => { socket.join(userId); });
  socket.on("sendMessage", ({ sender, receiver, text }) => {
    io.to(receiver).emit("receiveMessage", { sender, text });
  });
  socket.on("disconnect", () => { console.log("User disconnected:", socket.id); });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => { console.log("Server running on port " + PORT); });
