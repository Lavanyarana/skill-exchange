import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// UPDATE USER SKILLS
router.put("/update-skills/:id", async (req, res) => {
  try {
    let { skillsOffered, skillsWanted } = req.body;

    // ✅ FIX: trim spaces from each skill
    skillsOffered = skillsOffered.map((s) => s.trim()).filter(Boolean);
    skillsWanted = skillsWanted.map((s) => s.trim()).filter(Boolean);

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { skillsOffered, skillsWanted },
      { new: true }
    );

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// FIND MATCHING USERS
router.get("/match/:id", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.id);

    if (!currentUser) return res.status(404).json({ msg: "User not found" });

    if (!currentUser.skillsOffered.length || !currentUser.skillsWanted.length) {
      return res.json([]);
    }

    const matches = await User.find({
      _id: { $ne: currentUser._id },
      skillsOffered: { $in: currentUser.skillsWanted },
      skillsWanted: { $in: currentUser.skillsOffered },
    }).select("-password");

    res.json(matches);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("name email");
    res.json(users);
  } catch {
    res.status(500).send("Error fetching users");
  }
});

// CHANGE PASSWORD
router.put("/change-password/:id", async (req, res) => {
  try {
    const { password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    await User.findByIdAndUpdate(req.params.id, { password: hashed });
    res.json({ msg: "Password updated successfully" });
  } catch {
    res.status(500).send("Error updating password");
  }
});

export default router;
