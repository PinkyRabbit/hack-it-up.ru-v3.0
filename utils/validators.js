const { check } = require('express-validator/check');

module.exports.emailValidation = [
  check('email')
    .isEmail()
    .withMessage('Такой почты никогда не существовало =)'),
];
