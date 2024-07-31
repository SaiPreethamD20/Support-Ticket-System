const Ticket = require('../models/Ticket');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

exports.createTicket = async (req, res) => {
    const {
        title,
        description
    } = req.body;

    try {
        const ticket = new Ticket({
            title,
            description,
            createdBy: req.user.id
        });
        await ticket.save();
        res.json(ticket);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.updateTicket = async (req, res) => {
    const {
        status,
        assignedTo
    } = req.body;

    try {
        let ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({
                msg: 'Ticket not found'
            });
        }

        ticket.status = status || ticket.status;
        ticket.assignedTo = assignedTo || ticket.assignedTo;

        await ticket.save();
        res.json(ticket);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.deleteTicket = async (req, res) => {
    try {
        let ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({
                msg: 'Ticket not found'
            });
        }

        await ticket.remove();
        res.json({
            msg: 'Ticket removed'
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find();
        res.json(tickets);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.assignTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({
                msg: 'Ticket not found'
            });
        }

        const user = await User.findById(req.body.userId);
        if (!user) {
            return res.status(404).json({
                msg: 'User not found'
            });
        }

        ticket.assignedTo = user.id;
        await ticket.save();

        // Send notification email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Ticket Assignment',
            text: `You have been assigned to the ticket: ${ticket.title}`,
        };
        transporter.sendMail(mailOptions);

        res.json(ticket);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
