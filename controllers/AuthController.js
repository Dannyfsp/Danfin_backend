const prisma = require('../config/prisma');
const TokenService = require('../services/TokenService');
const formatBalanceToString = require('../utils/formatBalanceToString');
const formatDateTime = require('../utils/formatDateTime');
const generateTransactionId = require('../utils/generateTransactionId');
const generateUniqueCode = require('../utils/generateUniqueCode');
const mailTemplate = require('../utils/mailTemplate');
const parseStringToFloat = require('../utils/parseStringToFloat');
const sendEmail = require('../utils/sendMail');

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
        return res.status(401).json({ message: 'Incorrect password' });

      const tokenData = {
        id: user.id,
        accountId: user.account_id,
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

  initiateTransfer: async (req, res) => {
    try {
      const { id } = req.user;
      const {
        accountName,
        accountNumber,
        bankName,
        routingNumber,
        amount,
        narration,
      } = req.body;

      const user = await prisma.user.findUnique({ where: { id } });

      const intAmount = parseStringToFloat(amount);
      const intBalance = parseStringToFloat(user.balance);

      if (intAmount < 1)
        return res.status(400).json({ message: 'invalid amount' });

      if (intAmount > intBalance)
        return res.status(400).json({ message: 'Insufficient funds' });

      if (user.is_blocked) {
        await prisma.user.update({
          where: { id },
          data: { is_suspended: true },
        });
        return res
          .status(403)
          .json({ message: 'Account suspended, please contact help desk' });
      }

      const otp = generateUniqueCode(4);
      const transactionId = generateTransactionId(12);

      const stringAmount = formatBalanceToString(intAmount);

      const currentDate = new Date();
      const expireDate = new Date(currentDate.getTime() + 3 * 60000);

      const html = mailTemplate(user.firstname, otp);

      // delete any otp record if found
      const otpRecod = await prisma.otp.findUnique({ where: { user_id: id } });
      if (otpRecod) {
        await prisma.otp.delete({ where: { user_id: id } });
      }

      await Promise.all([
        sendEmail(user.email, 'authenticate transfer', `${otp}`, html),
        prisma.otp.create({
          data: {
            user_id: id,
            otp_code: otp,
            expires_at: expireDate,
            created_at: currentDate,
          },
        }),
        prisma.transaction.create({
          data: {
            user_id: id,
            account_id: user.account_id,
            transaction_id: transactionId,
            amount: stringAmount,
            account_name: accountName,
            account_number: accountNumber,
            routing_number: routingNumber,
            bank_name: bankName,
            narration,
            available_balance: user.balance,
            status: 'pending',
          },
        }),
      ]);

      return res
        .status(200)
        .json({ message: 'OTP sent to email', transactionId });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  authenticateTransfer: async (req, res) => {
    try {
      const { id } = req.user;
      const { otp, transactionId } = req.body;

      // check if transactionId exist
      const [user, transaction] = await Promise.all([
        prisma.user.findUnique({ where: { id } }),
        prisma.transaction.findUnique({
          where: { transaction_id: transactionId },
        }),
      ]);
      if (!transaction)
        return res.status(400).json({ message: 'Invalid transaction Id' });

      // find and compare otp
      const otpData = await prisma.otp.findUnique({ where: { user_id: id } });
      if (!otpData)
        return res
          .status(400)
          .json({ message: 'no otp record has been saved' });
      if (otp !== otpData.otp_code)
        return res.status(401).json({ message: 'Invalid OTP' });

      // check if otp has expired
      const currentDate = new Date();
      if (otpData.expires_at < currentDate) {
        await Promise.all([
          prisma.otp.delete({ where: { user_id: id } }),
          prisma.transaction.update({
            where: { transaction_id: transactionId },
            data: {
              status: 'failed',
            },
          }),
        ]);
        return res.status(204).json({ message: 'OTP has expired' });
      }

      const intAmount = parseStringToFloat(transaction.amount);
      const intBalance = parseStringToFloat(user.balance);

      const availBalance = intBalance - intAmount;

      const stringBalance = formatBalanceToString(availBalance);

      await Promise.all([
        prisma.user.update({ where: { id }, data: { balance: stringBalance } }),
        prisma.transaction.update({
          where: { transaction_id: transactionId },
          data: { status: 'success', available_balance: stringBalance },
        }),
        prisma.otp.delete({ where: { user_id: id } }),
      ]);

      return res
        .status(200)
        .json({ message: `${transaction.amount} successfully transferred` });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = AuthController;
