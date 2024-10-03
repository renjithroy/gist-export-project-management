const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  // console.log("token" , req.header('Authorization'));
  if (!token) {
    return res.status(401).json({ error: 'Not authorized, no token' });
  }

  try {
    // Verify token send from client to validate the user
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).json({ error: 'Not authorized, token failed' });
  }
};

module.exports = auth;