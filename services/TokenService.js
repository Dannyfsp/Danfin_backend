const jwt = require('jsonwebtoken');

const TokenService = {
  generateToken: (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
  },

  verifyToken: (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
  },
};

module.exports = TokenService;
