const express = require('express');

const Comment = require('../../db/comment');

const adminCommentRouter = express.Router();

const {
  validateId,
  validateCommentByAdmin,
} = require('../validator');

adminCommentRouter
  .get('/:commentId/edit', validateId('commentId'), editComment)
  .post('/:commentId/edit', validateId('commentId'), validateCommentByAdmin, saveComment)
  .get('/:commentId/delete', validateId('commentId'), deleteComment)
  .get('/:commentId/all', validateId('commentId'), deleteAllCommentsByAuthor);

async function editComment(req, res) {
  const { commentId } = req.params;
  const comment = await Comment.findById(commentId);
  return res.render('admin/comment', {
    ...comment,
    sidebar: true,
  });
}

async function saveComment(req, res) {
  const { commentId } = req.params;
  const { validatedBody: { body } } = req;
  await Comment.updateBody(commentId, body);
  req.flash('info', 'Комментарий обновлён');
  res.redirect('back');
}

async function deleteComment(req, res) {
  const { commentId } = req.params;
  await Comment.delete(commentId);
  req.flash('success', 'Комментарий безвозвратно удалён');
  res.redirect('back');
}

async function deleteAllCommentsByAuthor(req, res) {
  const { commentId } = req.params;
  const comment = await Comment.findById(commentId);
  const { author } = comment;
  await Comment.deleteAll(author);
  req.flash('success', 'Все комментарии этого автора безвозвратно удалёны');
  res.redirect('back');
}

module.exports = adminCommentRouter;
