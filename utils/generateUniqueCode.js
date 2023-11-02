const generateUniqueCode = (length) => {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  const code = Math.floor(min + Math.random() * (max - min + 1));

  return code.toString();
};

module.exports = generateUniqueCode;
