import express from "express";
import Message from "../models/Message.js";
const router = express.Router();
// ✅ SEND MESSAGE
router.post("/send", async (req, res) => {
  try {
    const { sender, receiver, text } = req.body;

    const message = new Message({
      sender,
      receiver,
      text,
      status: "sent",
    });

    await message.save();

    res.json({ msg: "Message sent" });
  } catch (err) {
    res.status(500).send("Error sending message");
  }
});

// ✅ GET MESSAGES + MARK DELIVERED
router.get("/:user1/:user2", async (req, res) => {
  try {
    const { user1, user2 } = req.params;

    // mark as delivered
    await Message.updateMany(
      {
        sender: user2,
        receiver: user1,
        status: "sent",
      },
      { status: "delivered" },
    );

    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender", "name");

    res.json(messages);
  } catch {
    res.status(500).send("Error fetching messages");
  }
});

// ✅ MARK AS SEEN
router.put("/seen/:senderId/:receiverId", async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    await Message.updateMany(
      {
        sender: senderId,
        receiver: receiverId,
        status: { $ne: "seen" },
      },
      { status: "seen" },
    );

    res.json({ msg: "Messages marked as seen" });
  } catch {
    res.status(500).send("Error updating status");
  }
});
router.get("/unread/:userId", async (req, res) => {
  try {
    const messages = await Message.find({
      receiver: req.params.userId,
      status: "sent", // ONLY count unseen messages
    });

    res.json({ count: messages.length });
  } catch {
    res.status(500).send("Error");
  }
});
export default router;
