const parseStringToFloat = (balance) => {
  // Remove commas from the string
  const stringWithoutCommas = balance.replace(/,/g, '');

  // Parse the string to a float and format it with two decimal places
  return parseFloat(stringWithoutCommas);
};

module.exports = parseStringToFloat;
