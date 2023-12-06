const express = require('express');
const authorize = require('../middlewares/authorize');
const {
  userRegister,
  userLogin,
  userSynchronize,
} = require('../controllers/user.controller');
const { sendEmail, verifyEmail } = require('../controllers/otp.controller');
const router = express.Router();

router.route('/email/send-otp/:email').post(sendEmail);
router.route('/email/verify-otp/:email').post(verifyEmail);
router.route('/user').post(authorize, userRegister);
router.route('/user/login').post(userLogin);
router.route('/user/synchronize').get(authorize, userSynchronize);

module.exports = router;
