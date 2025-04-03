// const Event = require("../models/Event");

const Event = require("../models/Event.js");

// **Create Event**
exports.createEvent = async (req, res) => {
    try {
        const { name, date, time, location } = req.body;
        if (!name || !date || !time || !location) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newEvent = new Event({ 
            user: req.user.id, 
            name, 
            date, 
            time, 
            location 
        });

        await newEvent.save();
        res.status(201).json({ message: "Event created successfully", event: newEvent });

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// **Get All Events for Logged-in User**
exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find({ user: req.user.id });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// **Edit Event**
exports.updateEvent = async (req, res) => {
    try {
        const { name, date, time, location } = req.body;
        let event = await Event.findById(req.params.id);

        if (!event) return res.status(404).json({ message: "Event not found" });

        if (event.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        event.name = name || event.name;
        event.date = date || event.date;
        event.time = time || event.time;
        event.location = location || event.location;

        await event.save();
        res.json({ message: "Event updated successfully", event });

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// **Delete Event**
// **Delete Event**
exports.deleteEvent = async (req, res) => {
    try {
        console.log("🟢 Delete Request for Event ID:", req.params.id);

        let event = await Event.findById(req.params.id);
        if (!event) {
            console.log("❌ Event not found");
            return res.status(404).json({ message: "Event not found" });
        }

        if (event.user.toString() !== req.user.id) {
            console.log("❌ Unauthorized user trying to delete");
            return res.status(403).json({ message: "Not authorized" });
        }

        await Event.deleteOne({ _id: req.params.id });

        console.log("✅ Event deleted successfully");
        res.json({ message: "Event deleted successfully" });

    } catch (error) {
        console.log("❌ Server Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
