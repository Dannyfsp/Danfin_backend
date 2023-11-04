const { Router } = require('express');
const AuthController = require('./controllers/AuthController');
const authenticateUser = require('./middlewares/authenticateUser');
const authenticateAdmin = require('./middlewares/authenticateAdmin');
const validateUserRegistration = require('./middlewares/validateUserRegistration');
const AdminController = require('./controllers/AdminController');
const {
  validateCreditTransaction,
  validateDebitTransaction,
} = require('./middlewares/validateTransaction');

const router = Router();

router.get('/', (_, res) => {
  res.send('Welcome to Dan Finance');
});

// auth routes
router.post('/api/auth/login', AuthController.login);

// admin routes
router.post(
  '/api/admin/register-user',
  authenticateUser,
  authenticateAdmin,
  validateUserRegistration,
  AdminController.registerUser
);
router.post(
  '/api/admin/credit-user',
  authenticateUser,
  authenticateAdmin,
  validateCreditTransaction,
  AdminController.creditUser
);
router.post(
  '/api/admin/debit-user',
  authenticateUser,
  authenticateAdmin,
  validateDebitTransaction,
  AdminController.debitUser
);
router.post(
  '/api/admin/restrict-user',
  authenticateUser,
  authenticateAdmin,
  AdminController.restrictUser
);

module.exports = router;
