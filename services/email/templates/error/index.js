const template = require('./template');

const errorNotificationEmailBody = ({ name, email, body }) => template({
  from: `${name} <${email}>`,
  subjectText: body,
});

module.exports = errorNotificationEmailBody;
