var express = require('express');
const AuthController = require('../controllers/AuthController');

var router = express.Router();

router.post('/register', AuthController.register);
router.post('/verify-otp', AuthController.verifyAccount);
router.post('/resend-verify-otp', AuthController.resendVerificationCode);
router.post('/login', AuthController.login);
router.post('/send-reset-password', AuthController.sendResetPassword);
router.post('/reset-password', AuthController.resetPassword);

// Authentication Required
router.get('/user', AuthController.getCurrentUser);
router.patch('/update', AuthController.updateUser);
router.patch('/update-password', AuthController.updatePassword);

module.exports = router;