const formatBalanceToString = (balance) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(balance); // Format it with 2 decimal places
};

module.exports = formatBalanceToString;
