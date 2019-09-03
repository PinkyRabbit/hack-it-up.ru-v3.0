module.exports = (req, res, next) => {
  const messages = [];
  // primary success danger
  const flash = req.flash();
  if (flash) {
    for (const key in flash) { // eslint-disable-line no-restricted-syntax
      if (Object.prototype.hasOwnProperty.call(flash, key) && flash[key].length) {
        for (let count = 0; count < flash[key].length; count += 1) {
          messages.push({ type: key, msg: flash[key][count] });
        }
      }
    }
  }

  if (req.session && req.session.validationErrors) {
    const { validationErrors } = req.session;
    validationErrors.forEach(error => messages.push({ type: error.type, msg: error.msg }));
    req.session.validationErrors = null;
  }

  if (messages) res.locals.messages = messages;
  next();
};
