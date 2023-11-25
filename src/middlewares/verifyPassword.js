const bcrypt = require('bcrypt');

// Function to verify a password
const verifyPassword = async (plainPassword, hashedPassword) => {
  try {
    const match = await bcrypt.compare(plainPassword, hashedPassword);
    return match;
  } catch (error) {
    throw new Error('Error verifying password');
  }
};

module.exports = verifyPassword;
