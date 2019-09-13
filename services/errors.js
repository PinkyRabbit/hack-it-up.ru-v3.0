const logger = require('../utils/logger');

const isProduction = process.env.NODE_ENV === 'production';

const statusesMessages = {
  400: 'Ошибка в запросе. Данные были введены не верно',
  401: 'Для этого действия необходима авторизация',
  403: 'У вас недостаточно прав для доступа к этой информации',
  404: 'Страница не найдена',
  502: 'Ошибка сервера. Повторите запрос или сообщите об ошибке',
};

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  res.locals.isAdmin = process.env.NODE_ENV === 'development' || req.user;
  res.locals.scripts = {};
  res.locals.scripts.costume = 'https://www.google.com/recaptcha/api.js';

  const errorObject = { ...err };

  if (req.originalUrl.indexOf('/!') === 0) {
    errorObject.status = 400;
  }

  if (!errorObject.status || ![400, 401, 403, 404].includes(errorObject.status)) {
    errorObject.status = 502;
  }

  if (!isProduction && [401, 403].includes(errorObject.status)) {
    errorObject.status = 404;
  }

  if (!errorObject.message) {
    errorObject.message = statusesMessages[errorObject.status];
  }

  res.locals = {
    ...res.locals,
    google: true,
    sidebar: true,
    title: `Ошибка ${errorObject.status}`,
    description: 'Такой страницы не существует! Ошибка!',
    h1: 'Ой! Ошибка!',
    keywords: `ошибка ${errorObject.status}`,
    postimage: '/images/standart/404.jpg',
  };

  if (errorObject.status >= 500) {
    logger.fatal(`${req.originalUrl} -> ${errorObject.message}`);
  } else {
    logger.warn(`${req.originalUrl} [${errorObject.status}] -> ${errorObject.message}`);
  }

  res.status(errorObject.status).render('public/error', { error: errorObject });
};
