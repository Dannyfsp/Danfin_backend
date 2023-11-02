const { Router } = require('express');
const AuthController = require('./controllers/AuthController');
const authenticateUser = require('./middlewares/authenticateUser');
const authenticateAdmin = require('./middlewares/authenticateAdmin');
const validateUserRegistration = require('./middlewares/validateUserRegistration');
const AdminController = require('./controllers/AdminController');

const router = Router();

router.get('/', (_, res) => {
  res.send('Welcome to Dan Finance');
});

router.post('/auth/login', AuthController.login);

router.post(
  '/admin/register-user',
  authenticateUser,
  authenticateAdmin,
  validateUserRegistration,
  AdminController.registerUser
);

module.exports = router;
