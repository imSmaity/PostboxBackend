const mongoose = require('mongoose');
const emailSchema = require('../schemas/Post');

const EmailModel = mongoose.model('email.list', emailSchema);

module.exports = EmailModel;
