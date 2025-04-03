const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String,
    date: String,
    time: String,
    location: String,
    guests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Guest" }]
});

module.exports = mongoose.model("Event", EventSchema);
