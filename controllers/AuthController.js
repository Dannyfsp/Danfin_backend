const prisma = require('../config/prisma');
const TokenService = require('../services/TokenService');
const formatDateTime = require('../utils/formatDateTime');

const AuthController = {
  login: async (req, res) => {
    try {
      const { accountId, password } = req.body;

      if (!accountId || !password)
        return res
          .status(400)
          .json({ message: 'accountId and password is required' });

      // check if user's account id exists in database
      const user = await prisma.user.findUnique({
        where: { account_id: accountId },
      });
      if (!user) return res.status(400).json({ message: 'Invalid account Id' });

      // check if user account is suspended
      if (user.is_suspended)
        return res.status(403).json({
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

  dashboard: async (req, res) => {
    try {
      const { id } = req.user;

      const [userDetails, transactions] = await Promise.all([
        prisma.user.findUnique({
          where: { id },
          select: { balance: true, account_id: true },
        }),
        prisma.transaction.findMany({
          where: { user_id: id },
          take: 5,
          orderBy: { created_at: 'desc' },
        }),
      ]);

      const formattedTransactions = transactions.map((transaction) => {
        return {
          id: transaction.id,
          accountName: transaction.account_name,
          amount: transaction.amount,
          date: formatDateTime(transaction.created_at).formattedDate,
          time: formatDateTime(transaction.created_at).formattedTime,
          type: transaction.type,
        };
      });

      return res.status(200).json({
        balance: userDetails.balance,
        accountId: userDetails.account_id,
        transactions: formattedTransactions,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getAllTransactions: async (req, res) => {
    try {
      const { id } = req.user;

      const transactions = await prisma.transaction.findMany({
        where: { user_id: id },
        orderBy: { created_at: 'desc' },
      });

      const formattedTransactions = transactions.map((transaction) => {
        return {
          id: transaction.id,
          accountName: transaction.account_name,
          amount: transaction.amount,
          date: formatDateTime(transaction.created_at).formattedDate,
          type: transaction.type,
        };
      });

      return res.status(200).json({ transactions: formattedTransactions });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getTransaction: async (req, res) => {
    try {
      let { id } = req.params;
      id = Number(id);

      const transaction = await prisma.transaction.findFirst({
        where: { id },
        select: {
          account_id: true,
          transaction_id: true,
          narration: true,
          amount: true,
          type: true,
          created_at: true,
          available_balance: true,
        },
      });

      const date = formatDateTime(transaction.created_at).formattedDate;
      const time = formatDateTime(transaction.created_at).formattedTime;

      return res.status(200).json({ transaction, date, time });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = AuthController;
