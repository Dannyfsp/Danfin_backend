const formatDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString);

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedDate = dateFormatter.format(date);

  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
  const formattedTime = timeFormatter.format(date);

  return { formattedDate, formattedTime };
};

module.exports = formatDateTime;

// Example usage:
// const dateTimeString = '2023-11-03T23:22:41.806Z';
// const { formattedDate, formattedTime } = formatDateTime(dateTimeString);

// For multiple objects
// const formattedObjects = listOfObjects.map((obj) => ({
//   ...obj,
//   formattedDateTime: formatDateTime(obj.date),
// }));
