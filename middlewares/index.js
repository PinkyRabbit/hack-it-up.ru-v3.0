const path       = require('path');
const helmet     = require('helmet');
const favicon    = require('serve-favicon');
const csrf       = require('csurf');
const flash      = require('connect-flash');
const bodyParser = require('body-parser');
const passport   = require('passport');
const morgan     = require('morgan');

const sessions    = require('./sessions');
const makeFlash   = require('./flash');
const compression = require('./compression');

const authentication = require('../utils/authentication');

authentication.init();

module.exports = (app) => {
  app.use(helmet());
  compression(app);
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
  app.use(csrf({ cookie: true }));
  app.use(favicon(path.join(__dirname, '..', 'public', 'favicon.png')));
  app.use(flash());
  app.get('*', makeFlash);
};
