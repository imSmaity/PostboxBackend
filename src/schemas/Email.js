const mongoose = require('mongoose');

const emailSchema = mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user.list',
      equired: [false, 'User required'],
    },
    recipients: [
      {
        type: String,
        required: false,
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
