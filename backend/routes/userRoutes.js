const express = require("express");
const router = express.Router();
const User = require("../models/User");

// UPDATE USER SKILLS
router.put("/update-skills/:id", async (req, res) => {
  try {
    const { skillsOffered, skillsWanted } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        skillsOffered,
        skillsWanted,
      },
      { new: true },
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
module.exports = router;
