const express = require("express");
const router = express.Router();
const { isVerified } = require("../controllers/messageController");
const Message = require("../models/message");
const User = require("../models/user");

router.get("/chat", isVerified, async (req, res) => {
  try {
    const senderId = req.query.senderId;
    const recieverId = req.user.id;
    const messages = await Message.find({
      $or: [
        { sender: recieverId, reciever: senderId },
        { sender: senderId, reciever: recieverId },
      ],
    }).sort({ createdAt: 1 });

    console.log(messages);
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Unable to fetch messages" });
  }
});

//fetch requests recieved
router.get("/friendrequestrec", isVerified, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate(
      "requests.received",
      "name email"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const receivedRequests = user.requests.received;
    res.status(200).json({ receivedRequests });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

//fetch requests sent
router.get("/friendrequestsent", isVerified, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate(
      "requests.sent",
      "name email"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const sentRequests = user.requests.sent;
    res.status(200).json({ sentRequests });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

//sends a friend request
router.post("/friendrequestsend", isVerified, async (req, res) => {
  try {
    const { receiverEmail } = req.body;
    const senderId = req.user.id;
    console.log(req.user);
    const sender = await User.findOne({ _id: senderId });
    if (!sender) {
      throw new Error("Sender not found");
    }
    if (receiverEmail === sender.email) throw new Error("Invalid receiver");
    const receiver = await User.findOne({ email: receiverEmail });
    if (!receiver) {
      throw new Error("Receiver not found");
    }
    if (sender.requests.sent.includes(receiver.id))
      throw new Error("Request already sent");

    sender.requests.sent.push(receiver._id);

    receiver.requests.received.push(senderId);
    console.log(sender);
    console.log(receiver);
    await sender.save();
    await receiver.save();

    res.status(200).json({ message: "Friend request sent successfully" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = router;
