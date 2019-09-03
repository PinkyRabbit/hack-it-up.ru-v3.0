const createError  = require('http-errors');

const adminRoutes = require('./admin');
const publicRoutes = require('./public');
const unstableRoutes = require('./unstable');
const errorHandler = require('../services/errors');
const { reservedRoutes } = require('./validator.config');

const unstablePath = new RegExp(`/((?!${reservedRoutes.join('|')}).)*`);

module.exports = (app) => {
  app.get('*', (req, res, next) => {
    res.locals.isAdmin = process.env.NODE_ENV === 'development' || req.user;
    return next();
  });

  app.use('/admin', adminRoutes);
  app.use('/', publicRoutes);
  app.use(unstablePath, unstableRoutes);

  if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
  }

  app.use((req, res, next) => next(createError(404, 'Страница не существует')));
  app.use(errorHandler);
};
