const mongoose = require('mongoose');
const { DB_NAME, DB_PASSWORD, DB_USER } = require('../../config');

const connectToDatabase = async () => {
  const DBURL = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.jblyq.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

  try {
    const db = await mongoose.connect(DBURL);
    return db;
  } catch (err) {
    console.log('Database Connection Refused');
    console.log(err);
    return false;
  }
};

module.exports = connectToDatabase;
