const Twitter = require('twitter');
const logger  = require('../utils/logger');
const config  = require('../config');

const client = new Twitter({
  consumer_key: config.twitter.key,
  consumer_secret: config.twitter.secret,
  access_token_key: config.twitter.token_key,
  access_token_secret: config.twitter.token_secret,
});

module.exports = (app) => {
  app.get('*', async (req, res, next) => {
    try {
      await client.get('statuses/user_timeline', { count: 5 });
    } catch (err) {
      logger.error(err);
    }
    return next();
  });
};
