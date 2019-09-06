const log4js = require('log4js');
const path = require('path');

const { transportOps } = require('../services/email');
const { recipients, loggerType, deliveryEmail } = require('../configs/logger');

const FILENAME = path.resolve(__dirname, '../logs/app.log');

log4js.configure({
  appenders: {
    out: {
      type: 'stdout',
    },
    toFile: { type: 'file', filename: FILENAME },
    email: {
      type: '@log4js-node/smtp',
      recipients,
      sender: `"Сайт hack-it-up" <${deliveryEmail}>`,
      subject: 'Ошибка на сайте',
      sendInterval: 3600,
      transport: transportOps,
    },
  },
  categories: {
    default: {
      appenders: ['toFile', 'out'],
      level: 'error',
    },
    development: {
      appenders: ['out'],
      level: 'debug',
    },
    production: {
      appenders: ['toFile', 'email'],
      level: 'debug',
    },
  },
});

const logger = log4js.getLogger(loggerType);

module.exports = logger;
