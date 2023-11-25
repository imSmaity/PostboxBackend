"use strict";

var jwt = require('jsonwebtoken');
var _require = require('../../config'),
  PRIVATE_KEY = _require.PRIVATE_KEY;
var authenticate = function authenticate(payload) {
  try {
    return jwt.sign(payload, PRIVATE_KEY, {
      algorithm: 'RS256',
      expiresIn: '1d'
    });
  } catch (error) {
    console.error(error);
  }
};
module.exports = authenticate;