const { Router } = require('express');
const AuthController = require('./controllers/AuthController');

const router = Router();

router.get('/', (_, res) => {
  res.send('Welcome to Dan Finance');
});

router.post('/auth/login', AuthController.login);

module.exports = router;
