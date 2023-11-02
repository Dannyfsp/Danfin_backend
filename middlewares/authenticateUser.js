const TokenService = require('../services/TokenService');

const authenticateUser = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Unathenticated' });

    const user = TokenService.verifyToken(token);

    if (!user)
      return res.status(401).json({ message: 'Authentication failed' });

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthenticated' });
  }
};

module.exports = authenticateUser;
