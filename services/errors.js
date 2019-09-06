const logger = require('../utils/logger');

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  res.locals.isAdmin = process.env.NODE_ENV === 'development' || req.user;
  res.locals.scripts = {};
  res.locals.scripts.costume = 'https://www.google.com/recaptcha/api.js';

  // @FIXME: need to rework this
  const errObj = {
    status: 404,
  };

  if (process.env.NODE_ENV !== 'production') {
    errObj.stack = err.stack;
    errObj.status = err.status || err.errorCode || 502;
    errObj.message = err.message || '';
    if (req.originalUrl.indexOf('/!') === 0) errObj.status = 400;
    if (errObj.status === 400) errObj.message = 'The request cannot be fulfilled due to bad syntax.';
  }

  res.locals = {
    ...res.locals,
    google: true,
    sidebar: true,
    title: `Ошибка ${errObj.status}`,
    description: 'Такой страницы не существует! Ошибка!',
    h1: 'Ой! Ошибка!',
    keywords: `ошибка ${errObj.status}`,
    postimage: 'standart/404.jpg',
  };

  if (errObj.status >= 500) {
    logger.fatal(`${req.originalUrl} -> ${errObj.message}`);
  } else {
    const pathSplit = req.originalUrl.split('/');
    if (!pathSplit.length || pathSplit[1] !== 'images') {
      logger.warn(`${req.originalUrl} [${errObj.status}] -> ${errObj.message}`);
    }
  }

  res.status(errObj.status).render('public/error', { error: errObj });
};
