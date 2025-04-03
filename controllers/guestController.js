const Guest = require("../models/Guest");
const Event = require("../models/Event");
const nodemailer = require("nodemailer");

// Send Guest Invitation
exports.inviteGuest = async (req, res) => {
    const { email } = req.body;
    const { eventId } = req.params;

    try {
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: "Event not found" });

        if (event.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to invite guests" });
        }

        // Save guest invitation
        const guest = new Guest({ event: eventId, email });
        await guest.save();

        
        // 🔥 Add guest ID to the event's guests array
        event.guests.push(guest._id);
        await event.save();

        // Send Email Invitation
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // Use TLS
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });
        
        const invitationLink = `http://localhost:5173/rsvp/${guest._id}`;
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: `Invitation to ${event.name}`,
            text: `You're invited to ${event.name}! Click the link to RSVP: ${invitationLink}`
        };

        await transporter.sendMail(mailOptions);

        res.json({ message: "Invitation sent successfully!" });

    } catch (error) {
        console.log("❌ Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};


// Handle RSVP Response
exports.respondToInvitation = async (req, res) => {
    const { rsvpStatus } = req.body;
    const { guestId } = req.params;

    try {
        const guest = await Guest.findById(guestId);
        if (!guest) return res.status(404).json({ message: "Invitation not found" });

        guest.rsvpStatus = rsvpStatus;
        await guest.save();

        res.json({ message: `RSVP status updated to: ${rsvpStatus}` });

    } catch (error) {
        console.log("❌ Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
