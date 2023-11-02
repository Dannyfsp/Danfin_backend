const authenticateAdmin = (req, res, next) => {
  try {
    if (req.user.roles === 'admin') {
      next();
    } else {
      return res.status(403).json({ message: 'Unauthorized' });
    }
  } catch (error) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
};

module.exports = authenticateAdmin;
