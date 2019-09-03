const { Comment } = require('.');

const CommentQuery = {
  create: newComment => Comment.insert({
    ...newComment,
    createdAt: new Date(),
  }),
};

module.exports = CommentQuery;
