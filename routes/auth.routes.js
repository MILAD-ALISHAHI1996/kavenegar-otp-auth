const express = require('express');
const router = express.Router();
const { sendOtp,verifyOTP } = require('../controllers/auth.controller');

router.post('/send-otp', sendOtp);

router.post('/verify-otp', verifyOTP);


module.exports = router;
