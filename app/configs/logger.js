const loggerConfig = {
  recipients: process.env.ADMIN_EMAIL,
  loggerType: process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development'
    ? process.env.NODE_ENV
    : 'default',
  deliveryEmail: process.env.EMAIL_DELIVERY_EMAIL,
};

module.exports = loggerConfig;
