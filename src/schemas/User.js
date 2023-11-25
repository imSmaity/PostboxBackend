const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: ['true', 'Name required'],
    },
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
  },
  {
    timestamps: { createdAt: 'cts', updatedAt: 'mts' },
    collection: 'user.list',
  },
);

module.exports = userSchema;
