const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
    createTicket,
    updateTicket,
    deleteTicket,
    getTickets,
    assignTicket
} = require('../controllers/ticketController');

router.post('/', auth(['customer']), createTicket);
router.put('/:id', auth(['support', 'admin']), updateTicket);
router.delete('/:id', auth(['admin']), deleteTicket);
router.get('/', auth(['support', 'admin']), getTickets);
router.put('/assign/:id', auth(['admin']), assignTicket);

module.exports = router;
