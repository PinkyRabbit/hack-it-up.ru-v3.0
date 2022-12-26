require('dotenv').config();

const bcrypt   = require('bcryptjs');

const { User } = require('..');
const logger   = require('../../utils/logger');

bcrypt.hash(process.env.ADMIN_PASSWORD, 10, (err, hash) => {
  if (err) { return logger.error(err); }
  const SA = {
    email: process.env.ADMIN_EMAIL,
    password: hash,
  };

  return User.update(
    { email: process.env.ADMIN_EMAIL },
    { $set: SA },
    { upsert: true },
  )
    .then(() => {
      logger.debug('SA successfully installed');
      process.exit(0);
    })
    .catch((dbError) => {
      logger.fatal(dbError.message);
      process.exit(1);
    });
});
