const UserModel = require('../models/user.model');
const EmailModel = require('../models/post.model');

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
      recipients: {
        $elemMatch: { user: _id, deleted: false, permanentlyDeleted: false },
      },
    });
    if (postExisted) {
      await EmailModel.updateOne(
        { _id: post_id, 'recipients.user': _id },
        {
          $set: {
            'recipients.$.deleted': true,
            'recipients.$.updatedAt': Date.now(),
          },
        },
      );
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
      recipients: {
        $elemMatch: { user: _id, deleted: true, permanentlyDeleted: false },
      },
      status: true,
    })
      .sort({ cts: -1 })
      .populate({
        path: 'recipients.user',
        select: 'name avatar email',
      })
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
  pushIntoTrash,
  popFromTrash,
  permanentlyRemove,
  getTrashPosts,
};
