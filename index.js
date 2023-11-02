require('dotenv').config();
const express = require('express');
const router = require('./router');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use(router);
app.use('*', (req, res) => {
  res.status(404).json({ message: 'route does not exist' });
});

app.listen(3000, () => console.log('Server running on port 3000'));
