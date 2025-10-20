const express = require('express');
const EventController = require('../controllers/eventController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', EventController.getAllEvents);
router.get('/:id', EventController.getEventById);
router.post('/', authenticateToken, EventController.createEvent);

module.exports = router;

