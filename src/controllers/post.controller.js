const UserModel = require('../models/user.model');
const EmailModel = require('../models/post.model');

const searchEmails = async (req, res) => {
  try {
    const text = req.query.text;
    console.log(req.query);
    if (!text) {
      return res.status(201).send({
        success: true,
        message: 'User fetch success',
        userMessage: 'Successfully fetched suggestions',
        users: [],
      });
    }

    const users = await UserModel.find({
      email: text,
    }).select('name avatar email');

    res.status(201).send({
      success: true,
      message: 'User fetch success',
      userMessage: 'Successfully fetched suggestions',
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Server error',
      userMessage: 'Something went wrong!',
    });
  }
};

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

    const postRecipients = (
      await UserModel.find({ email: { $in: recipients } }).select('_id')
    ).map((user) => {
      return {
        user: user._id,
      };
    });

    const data = {
      recipients: postRecipients,
      subject,
      body,
      attachFiles: attachFiles || [],
      status: true,
    };

    if (req.body._id) {
      const postExisted = await EmailModel.findOne({
        _id: req.body._id,
        deleted: false,
      });

      if (postExisted) {
        await EmailModel.findByIdAndUpdate(postExisted._id, data);
        return res.status(201).send({
          success: true,
          message: 'Email sent success',
          userMessage: 'Successfully sent',
        });
      }
    }

    await new EmailModel({
      sender: user._id,
      ...data,
    }).save(),
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

const getPostList = async (req, res) => {
  try {
    const { _id } = req.user;
    const { search } = req.query;
    const user = await UserModel.findById(_id);

    if (!user) {
      return res.status(403).send({
        success: false,
        message: 'User not found',
        userMessage: 'Something went wrong!',
      });
    }

    const query = {
      sender: _id,
      status: true,
      deleted: false,
      permanentlyDeleted: false,
    };

    // if search query keep any value
    if (search) {
      query.$or = [];

      const q1 = { subject: { $regex: new RegExp(search, 'i') } };
      const q2 = { body: { $regex: new RegExp(search, 'i') } };

      query.$or.push(q1);
      query.$or.push(q2);
    }

    const posts = await EmailModel.find(query)
      .sort({ cts: -1 })
      .populate({ path: 'recipients.user', select: 'name avatar email' })
      .populate({
        path: 'sender',
        select: 'name avatar email',
      });

    res.status(200).send({
      success: true,
      message: 'Fetch success',
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
  sendEmail,
  getPostList,
  searchEmails,
};
