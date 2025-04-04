const express = require("express");
const { inviteGuest, respondToInvitation, getGuestDetails } = require("../controllers/guestController");
const authMiddleware = require("../middleware/authMiddleware");
const Guest = require("../models/Guest");

const router = express.Router();

// Invite a Guest (User must be logged in)
router.post("/invite/:eventId", authMiddleware, inviteGuest);

// Respond to RSVP (Guest clicks the link)
router.post("/rsvp/:guestId", respondToInvitation);

router.get("/:guestId", getGuestDetails);


module.exports = router;
