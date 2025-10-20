const express = require('express');
const RegistrationController = require('../controllers/registrationController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticateToken, RegistrationController.registerForEvent);
router.get('/', authenticateToken, RegistrationController.getUserRegistrations);
router.delete('/:id', authenticateToken, RegistrationController.cancelRegistration);

module.exports = router;
