const express = require('express');
const authorize = require('../middlewares/authorize');
const {
  userRegister,
  userLogin,
  userSynchronize,
} = require('../controllers/user.controller');
const { sendOTP, verifyOTP } = require('../controllers/otp.controller');
const {
  sendEmail,
  saveAsDraft,
  getInboxList,
  getDraftList,
} = require('../controllers/email.controller');
const router = express.Router();

router.route('/user').post(authorize, userRegister);
router.route('/user/login').post(userLogin);
router.route('/user/synchronize').get(authorize, userSynchronize);

router.route('/user/email/send-otp/:email').post(sendOTP);
router.route('/user/email/verify-otp/:email').post(verifyOTP);

router
  .route('/user/email')
  .post(authorize, sendEmail)
  .get(authorize, getInboxList);
router
  .route('/user/email/save')
  .post(authorize, saveAsDraft)
  .get(authorize, getDraftList);

module.exports = router;
