"use strict";

var express = require('express');
var authorize = require('../middlewares/authorize');
var _require = require('../controllers/user.controller'),
  userRegister = _require.userRegister,
  userLogin = _require.userLogin,
  userSynchronize = _require.userSynchronize;
var router = express.Router();
router.route('/user').post(userRegister);
router.route('/user/login').post(userLogin);
router.route('/user/synchronize').get(authorize, userSynchronize);
module.exports = router;