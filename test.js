let num = 5000342.54;

let num1 = 500232.23;

let ans = (num - num1).toFixed(2);

// Custom formatting function
function customFormatStringNumber(numberString) {
  // const numberFloat = parseFloat(numberString.replace(/,/g, '')); // Remove commas and convert to a number
  const number = parseFloat(numberString); // Convert the number string to a float
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number); // Format it with 2 decimal places
}

let formattedResult = customFormatStringNumber('5000000');

console.log(formattedResult); // Output: "4,500.31"
