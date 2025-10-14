const express = require('express');
const router = express.Router();
const recoveryController = require('../controllers/recoveryController');

router.post('/request-reset', recoveryController.requestPasswordReset);

router.post('/reset-password', recoveryController.resetPassword);

module.exports = router;