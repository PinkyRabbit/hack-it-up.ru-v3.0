const connectUrl = process.env.DB_CONNECTION_URL;
if (!connectUrl) {
  throw new Error('DB connection url is empty!');
}

const loggerLevel = process.env.NODE_ENV === 'production'
  ? 'error'
  : 'error';
  // : 'warn';

module.exports = { connectUrl, loggerLevel };
