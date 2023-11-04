const prisma = require('../config/prisma');
const generateUniqueCode = require('../utils/generateUniqueCode');
const parseStringToFloat = require('../utils/parseStringToFloat');
const formatBalanceToString = require('../utils/formatBalanceToString');

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

      console.log(accountId);

      const user = await prisma.user.create({
        data: {
          account_id: accountId,
          firstname,
          lastname,
          email,
          password,
          balance,
          profile_img: profileImage,
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

  creditUser: async (req, res) => {
    try {
      const {
        accountId,
        amount,
        depositorName,
        depositorAccountNo,
        narration,
        date,
      } = req.body;

      // check for the user that own's the accountId
      const user = await prisma.user.findUnique({
        where: { account_id: accountId },
      });
      if (!user) res.status(400).json({ message: 'account Id does not exist' });

      // make sure the date is not a future date
      const requestedDate = new Date(date);
      const currentDate = new Date();

      // Compare the requested date with the current date
      if (requestedDate > currentDate)
        return res
          .status(400)
          .json({ message: 'You cannot set a transaction for a future date' });

      // convert amount to float
      const creditAmount = parseStringToFloat(amount);
      const floatBalance = parseStringToFloat(user.balance);

      const transactionBalance = floatBalance + creditAmount;
      const newBalance = formatBalanceToString(transactionBalance);

      await Promise.all([
        prisma.user.update({
          where: { account_id: accountId },
          data: { balance: newBalance },
        }),
        prisma.transaction.create({
          data: {
            user_id: user.id,
            amount,
            account_name: depositorName,
            account_number: depositorAccountNo || 'cash',
            narration,
            available_balance: newBalance,
            type: 'credit',
            status: 'success',
            created_at: requestedDate,
          },
        }),
      ]);

      return res
        .status(200)
        .json({ message: `${creditAmount} deposited successfully` });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  debitUser: async (req, res) => {
    try {
      const {
        accountId,
        amount,
        accountName,
        accountNumber,
        routingNumber,
        narration,
        date,
      } = req.body;

      // check for the user that own's the accountId
      const user = await prisma.user.findUnique({
        where: { account_id: accountId },
      });
      if (!user) res.status(400).json({ message: 'account Id does not exist' });

      // make sure the date is not a future date
      const requestedDate = new Date(date);
      const currentDate = new Date();

      // Compare the requested date with the current date
      if (requestedDate > currentDate)
        return res
          .status(400)
          .json({ message: 'You cannot set a transaction for a future date' });

      // convert amount to float
      const debitAmount = parseStringToFloat(amount);
      const floatBalance = parseStringToFloat(user.balance);

      const transactionBalance = floatBalance - debitAmount;
      const newBalance = formatBalanceToString(transactionBalance);

      await Promise.all([
        prisma.user.update({
          where: { account_id: accountId },
          data: { balance: newBalance },
        }),
        prisma.transaction.create({
          data: {
            user_id: user.id,
            amount,
            account_name: accountName,
            account_number: accountNumber || 'cash',
            routing_number: routingNumber,
            narration,
            available_balance: newBalance,
            type: 'debit',
            status: 'success',
            created_at: requestedDate,
          },
        }),
      ]);

      return res
        .status(200)
        .json({ message: `${debitAmount} debited successfully` });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  restrictUser: async (req, res) => {
    try {
      const { accountId } = req.body;

      // check for the user that own's the accountId
      const user = await prisma.user.findUnique({
        where: { account_id: accountId },
      });
      if (!user) res.status(400).json({ message: 'account Id does not exist' });

      await prisma.user.update({
        where: { account_id: accountId },
        data: { is_blocked: true },
      });

      return res
        .status(200)
        .json({ message: 'user has been restricted successfully' });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = AdminController;
