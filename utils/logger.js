const log4js = require('log4js');
const path = require('path');

const { transportOps } = require('./email');

const FILENAME = path.resolve(__dirname, '../logs/app.log');

log4js.configure({
  appenders: {
    out: {
      type: 'stdout',
    },
    toFile: { type: 'file', filename: FILENAME },
    email: {
      type: '@log4js-node/smtp',
      recipients: process.env.ADMIN_EMAIL,
      sender: `"Сайт hack-it-up" <${process.env.EMAIL_DELIVERY_EMAIL}>`,
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
    dev: {
      appenders: ['out'],
      level: 'debug',
    },
    prod: {
      appenders: ['toFile', 'email'],
      level: 'debug',
    },
  },
});

const type = process.env.NODE_ENV || 'development';

const useLogger = ({
  production: 'prod',
  development: 'dev',
  test: 'default',
})[type];


const logger = log4js.getLogger(useLogger);

module.exports = logger;
