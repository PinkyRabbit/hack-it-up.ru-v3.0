const template = require('./template');
const config = require('../../../../configs/email');

const greetingEmailBody = ({ email, pass }) => template({
  unsubscribeLink: `${config.protocol}://${config.domain}/unsubscribe?email=${email}&pass=${pass}`,
});

module.exports = greetingEmailBody;
