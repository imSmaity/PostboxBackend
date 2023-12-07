const authenticate = require('../middlewares/authenticate');
const UserModel = require('../models/user.model');
const hashPassword = require('../middlewares/hashPassword');
const verifyPassword = require('../middlewares/verifyPassword');

const userRegister = async (req, res) => {
  try {
    const { email } = req.user;
    const { name, password } = req.body;

    if (!email) {
      return res.status(403).send({
        success: false,
        message: 'New user creation failed',
        userMessage: 'Enter email',
      });
    } else if (!password) {
      return res.status(403).send({
        success: false,
        message: 'New user creation failed',
        userMessage: 'Enter password',
      });
    } else if (password.length < 8) {
      return res.status(403).send({
        success: false,
        message: 'New user creation failed (max 8 char}',
        userMessage: 'Enter a strong password',
      });
    }

    const emailExists = await UserModel.findOne({ email });
    if (emailExists) {
      return res.status(403).send({
        success: false,
        message: 'Email alrady registered',
        userMessage: 'User already registered',
      });
    }

    const userHashPassword = await hashPassword(password);
    const user = new UserModel({
      name,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
      email,
      password: userHashPassword,
    });

    const savedUser = await user.save();
    const selectedUser = await UserModel.findById(savedUser._id).select(
      'name email avatar',
    );

    const payload = {
      _id: selectedUser._id,
      name: selectedUser.name,
      email: selectedUser.email,
    };
    const token = authenticate(payload);

    res.status(202).send({
      success: true,
      message: 'New user created',
      userMessage: 'Register success',
      token,
      user: selectedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(403).send({
      success: false,
      message: 'New user creation failed',
      userMessage: 'Register failed',
    });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExists = await UserModel.findOne({ email }).select('password');

    if (!userExists || !(await verifyPassword(password, userExists.password))) {
      return res.status(404).send({
        success: false,
        message: 'User or password wrong',
        userMessage: 'Invalid email or password',
      });
    } else {
      const user = await UserModel.findById(userExists._id).select(
        'name email avatar',
      );

      const payload = { _id: user._id, name: user.name, email: user.email };
      const token = authenticate(payload);
      return res.status(200).send({
        success: true,
        message: 'Login guarented',
        userMessage: 'Login success',
        token,
        user,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: 'Internal Server Error',
      userMessage: 'An internal server error occurred.',
    });
  }
};

const userSynchronize = async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await UserModel.findById(_id).select('name email');

    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'User not found',
        userMessage: 'Invalid user',
      });
    } else {
      const payload = { _id: user._id, name: user.name, email: user.email };

      const token = authenticate(payload);
      return res.status(200).send({
        success: true,
        message: 'Access guarented',
        userMessage: 'Synchronized',
        token,
        user,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: 'Internal Server Error',
      userMessage: 'An internal server error occurred.',
    });
  }
};

module.exports = {
  userRegister,
  userLogin,
  userSynchronize,
};
