const fs = require('fs');

module.exports = {
  PORT: process.env.PORT || 4000,
  VERSION: process.env.VERSION || 'v1',
  DB_USER: process.env.DB_USER || '',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || '',
  PRIVATE_KEY: (() => {
    try {
      return fs.readFileSync('private.key', 'utf8');
    } catch (err) {
      console.log('[error] private.key file not found.', err);
      return null;
    }
  })(),
  PUBLIC_KEY: (() => {
    try {
      return fs.readFileSync('public.key', 'utf8');
    } catch (err) {
      console.log('[error] public.key file not found.', err);
      return null;
    }
  })(),
};
