const sessionConfig = {
  name: process.env.SESSION_NAME,
  resave: process.env.NODE_ENV !== 'production',
  secret: process.env.SESSION_SECRET,
};

module.exports = sessionConfig;
