const bcrypt = require('bcrypt');
const saltRounds = 10;

const hashPassword = async (plainPassword) => {
  try {
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error('Error hashing password');
  }
};

module.exports = hashPassword;
