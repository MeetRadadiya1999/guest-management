const Guest = require("../models/Guest");
const Event = require("../models/Event");
const nodemailer = require("nodemailer");



// Send Guest Invitation
exports.inviteGuest = async (req, res) => {
    const { email } = req.body;
    const { eventId } = req.params;

    try {
        // Populate event with user details
        const event = await Event.findById(eventId).populate("user", "name email");
        if (!event) return res.status(404).json({ message: "Event not found" });

        if (event.user._id.toString() !== req.user.id) {
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

        // Create invitation link
        const invitationLink = `${process.env.FRONTEND_URL}/rsvp/${guest._id}`;
        // const invitationLink = `http://localhost:5173/rsvp/${guest._id}`; // Vite

        // 📨 Email message including event details and inviter's name
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: `You're Invited: ${event.name}`,
            text: `Hello,

                You are invited to *${event.name}* 🎉 by *${event.user.name}*.

                📅 Date: ${event.date}
                ⏰ Time: ${event.time}
                📍 Location: ${event.location}

                Please click the link below to RSVP:
                🔗 ${invitationLink}

                If you have any questions, feel free to contact *${event.user.name}* at ${event.user.email}.

                Looking forward to seeing you there!

                Best,
                The Event Team`
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


exports.getGuestDetails = async (req, res) => {
    const { guestId } = req.params;

    try {
        const guest = await Guest.findById(guestId).populate({
            path: "event",
            populate: { path: "user", select: "name email" } // Populate event creator (inviter)
        });

        if (!guest) return res.status(404).json({ message: "Guest not found" });

        res.json({
            email: guest.email,
            rsvpStatus: guest.rsvpStatus,
            event: {
                name: guest.event.name,
                date: guest.event.date,
                time: guest.event.time,
                location: guest.event.location,
                inviter: guest.event.user.name, // Inviter name
                inviterEmail: guest.event.user.email // Inviter email
            }
        });
    } catch (error) {
        console.log("❌ Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
