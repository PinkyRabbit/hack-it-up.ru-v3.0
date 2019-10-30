const csrf = require('csurf');

const { getCategoriesList } = require('../controllers/categories');
const { getFiveRandom } = require('../controllers/tags');

const recaptchaFront = process.env.RECAPTCHA_FRONT || 'NO_FRONT_SECRET';

const csrfProtection = csrf({ cookie: true });

const init = (app) => {
  app.use((req, res, next) => {
    res.locals.scripts = {};
    res.locals.scripts.custom = [];
    res.locals.isAdmin = process.env.NODE_ENV === 'development' || req.user;
    res.locals.recaptcha = recaptchaFront;
    return next();
  });

  app.get('*', csrfProtection, async (req, res, next) => {
    res.locals.categories = await getCategoriesList();
    res.locals.fiveRandomTags = await getFiveRandom();
    res.locals.csrf = req.csrfToken();
    return next();
  });
};

module.exports = {
  csrfProtection,
  init,
};
