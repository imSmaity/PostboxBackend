const jwt = require('jsonwebtoken');
const { PRIVATE_KEY } = require('../../config');

const authenticate = (payload) => {
  try {
    return jwt.sign(payload, PRIVATE_KEY, {
      algorithm: 'RS256',
      expiresIn: '1d',
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = authenticate;
