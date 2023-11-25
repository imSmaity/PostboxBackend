const express = require('express');
require('dotenv').config({ path: '.env.local' });
const cors = require('cors');
const bodyParser = require('body-parser');
const { PORT } = require('../config.js');
const connectToDatabase = require('./db/db.connect.js');
const routes = require('./routes/index.js');
const errorHandler = require('./middlewares/errorHandler.js');
const routeNotFoundHandler = require('./middlewares/routeNotFoundHandler.js');

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'Server running' });
});
app.use('/v1', routes);

//Error handler
app.use(errorHandler);
app.use(routeNotFoundHandler);

app.listen(PORT, async () => {
  try {
    console.log(`Server started on port ${PORT}`);
    const db = await connectToDatabase();
    if (db) {
      console.log('Database connected success');
    } else {
      throw new Error('Could not connect to db');
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
});
