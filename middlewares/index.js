const path = require('path');
const helmet = require('helmet');
const favicon = require('serve-favicon');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const passport = require('passport');
const morgan = require('morgan');

const sessions = require('./sessions');
const makeFlash = require('./flash');
const compression = require('./compression');

const authentication = require('../utils/authentication');

authentication.init();

const env = process.env.NODE_ENV;

module.exports = (app) => {
  if (env === 'development') {
    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Credentials', true);
      res.header('Access-Control-Allow-Origin', req.headers.origin);
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
      res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
      next();
    });
  } else {
    app.use(helmet());
    compression(app);
  }

  // view engine setup
  app.set('views', path.join(__dirname, '..', 'views'));
  app.set('view engine', 'twig');

  // body parser
  app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
  app.use(bodyParser.json());

  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }
  sessions(app);
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(favicon(path.join(__dirname, '..', 'public', 'favicon.png')));
  app.use(flash());
  app.get('*', makeFlash);
};
