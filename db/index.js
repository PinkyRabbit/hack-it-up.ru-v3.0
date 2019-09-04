const monk = require('monk');

/* eslint-disable prefer-template */
const url = [
  process.env.DB_USER
    ? process.env.DB_USER + ':' + process.env.DB_PASSWORD + '@'
    : '',
  process.env.IP + ':27017',
  process.env.NODE_ENV === 'test' ? '/test' : '/' + process.env.DB,
].join('');
/* eslint-enable prefer-template */

monk(url).catch((err) => {
  console.log(err); // eslint-disable-line
  process.exit(1);
});

module.exports = {
  mongodbId: _id => monk.id(_id),
  User: monk(url).get('user'),
  Post: monk(url).get('post'),
  Category: monk(url).get('category'),
  Tag: monk(url).get('tag'),
  Comment: monk(url).get('comment'),
  Subscription: monk(url).get('subscription'),
};
