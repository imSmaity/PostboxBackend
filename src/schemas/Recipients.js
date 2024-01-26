const mongoose = require('mongoose');

const recipientSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user.list',
      required: [false, 'User required'],
    },
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
    readStatus: {
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
    collection: 'recipient.list',
  },
);

module.exports = recipientSchema;
