const pool = require('../config/database');

class Event {
  static async findAll() {
    const result = await pool.query(
      'SELECT id, title, description, location, event_date, capacity, available_seats FROM events ORDER BY event_date ASC'
    );
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT * FROM events WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async create(title, description, location, eventDate, capacity) {
    const result = await pool.query(
      'INSERT INTO events (title, description, location, event_date, capacity, available_seats) VALUES ($1, $2, $3, $4, $5, $5) RETURNING *',
      [title, description, location, eventDate, capacity]
    );
    return result.rows[0];
  }

  static async decreaseSeats(eventId, client = pool) {
    await client.query(
      'UPDATE events SET available_seats = available_seats - 1 WHERE id = $1',
      [eventId]
    );
  }

  static async increaseSeats(eventId, client = pool) {
    await client.query(
      'UPDATE events SET available_seats = available_seats + 1 WHERE id = $1',
      [eventId]
    );
  }
}

module.exports = Event;
