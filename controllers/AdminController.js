const prisma = require('../config/prisma');
const generateUniqueCode = require('../utils/generateUniqueCode');

const AdminController = {
  registerUser: async (req, res) => {
    try {
      const {
        firstname,
        lastname,
        email,
        password,
        balance,
        profileImage,
        gender,
      } = req.body;

      const accountId = '21' + generateUniqueCode(8);

      const user = await prisma.user.create({
        data: {
          account_id: accountId,
          firstname,
          lastname,
          email,
          password,
          balance,
          profileImage,
          gender,
        },
      });

      return res
        .status(201)
        .json({ message: 'user created successfully', user });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = AdminController;
