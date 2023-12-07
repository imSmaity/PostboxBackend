const UserModel = require('../models/user.model');
const EmailModel = require('../models/email.model');

const sendEmail = async (req, res) => {
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
    } else if (recipients.length < 1) {
      return res.status(403).send({
        success: false,
        message: 'No recipients found',
        userMessage: 'Please provide a recipient!',
      });
    } else if (!body) {
      return res.status(403).send({
        success: false,
        message: 'No content found in body',
        userMessage: 'Please provide email body!',
      });
    }

    const recipientsIDs = (
      await UserModel.find({ email: { $in: recipients } }).select()
    ).map((recipeint) => recipeint._id);

    await new EmailModel({
      user: user._id,
      receivers: recipientsIDs,
      subject,
      body,
      attachFiles: attachFiles || [],
      status: true,
    }).save();

    res.status(201).send({
      success: true,
      message: 'Email sent success',
      userMessage: 'Successfully sent',
    });
  } catch (error) {
    console.log(error);
    res.status(403).send({
      success: false,
      message: 'Email sent failed',
      userMessage: 'Something went wrong!',
    });
  }
};

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

    const recipientsIDs = (
      await UserModel.find({ email: { $in: recipients } }).select()
    ).map((recipeint) => recipeint._id);

    await new EmailModel({
      user: user._id,
      receivers: recipientsIDs || [],
      subject: subject || '',
      body: body || '',
      attachFiles: attachFiles || [],
    }).save();

    res.status(200).send({
      success: true,
      message: 'Auto save success',
      userMessage: 'Auto save',
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
      user: _id,
      status: true,
      deleted: false,
    })
      .populate({ path: 'user', select: 'name avatar email' })
      .populate({ path: 'receivers', select: 'name avatar email' });

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

    const drafts = await EmailModel.find({
      user: _id,
      status: false,
      deleted: false,
    })
      .populate({ path: 'user', select: 'name avatar email' })
      .populate({ path: 'receivers', select: 'name avatar email' });

    res.status(200).send({
      success: true,
      message: 'Drafts fetch success',
      userMessage: 'Sync success',
      drafts,
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

module.exports = { sendEmail, saveAsDraft, getInboxList, getDraftList };
