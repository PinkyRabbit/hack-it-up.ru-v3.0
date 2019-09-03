const nodemailer = require('nodemailer');

const transportOps = {
  service: 'Mail.ru',
  auth: {
    user: process.env.EMAIL_DELIVERY_EMAIL,
    pass: process.env.EMAIL_DELIVERY_PASSWORD,
  },
  // pool: true,
  // host: 'hack-it-up.ru',
  // port: 465,
  // secure: true,
};

const smtpTransport = nodemailer.createTransport(transportOps);

const mailOptions = { from: `Hello World <${process.env.EMAIL_DELIVERY_EMAIL}>` };

function toHtml(str) {
  return str
    .replace(/[\s\r\n]+$/, '')
    .replace(/^[\s\r\n]+/, '')
    .replace(/\r\n/gm, '<br>')
    .replace(/\n/gm, '<br>');
}

const sendMail = ({ to, subject, text }) => {
  return new Promise((resolve, reject) => {
    mailOptions.to = to;
    mailOptions.subject = subject;
    mailOptions.text = text;
    mailOptions.html = toHtml(text);

    smtpTransport.sendMail(mailOptions, (error, response) => {
      if (error) return reject(error);
      smtpTransport.close();
      return resolve();
    });
  });
};

module.exports = {
  transportOps,
  sendMail,
};
