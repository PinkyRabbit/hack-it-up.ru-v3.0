const session = require('express-session');
const cookieParser = require('cookie-parser');
const MemoryStore = require('memorystore')(session);

const { name, resave, secret } = require('../configs/session');

module.exports = (app) => {
  app.use(session({
    name,
    resave,
    secret,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
      secure: 'auto',
      sameSite: true,
    },
    store: new MemoryStore({
      checkPeriod: 43200000,
    }),
  }));
  app.use(cookieParser());
};
