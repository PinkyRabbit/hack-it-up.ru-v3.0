const { Comment } = require('.');

const CommentQuery = {
  create: newComment => Comment.insert({
    ...newComment,
    createdAt: new Date(),
  }),

  findById: _id => Comment.findOne({ _id }),

  updateBody: (_id, body) => Comment.update({ _id }, { $set: { body } }),

  delete: _id => Comment.remove({ _id }),

  deleteAll: author => Comment.remove({ author }),
};

module.exports = CommentQuery;
