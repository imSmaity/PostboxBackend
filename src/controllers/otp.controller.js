'use strict';
const generateOTP = require('otp-generator');
const authenticate = require('../middlewares/authenticate');
const UserModel = require('../models/user.model');
const OTPModel = require('../models/otp.model');
const sendMail = require('../utils/mail');

const sendOTP = async (req, res) => {
  try {
    const { email } = req.params;
    //Check if this email id already registered or not
    const emailExists = await UserModel.findOne({ email });
    if (emailExists) {
      return res.status(403).send({
        success: false,
        message: 'Email alrady exist',
        userMessage: 'Email already used',
      });
    }

    const otp = generateOTP.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    await OTPModel.findOneAndDelete({ email }); //if otp already exist of this email

    const emailObj = {
      email,
      subject: 'Postbox One-Time Password (OTP)',
      text: '',
      html: `This OTP is ${otp}, valid for a short period. Please do not share it with anyone.`,
    };
    await sendMail(emailObj);
    await new OTPModel({
      email,
      otp,
    }).save();

    return res.status(200).send({
      success: true,
      message: 'OTP sent',
      userMessage: 'OTP sent successfully ',
    });
  } catch (error) {
    console.log(error);
    res.status(403).send({
      success: false,
      message: 'Email send failed',
      userMessage: 'Email send failed',
    });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email } = req.params;
    const { enteredOTP } = req.body;
    const otpData = await OTPModel.findOne({ email });

    if (!otpData) {
      return res.status(400).send({
        success: false,
        message: 'Invalid or expired OTP.',
        userMessage: 'OTP expired',
      });
    }

    if (enteredOTP === otpData.otp) {
      await OTPModel.findOneAndDelete({ email });
      const payload = { email };
      const token = authenticate(payload);

      return res.status(200).send({
        success: true,
        message: 'OTP is valid and email verified',
        userMessage: 'Verify success',
        token,
      });
    } else {
      return res.status(200).send({
        success: false,
        message: 'Invalid or expired OTP.',
        userMessage: 'OTP invalid',
      });
    }
  } catch (error) {
    console.log(error);
    res.status(403).send({
      success: false,
      message: 'Email verify failed',
      userMessage: 'Email verify failed',
    });
  }
};

module.exports = { sendOTP, verifyOTP };
