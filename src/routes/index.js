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
  getPostList,
  searchEmails,
} = require('../controllers/post.controller');
const { getInboxList } = require('../controllers/inbox.controller');
const {
  saveAsDraft,
  getDraftList,
} = require('../controllers/draft.controller');
const {
  pushIntoTrash,
  popFromTrash,
  permanentlyRemove,
  getTrashPosts,
} = require('../controllers/trash.controller');
const router = express.Router();

router.route('/user').post(authorize, userRegister);
router.route('/user/login').post(userLogin);
router.route('/user/synchronize').get(authorize, userSynchronize);

router.route('/user/email/send-otp/:email').post(sendOTP);
router.route('/user/email/verify-otp/:email').post(verifyOTP);

router
  .route('/user/post')
  .post(authorize, sendEmail)
  .get(authorize, getPostList);

router.route('/user/box/inbox').get(authorize, getInboxList);

router.route('/user/emails').get(authorize, searchEmails);

router
  .route('/user/post/save')
  .post(authorize, saveAsDraft)
  .get(authorize, getDraftList);

router
  .route('/user/post/trash')
  .post(authorize, pushIntoTrash)
  .put(authorize, popFromTrash)
  .delete(authorize, permanentlyRemove)
  .get(authorize, getTrashPosts);

module.exports = router;
