"use strict";

var mongoose = require('mongoose');
var userSchema = require('../schemas/user');
var UserModel = mongoose.model('user.list', userSchema);
module.exports = UserModel;