module.exports = {
  posts: {
    limit: parseInt(process.env.POST_LIMIT, 10),
  },
  twitter: {
    key: process.env.TWITTER_API_KEY,
    secret: process.env.TWITTER_API_SECRET_KEY,
    token_key: process.env.TWITTER_ACCESS_TOKEN,
    token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  },
  recaptcha: process.env.RECAPTCHA_SECRET,
};
