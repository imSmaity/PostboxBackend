const mongoose = require('mongoose');
const userSchema = require('../schemas/user');

const UserModel = mongoose.model('user.list', userSchema);

module.exports = UserModel;
