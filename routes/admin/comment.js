const express = require('express');

const adminCommentRouter = express.Router();

adminCommentRouter
  .get('/:commentId', editComment)
  .put('/:commentId', updateComment)
  .delete('/:commentId', deleteComment);

async function editComment(req, res, next) {
  return next();
}

async function updateComment(req, res, next) {
  return next();
}

async function deleteComment(req, res, next) {
  return next();
}

module.exports = adminCommentRouter;
