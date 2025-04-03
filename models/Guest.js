const mongoose = require("mongoose");

const GuestSchema = new mongoose.Schema({
    email: String,
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
    status: { type: String, enum: ["Pending", "Accepted", "Declined"], default: "Pending" }
});

module.exports = mongoose.model("Guest", GuestSchema);
