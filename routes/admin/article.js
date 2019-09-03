const express = require('express');

const articleController = require('../../controllers/article');
const { createOrUpdateNameAndSlugOfCategory } = require('../../controllers/categories');
const { uploadImage } = require('../../services/multer');
const use = require('../use');
const {
  validateId,
  validateArticle,
} = require('../validator');

const adminArticleRouter = express.Router();

adminArticleRouter
  .get('/new', createAndRedirectToNewArticle)
  .get('/:articleId', validateId('articleId'), use.article, getJson)
  .get('/:articleId/edit', validateId('articleId'), use.article, editArticle)
  .put('/:articleId/edit', validateId('articleId'), use.article, articlePresave)
  .post('/:articleId/edit', validateId('articleId'), use.article, validateArticle(false), saveArticle)
  .post('/:articleId/image', validateId('articleId'), use.article, uploadImage, checkUploadedImage)
  .get('/:articleId/view', validateId('articleId'), use.article, viewArticle)
  .post('/:articleId/view', validateId('articleId'), use.article, validateArticle(true), publishArticle)
  .get('/:articleId/delete', validateId('articleId'), use.article, deleteArticle);

async function createAndRedirectToNewArticle(req, res) {
  const { _id: articleId } = await articleController.createNewArticle();
  res.redirect(`/admin/article/${articleId}/edit`);
}

async function editArticle(req, res) {
  const { articleId } = req.params;
  await articleController.makeUnpublished(articleId);

  res.locals.scripts = {};
  res.locals.scripts.custom = `${process.env.VUE === 'development' ? 'http://localhost:3000' : ''}/js/edit-news.js`;
  return res.render('public/vue');
}

async function getJson(req, res) {
  const { article } = req;
  res.json(article);
}

async function checkUploadedImage(req, res) {
  const { article } = req;
  const { file } = req;
  const fileName = await articleController.updateImage(article, file);
  res.json({ fileName });
}

async function articlePresave(req, res) {
  const { article } = req;
  const { validatedBody } = req;
  const result = await articleController.updateArticle(article._id, validatedBody);
  res.send(result);
}

async function saveArticle(req, res) {
  const { article } = req;
  const { validatedBody } = req;

  await articleController.updateArticle(article._id, validatedBody);
  res.redirect(`/admin/article/${article._id}/view`);
}

async function viewArticle(req, res) {
  const { articleId } = req.params;
  const post = await articleController.getById(articleId);

  return res.render('public/article', {
    ...post,
    category: {
      name: post.category || '',
    },
    tags: post.tags.length
      ? post.tags.map(tag => ({ name: tag }))
      : [],
    sidebar: true,
    _csrf: req.csrfToken(),
  });
}

async function publishArticle(req, res) {
  const { articleId } = req.params;

  const article = await articleController.publish(articleId);
  const category = await createOrUpdateNameAndSlugOfCategory(article.category);

  req.flash('success', 'Статья успешно опубликована!');
  const redirectLink = `/${category.slug}/${article.slug}`;
  res.redirect(redirectLink);
}

async function deleteArticle(req, res) {
  const { article } = req;
  await articleController.deleteArticle(article._id);
  req.flash('success', `Статья "${article.h1 || 'Без названия'}" (_id="${article._id}") успешно удалена!`);
  res.redirect('back');
}

module.exports = adminArticleRouter;
