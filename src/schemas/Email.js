const mongoose = require('mongoose');

const emailSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user.list',
      equired: [false, 'User required'],
    },
    receivers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user.list',
        equired: false,
        default: [],
      },
    ],
    subject: {
      type: String,
      trim: true,
      required: false,
      default: null,
    },
    body: {
      type: String,
      trim: true,
      required: false,
      default: '',
    },
    attachFiles: [
      {
        type: String,
        trim: true,
        required: false,
        default: [],
      },
    ],
    status: {
      type: Boolean,
      required: [true, 'Status is required'],
      default: false,
    },
    deleted: {
      type: Boolean,
      required: [true, 'Status is required'],
      default: false,
    },
  },
  {
    timestamps: { createdAt: 'cts', updatedAt: 'mts' },
    collection: 'email.list',
  },
);

module.exports = emailSchema;
