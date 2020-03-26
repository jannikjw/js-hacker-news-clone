var express = require('express');
const AuthController = require('../controllers/AuthController');

var router = express.Router();

router.post('/register', AuthController.register);
router.post('/verify-otp', AuthController.verifyAccount);
router.post('/resend-verify-otp', AuthController.resendVerificationCode);
router.post('/login', AuthController.login);

// Authentication Required
router.get('/user', AuthController.getCurrentUser);
router.patch('/update', AuthController.updateUser);

module.exports = router;