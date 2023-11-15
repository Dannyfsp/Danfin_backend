const mailTemplate = (firstname, otp) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>One-Time Passcode</title>
    <style>
    body {
      font-family: 'Arial', sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    h1 {
      color: #333333;
    }

    p {
      color: #555555;
      line-height: 1.6;
    }

    strong {
      color: #007bff;
    }
    </style>
    </head>
    <body>
        <div class="container">
            <h1>Hello ${firstname}</h1>
            <p>Use this one-time passcode to authenticate your transaction:</p>
            <p><strong>${otp}</strong></p>
            <p>Please DO NOT DISCLOSE</p>
        </div>
    </body>
    </html>
    `;
};

module.exports = mailTemplate;
