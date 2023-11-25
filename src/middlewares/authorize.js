const jwt = require('jsonwebtoken');
const { PUBLIC_KEY } = require('../../config');

const authorize = (req, res, next) => {
  const header = req.headers;

  const token = header.token;
  if (!token) {
    console.warn('No token provided');
    return res.status(401).send({
      message: 'No token provided',
    });
  }

  try {
    const verified = jwt.verify(token, PUBLIC_KEY);

    req.user = verified;
    next();
  } catch (error) {
    console.warn('Authentication failed or unauthorized access');
    res.status(400).send('Unauthorized');
  }
};

module.exports = authorize;
