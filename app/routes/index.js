const adminRoutes = require('./admin');
const publicRoutes = require('./public');
const unstableRoutes = require('./unstable');
const errorHandler = require('../services/errors');
const createError = require('../utils/error');
const { reservedRoutes } = require('./validator.config');
const globalVariables = require('../middleware/globalVariables');

const unstablePath = new RegExp(`/((?!${reservedRoutes.join('|')}).)*`);

module.exports = (app) => {
  globalVariables.init(app);
  app.use('/admin', adminRoutes);
  app.use('/', publicRoutes);
  app.use(unstablePath, unstableRoutes);

  if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
  }

  app.use((req, res, next) => next(createError(404, 'Страница не существует')));
  app.use(errorHandler);
};
