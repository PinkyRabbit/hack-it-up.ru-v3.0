const { Error } = require('.');

const ErrorQuery = {
  new: ({ message, stack }) => Error.insert({
    message,
    stack,
    createdAt: new Date(),
  }),
};

module.exports = ErrorQuery;
