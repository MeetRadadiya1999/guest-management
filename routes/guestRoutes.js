const express = require("express");
const { inviteGuest, respondToInvitation } = require("../controllers/guestController");
const authMiddleware = require("../middleware/authMiddleware");
const Guest = require("../models/Guest");

const router = express.Router();

// Invite a Guest (User must be logged in)
router.post("/invite/:eventId", authMiddleware, inviteGuest);

// Respond to RSVP (Guest clicks the link)
router.post("/rsvp/:guestId", respondToInvitation);

router.get("/:eventId", authMiddleware, async (req, res) => {
    try {
        const guests = await Guest.find({ event: req.params.eventId });
        res.json(guests);
    } catch (error) {
        console.log("❌ Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});


module.exports = router;
