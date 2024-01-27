const UserModel = require('../models/user.model');
const EmailModel = require('../models/post.model');

const getInboxList = async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await UserModel.findById(_id);

    if (!user) {
      return res.status(403).send({
        success: false,
        message: 'User not found',
        userMessage: 'Something went wrong!',
      });
    }

    const inbox = await EmailModel.find({
      recipients: {
        $elemMatch: { user: _id, deleted: false, permanentlyDeleted: false },
      },
      status: true,
    })
      .sort({ cts: -1 })
      .populate({
        path: 'recipients.user',
        select: 'name avatar email',
      })
      .populate({ path: 'sender', select: 'name avatar email' });

    res.status(200).send({
      success: true,
      message: 'Fetch success',
      userMessage: 'Sync success',
      inbox,
    });
  } catch (error) {
    console.log(error);
    res.status(403).send({
      success: false,
      message: 'Email fetch failed',
      userMessage: 'Something went wrong!',
    });
  }
};

module.exports = {
  getInboxList,
};
