const mongoose = require('mongoose');
const emailSchema = require('../schemas/Email');

const EmailModel = mongoose.model('email.list', emailSchema);

module.exports = EmailModel;
