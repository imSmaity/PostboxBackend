const mongoose = require('mongoose');

const otpSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (email) {
          const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
          return emailRegex.test(email);
        },
        message: 'Please Enter a valid email',
      },
    },
    otp: {
      type: String,
      required: [true, 'OTP required'],
      trim: true,
    },
    expireAt: {
      type: Date,
      default: new Date(Date.now() + 5 * 60 * 1000),
    },
  },
  {
    timestamps: { createdAt: 'cts', updatedAt: 'mts' },
    collection: 'otp.list',
  },
);

module.exports = otpSchema;
