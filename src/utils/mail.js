'use strict';
const nodemailer = require('nodemailer');
const { mailUser, mailPassword } = require('../../config');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: mailUser,
    pass: mailPassword,
  },
});

// async..await is not allowed in global scope, must use a wrapper
const sendMail = async ({ email, subject, text, html }) => {
  return await transporter.sendMail({
    from: mailUser, // sender address
    to: email, // list of receivers
    subject, // Subject line
    text, // plain text body
    html, // html body
  });
};

module.exports = sendMail;
