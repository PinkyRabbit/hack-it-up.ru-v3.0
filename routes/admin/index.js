const express = require('express');
const moment = require('moment');

const { isAuthenticated } = require('../../utils/authentication');
const adminArticleRoute = require('./article');
const adminCategoryRoute = require('./category');
const adminTagsRoute = require('./tags');
const adminCommentRoute = require('./comment');
const { generator } = require('../../utils/helpers');
const { getUnpublished } = require('../../db/post');
const { getAllTags } = require('../../db/tag');
const { getAllCategories } = require('../../db/category');

const adminRouter = express.Router();

adminRouter
  .use('*', isAuthenticated, addSeoAdmin)
  .get('/', getAdminPage)
  .use('/article', adminArticleRoute)
  .use('/categories', adminCategoryRoute)
  .use('/tags', adminTagsRoute)
  .use('/comments', adminCommentRoute)
  .get('/generate', generateData);

function addSeoAdmin(req, res, next) {
  res.locals.google = false;
  res.locals.sidebar = false;
  res.locals.title = 'Админка';
  res.locals.description = 'Админка';
  res.locals.h1 = 'Админка';
  res.locals.keywords = 'Админка';
  res.locals.postimage = 'standart/admin.jpg';

  return next();
}

async function generateData(req, res) {
  const result = await generator(req.query);
  return res.json(result);
}

async function getAdminPage(req, res) {
  const unpublished = await getUnpublished();
  const posts = unpublished.map(post => ({
    _id: post._id,
    createdAt: moment(post.createdAt).locale('ru').format('ll'),
    h1: post.h1 || 'Заголовок не указан',
  }));
  const tags = await getAllTags();
  const categories = await getAllCategories();

  // res.json({ posts, categories, tags });
  return res.render('admin/dashboard', { posts, categories, tags, _csrf: req.csrfToken() });
}

module.exports = adminRouter;
