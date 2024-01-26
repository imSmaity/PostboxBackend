const mongoose = require('mongoose');
const recipientSchema = require('../schemas/Recipients');

const RecipientModel = mongoose.model('recipient.list', recipientSchema);

module.exports = RecipientModel;
