const mongoose = require('mongoose');
const otpSchema = require('../schemas/OTP');

const OTPModel = mongoose.model('otp.list', otpSchema);

module.exports = OTPModel;
