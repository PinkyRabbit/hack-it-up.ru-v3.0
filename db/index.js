const monk = require('monk');

const { connectUrl: url, loggerLevel } = require('../configs/database');

monk(url).catch((err) => {
  console.log(err); // eslint-disable-line
  process.exit(1);
});

const options = {
  loggerLevel,
};

module.exports = {
  mongodbId: _id => monk.id(_id),
  User: monk(url, options).get('user'),
  Post: monk(url, options).get('post'),
  Category: monk(url, options).get('category'),
  Tag: monk(url, options).get('tag'),
  Comment: monk(url, options).get('comment'),
  Subscription: monk(url, options).get('subscription'),
  Error: monk(url, options).get('error'),
};
