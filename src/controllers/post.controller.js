const UserModel = require('../models/user.model');
const EmailModel = require('../models/post.model');
const RecipientModel = require('../models/recipient.model');

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

    const receivedUsers = await Promise.all(
      (await UserModel.find({ email: { $in: recipients } }).select('_id')).map(
        async (user) => {
          return await new RecipientModel({
            user: user._id,
          }).save();
        },
      ),
    );

    const postRecipients = receivedUsers.map((recipient) => recipient._id);
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

    const data = {
      recipients: recipients || [],
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
      recipients: { $in: [user.email] },
      status: true,
      deleted: false,
    })
      .sort({ mts: -1 })
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

const getPostList = async (req, res) => {
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
      status: true,
      deleted: false,
    })
      .sort({ mts: -1 })
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
      deleted: false,
    })
      .sort({ mts: -1 })
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

const pushIntoTrash = async (req, res) => {
  try {
    const { _id } = req.user;
    const { post_id } = req.body;
    const user = await UserModel.findById(_id);

    if (!user) {
      return res.status(403).send({
        success: false,
        message: 'User not found',
        userMessage: 'Something went wrong!',
      });
    }

    const postExisted = await EmailModel.findOne({
      _id: post_id,
      deleted: false,
    });
    if (postExisted) {
      await EmailModel.findByIdAndUpdate(post_id, {
        deleted: true,
        deletionTimeStamp: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
      return res.status(200).send({
        success: true,
        message: 'Move to trash success',
        userMessage: 'Move to trash',
      });
    } else {
      return res.status(404).send({
        success: false,
        message: 'Post not found',
        userMessage: 'Post not found!',
      });
    }
  } catch (error) {
    console.log(error);
    res.status(403).send({
      success: false,
      message: 'post delete failed',
      userMessage: 'Something went wrong!',
    });
  }
};

const popFromTrash = async (req, res) => {
  try {
    const { _id } = req.user;
    const { post_id } = req.body;

    const user = await UserModel.findById(_id);
    if (!user) {
      return res.status(403).send({
        success: false,
        message: 'User not found',
        userMessage: 'Something went wrong!',
      });
    }

    const postExisted = await EmailModel.findOne({
      _id: post_id,
      deleted: true,
    });
    if (postExisted) {
      await EmailModel.findByIdAndUpdate(post_id, {
        deleted: false,
        deletionTimeStamp: null,
      });
      return res.status(200).send({
        success: true,
        message: 'Reverse from trash',
        userMessage: 'Reverse from trash',
      });
    } else {
      return res.status(404).send({
        success: false,
        message: 'Post not found',
        userMessage: 'Post not found!',
      });
    }
  } catch (error) {
    console.log(error);
    res.status(403).send({
      success: false,
      message: 'post delete failed',
      userMessage: 'Something went wrong!',
    });
  }
};

const permanentlyRemove = async (req, res) => {
  try {
    const { _id } = req.user;
    const { post_id } = req.body;
    const user = await UserModel.findById(_id);

    if (!user) {
      return res.status(403).send({
        success: false,
        message: 'User not found',
        userMessage: 'Something went wrong!',
      });
    }

    const postExisted = await EmailModel.findOne({
      _id: post_id,
      deleted: true,
    });
    if (postExisted) {
      await EmailModel.findByIdAndDelete(post_id);
      return res.status(200).send({
        success: true,
        message: 'Permanently deleted',
        userMessage: 'Permanently deleted success',
      });
    } else {
      return res.status(404).send({
        success: false,
        message: 'Post not found',
        userMessage: 'Post not found!',
      });
    }
  } catch (error) {
    console.log(error);
    res.status(403).send({
      success: false,
      message: 'post delete failed',
      userMessage: 'Something went wrong!',
    });
  }
};

const getTrashPosts = async (req, res) => {
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
      deleted: true,
    })
      .sort({ mts: -1 })
      .populate({ path: 'sender', select: 'name avatar email' });

    return res.status(200).send({
      success: true,
      message: 'Trash fetch success',
      userMessage: 'Trash sync success',
      posts,
    });
  } catch (error) {
    console.log(error);
    res.status(403).send({
      success: false,
      message: 'Trash fetch failed',
      userMessage: 'Something went wrong!',
    });
  }
};

module.exports = {
  sendEmail,
  saveAsDraft,
  getInboxList,
  getPostList,
  getDraftList,
  searchEmails,
  pushIntoTrash,
  popFromTrash,
  permanentlyRemove,
  getTrashPosts,
};
