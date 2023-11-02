const prisma = require('../config/prisma');
const TokenService = require('../services/TokenService');

const AuthController = {
  login: async (req, res) => {
    try {
      const { accountId, password } = req.body;

      // check if user's account id exists in database
      const user = await prisma.user.findUnique({
        where: { account_id: accountId },
      });
      if (!user) return res.status(400).json({ message: 'Invalid account Id' });

      // check if user account is suspended
      if (user.is_suspended)
        return res
          .status(403)
          .json({
            message: 'your account is restricted and has been suspended',
          });

      // check if password is correct
      if (password !== user.password)
        return res.status(400).json({ message: 'Incorrect password' });

      const tokenData = {
        id: user.id,
        roles: user.roles,
      };

      const token = TokenService.generateToken(tokenData);

      return res
        .status(200)
        .json({ message: `${user.firstname} logged in successfully`, token });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = AuthController;
