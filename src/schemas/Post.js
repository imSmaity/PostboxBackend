const mongoose = require('mongoose');

const emailSchema = mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user.list',
      required: [true, 'User required'],
    },
    recipients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'recipient.list',
        required: [true, 'Recipient required'],
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
      default: false,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    permanentlyDeleted: {
      type: Boolean,
      default: false,
    },
    important: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: 'cts', updatedAt: 'mts' },
    collection: 'email.list',
  },
);

module.exports = emailSchema;
