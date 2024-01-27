const UserModel = require('../models/user.model');
const EmailModel = require('../models/post.model');

const saveAsDraft = async (req, res) => {
  try {
    const { _id } = req.user;
    const { recipients, subject, body, attachFiles } = req.body;
    const user = await UserModel.findById(_id);

    if (!user) {
      return res.status(403).send({
        success: false,
        message: 'User not found',
        userMessage: 'Something went wrong!',
      });
    }

    const postRecipients = (
      await UserModel.find({ email: { $in: recipients } }).select('_id')
    ).map((user) => {
      return {
        user: user._id,
      };
    });

    const data = {
      recipients: postRecipients,
      subject: subject || '',
      body: body || '',
      attachFiles: attachFiles || [],
    };

    if (req.body._id) {
      const postExisted = await EmailModel.findOne({
        _id: req.body._id,
        deleted: false,
      });
      if (postExisted) {
        await EmailModel.findByIdAndUpdate(req.body._id, data);
        return res.status(200).send({
          success: true,
          message: 'Auto save success',
          userMessage: 'Auto save',
          post_id: req.body._id,
        });
      }
    }

    const post = await new EmailModel({
      sender: user._id,
      ...data,
    }).save();

    res.status(200).send({
      success: true,
      message: 'Auto save success',
      userMessage: 'Auto save',
      post_id: post._id,
    });
  } catch (error) {
    console.log(error);
    res.status(403).send({
      success: false,
      message: 'Auto save failed',
      userMessage: 'Something went wrong!',
    });
  }
};

const getDraftList = async (req, res) => {
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

    const posts = await EmailModel.find({
      sender: _id,
      status: false,
      permanentlyDeleted: false,
    })
      .sort({ mts: -1 })
      .populate({ path: 'recipients.user', select: 'name avatar email' })
      .populate({ path: 'sender', select: 'name avatar email' });

    res.status(200).send({
      success: true,
      message: 'Drafts fetch success',
      userMessage: 'Sync success',
      posts,
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
  saveAsDraft,
  getDraftList,
};
