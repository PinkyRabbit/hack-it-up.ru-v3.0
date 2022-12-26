const nodemailer = require('nodemailer');

const Error = require('../../db/error');
const greetingTemplate = require('./templates/greeting');
const errorTemplate = require('./templates/error');
const { auth, domain } = require('../../configs/email');
const { recipients: adminEmail } = require('../../configs/logger');

const transportOps = {
  service: 'Mail.ru',
  auth,
  // pool: true,
  // host: 'hack-it-up.ru',
  // port: 465,
  // secure: true,
};

const smtpTransport = nodemailer.createTransport(transportOps);

const mailOptions = { from: `Сайт ${domain}<${auth.user}>` };

const sendMail = ({ to, subject, html }) => {
  mailOptions.to = to;
  mailOptions.subject = subject;
  mailOptions.html = html;

  smtpTransport.sendMail(mailOptions, (error) => {
    if (error) {
      Error.new({
        stack: error.stack,
        message: error.response,
      });
    }

    smtpTransport.close();
  });
};

const sendGreetings = (emailObject) => {
  const emailBody = greetingTemplate(emailObject);
  const email = {
    to: emailObject.email,
    subject: `Добро пожаловать на ${domain}!`,
    html: emailBody,
  };
  sendMail(email);
};

const sendError = (emailObject) => {
  const emailBody = errorTemplate(emailObject);
  const email = {
    to: adminEmail,
    subject: 'Ошибка на hack-it-up',
    html: emailBody,
  };
  sendMail(email);
};

const sendUpdates = () => { };

module.exports = {
  transportOps,
  sendMail,
  sendGreetings,
  sendUpdates,
  sendError,
};
