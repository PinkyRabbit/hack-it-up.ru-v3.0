const DOMAIN = 'www.hack-it-up.ru';

const emailConfig = {
  protocol: process.env.NODE_ENV === 'production' ? 'https' : 'http',
  domain: DOMAIN,
  auth: {
    user: process.env.EMAIL_DELIVERY_EMAIL,
    pass: process.env.EMAIL_DELIVERY_PASSWORD,
  },
};

emailConfig.websiteUrl = `${emailConfig.protocol}://${emailConfig.domain}`;

module.exports = emailConfig;
