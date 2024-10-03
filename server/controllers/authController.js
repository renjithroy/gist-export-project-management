// Importing necessary modules
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const dotenv = require('dotenv');

dotenv.config();

exports.register = async (req, res) => {
  const { username, password } = req.body; 
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Check if the username already exists
    const [existingUser] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Username already exists' }); // If username exists, return error
    }

    // Insert new user into the database
    const [result] = await db.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);

    // Generate a token
    const token = jwt.sign({ id: result.insertId, username }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

    res.status(201).json({ id: result.insertId, username, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'User registration failed' });
  }
};



// Login function to handle user login
exports.login = async (req, res) => {
  const { username, password } = req.body; // Extracting username and password from request body

  try {
    // Fetch user from the database
    const [users] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
    if (users.length === 0) return res.status(400).json({ error: 'User not found' }); // If user not found, return error

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    // Generate JWT token
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' }); // Token expiration
    res.json({ id: user.id, username: user.username, token }); // Return the token
  } catch (error) {
    console.error(error); 
    res.status(500).json({ error: 'Login failed' });
  }
};
