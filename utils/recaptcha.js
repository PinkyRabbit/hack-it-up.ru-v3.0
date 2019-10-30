const http = require('./http');

const recaptchaSecret = process.env.RECAPTCHA_BACK || 'NO_SECRET';

module.exports = async (req, res, next) => {
  const { 'g-recaptcha-response': recaptchaResp, ...body } = req.body;
  const { ip: requestIp } = req;

  if (recaptchaResp) {
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${recaptchaResp}&remoteip=${requestIp}`;
    const googleResponse = await http.getJson(verifyUrl);
    if (googleResponse && googleResponse.success) {
      req.body = body;
      return next();
    }
  }

  req.flash('warning', 'Ошибка при вводе капчи. Попробуйте снова.');
  return res.redirect('back');
};
