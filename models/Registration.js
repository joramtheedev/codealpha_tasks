const pool = require('../config/database');

class Registration {
  static async create(userId, eventId, client = pool) {
    const result = await client.query(
      'INSERT INTO registrations (user_id, event_id, status) VALUES ($1, $2, $3) RETURNING *',
      [userId, eventId, 'active']
    );
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const result = await pool.query(
      `SELECT r.id, r.status, r.registration_date,
              e.id as event_id, e.title, e.description, e.location, e.event_date
       FROM registrations r
       JOIN events e ON r.event_id = e.id
       WHERE r.user_id = $1 AND r.status = 'active'
       ORDER BY e.event_date ASC`,
      [userId]
    );
    return result.rows;
  }

  static async findById(id, userId) {
    const result = await pool.query(
      'SELECT * FROM registrations WHERE id = $1 AND user_id = $2 AND status = $3',
      [id, userId, 'active']
    );
    return result.rows[0];
  }

  static async cancel(id, client = pool) {
    await client.query(
      'UPDATE registrations SET status = $1 WHERE id = $2',
      ['cancelled', id]
    );
  }
}

module.exports = Registration;