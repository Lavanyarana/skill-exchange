const express = require("express");
const router = express.Router();
const Request = require("../models/Request");

// SEND REQUEST
router.post("/send", async (req, res) => {
  try {
    const { sender, receiver, skill } = req.body;

    const newRequest = new Request({
      sender,
      receiver,
      skill,
    });

    await newRequest.save();

    res.json({ msg: "Request sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// UPDATE REQUEST STATUS
router.put("/update/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );

    res.json(request);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});
// GET RECEIVED REQUESTS
router.get("/received/:userId", async (req, res) => {
  try {
    const requests = await Request.find({
      receiver: req.params.userId
    })
    .populate("sender", "name email");

    res.json(requests);

  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});
// GET SENT REQUESTS
router.get("/sent/:userId", async (req, res) => {
  try {
    const requests = await Request.find({
      sender: req.params.userId
    })
    .populate("receiver", "name email");

    res.json(requests);

  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
