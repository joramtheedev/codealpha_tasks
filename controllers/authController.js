const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

class AuthController {
  static async register(req, res) {
    try {
      const { email, name, password } = req.body;

      if (!email || !name || !password) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      const user = await User.create(email, name, password);
      const token = generateToken(user);

      res.status(201).json({
        message: 'User registered successfully',
        user,
        token
      });
    } catch (error) {
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Email already exists' });
      }
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findByEmail(email);

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const validPassword = await User.verifyPassword(password, user.password_hash);

      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = generateToken(user);

      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        },
        token
      });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = AuthController;
