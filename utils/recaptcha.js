const https         = require('https');
const logger        = require('./logger');
const { recaptcha } = require('../config');

module.exports = (req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    return next();
  }

  const recaptchaResp = req.body['g-recaptcha-response'];

  if (recaptchaResp) {
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptcha}&response=${recaptchaResp}&remoteip=${req.ip}`;
    return https.get(verifyUrl, (resp) => {
      let data = '';

      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {
        const google = JSON.parse(data);

        if (!google.success) {
          req.flash('Ошибка при вводе капчи. Попробуйте снова.');
          res.redirect('back');
        } else {
          next();
        }
      });
    }).on('error', (err) => {
      logger.debug(err);
      res.status(401).redirect('back');
    });
  }
  req.flash('danger', 'Капча не введена! Вы же не робот?');
  return res.redirect('back');
};
