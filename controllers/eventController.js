const Event = require('../models/Event');

class EventController {
  static async getAllEvents(req, res) {
    try {
      const events = await Event.findAll();
      res.json({ events });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async getEventById(req, res) {
    try {
      const { id } = req.params;
      const event = await Event.findById(id);

      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      res.json({ event });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async createEvent(req, res) {
    try {
      const { title, description, location, event_date, capacity } = req.body;

      if (!title || !event_date || !capacity) {
        return res.status(400).json({ error: 'Title, event date, and capacity are required' });
      }

      const event = await Event.create(title, description, location, event_date, capacity);

      res.status(201).json({
        message: 'Event created successfully',
        event
      });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = EventController;
