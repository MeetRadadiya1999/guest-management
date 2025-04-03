const mongoose = require("mongoose");

const GuestSchema = new mongoose.Schema({
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    email: { type: String, required: true },
    rsvpStatus: { type: String, enum: ["Pending", "Accepted", "Declined"], default: "Pending" },
});

module.exports = mongoose.model("Guest", GuestSchema);
