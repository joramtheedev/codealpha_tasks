const pool = require('../config/database');
const Event = require('../models/Event');
const Registration = require('../models/Registration');

class RegistrationController {
  static async registerForEvent(req, res) {
    const client = await pool.connect();
    
    try {
      const { event_id } = req.body;
      const user_id = req.user.id;

      await client.query('BEGIN');

      const event = await Event.findById(event_id);

      if (!event) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Event not found' });
      }

      if (event.available_seats <= 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'Event is full' });
      }

      const registration = await Registration.create(user_id, event_id, client);
      await Event.decreaseSeats(event_id, client);

      await client.query('COMMIT');

      res.status(201).json({
        message: 'Registration successful',
        registration
      });
    } catch (error) {
      await client.query('ROLLBACK');
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Already registered for this event' });
      }
      res.status(500).json({ error: 'Server error' });
    } finally {
      client.release();
    }
  }

  static async getUserRegistrations(req, res) {
    try {
      const user_id = req.user.id;
      const registrations = await Registration.findByUserId(user_id);
      res.json({ registrations });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async cancelRegistration(req, res) {
    const client = await pool.connect();
    
    try {
      const { id } = req.params;
      const user_id = req.user.id;

      await client.query('BEGIN');

      const registration = await Registration.findById(id, user_id);

      if (!registration) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Registration not found or already cancelled' });
      }

      await Registration.cancel(id, client);
      await Event.increaseSeats(registration.event_id, client);

      await client.query('COMMIT');

      res.json({ message: 'Registration cancelled successfully' });
    } catch (error) {
      await client.query('ROLLBACK');
      res.status(500).json({ error: 'Server error' });
    } finally {
      client.release();
    }
  }
}

module.exports = RegistrationController;
