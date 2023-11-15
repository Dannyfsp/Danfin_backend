exports.validateCreditTransaction = (req, res, next) => {
  try {
    const { accountId, accountName, amount, narration } = req.body;
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
        return res
          .status(400)
          .json({ message: 'Account Name or Depositor Name is required' });
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

exports.validateTransfer = (req, res) => {
  try {
    const {
      accountName,
      accountNumber,
      bankName,
      routingNumber,
      amount,
      narration,
    } = req.body;

    switch (true) {
      case !accountName || accountName.length < 2:
        return res.status(400).json({ message: 'Account Name is required' });
      case !accountNumber || typeof accountNumber !== 'string':
        return res.status(400).json({ message: 'Account Number is required' });
      case accountNumber.length < 10 || accountNumber.length > 12:
        return res.status(400).json({ message: 'Invalid account number' });
      case !bankName || bankName.length < 2:
        return res.status(400).json({ message: 'Name of Bank is required' });
      case !routingNumber || typeof routingNumber !== 'string':
        return res.status(400).json({ message: 'Routing number is required' });
      case routingNumber.length !== 9:
        return res.status(400).json({ message: 'Invalid routing number' });
      case !amount || typeof amount !== 'string':
        return res.status(400).json({ message: 'Amount is required' });
      case !narration:
        return res.status(400).json({ message: 'narration is required' });
      default:
        next();
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
