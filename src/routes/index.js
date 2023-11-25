const express = require('express');
const authorize = require('../middlewares/authorize');
const {
  userRegister,
  userLogin,
  userSynchronize,
} = require('../controllers/user.controller');
const router = express.Router();

router.route('/user').post(userRegister);
router.route('/user/login').post(userLogin);
router.route('/user/synchronize').get(authorize, userSynchronize);

module.exports = router;
