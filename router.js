const { Router } = require('express');

const router = Router();

router.get('/', (_, res) => {
  res.send('Welcome to Dan Finance');
});

module.exports = router;
