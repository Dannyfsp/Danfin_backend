exports.validateCreditTransaction = (req, res, next) => {
  try {
    const { accountId, amount, narration } = req.body;
    switch (true) {
      case !accountId || typeof accountId !== 'string':
        return res
          .status(400)
          .json({ message: 'Account Id is required and must be a string' });
      case !amount || typeof amount !== 'string':
        return res
          .status(400)
          .json({ message: 'Amount is required and must be a string' });
      case !depositorName:
        return res.status(400).json({ message: 'Depositor Name is required' });
      case !narration:
        return res.status(400).json({ message: 'narration is required' });
      default:
        next();
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.validateDebitTransaction = (req, res, next) => {
  try {
    const {
      accountId,
      amount,
      accountName,
      accountNumber,
      bankName,
      narration,
    } = req.body;
    switch (true) {
      case !accountId || typeof accountId !== 'string':
        return res
          .status(400)
          .json({ message: 'Account Id is required and must be a string' });
      case !amount || typeof amount !== 'string':
        return res
          .status(400)
          .json({ message: 'Amount is required and must be a string' });
      case !accountName:
        return res.status(400).json({ message: 'Account Name is required' });
      case !accountNumber:
        return res.status(400).json({ message: 'Depositor Name is required' });
      case !bankName:
        return res.status(400).json({ message: 'Bank name is required' });
      case !narration:
        return res.status(400).json({ message: 'narration is required' });
      default:
        next();
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
