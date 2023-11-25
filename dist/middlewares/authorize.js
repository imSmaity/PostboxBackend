"use strict";

var jwt = require('jsonwebtoken');
var _require = require('../../config'),
  PUBLIC_KEY = _require.PUBLIC_KEY;
var authorize = function authorize(req, res, next) {
  var header = req.headers;
  var token = header.token;
  if (!token) {
    console.warn('No token provided');
    return res.status(401).send({
      message: 'No token provided'
    });
  }
  try {
    var verified = jwt.verify(token, PUBLIC_KEY);
    req.user = verified;
    next();
  } catch (error) {
    console.warn('Authentication failed or unauthorized access');
    res.status(400).send('Unauthorized');
  }
};
module.exports = authorize;