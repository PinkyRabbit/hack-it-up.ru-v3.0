const express = require('express');
const { isEmpty } = require('lodash');

const createError = require('../utils/error');
const articleController = require('../controllers/article');
const {
  validateArticleSlugs,
  validateCategorySlug,
} = require('./validator');

const use = require('./use');

const unstableRouter = express.Router();

unstableRouter
  .get('*', async (req, res, next) => {
    const parts = req.originalUrl.split('/').filter(part => part);

    /* eslint-disable no-case-declarations */
    switch (parts.length) {
      case 1: // category
        const { query } = req;
        const [categorySlug] = parts;

        const { error } = await validateCategorySlug({ categorySlug });
        if (error) {
          return next(createError(400, 'Bad request'));
        }

        const { news, pagination, seo } = await articleController
          .getCategoryNews(categorySlug, query);

        if (!seo || (!news.length && !isEmpty(query))) {
          return next();
        }

        return res.render('public/posts', {
          google: true,
          sidebar: true,
          news,
          pagination,
          ...seo,
        });
      case 2: // article
        const slugs = {
          categorySlug: parts[0],
          articleSlug: parts[1],
        };

        const { error: err } = await validateArticleSlugs(slugs);
        if (err) {
          return next(createError(400, 'Bad request'));
        }

        const article = await use.fullArticle(slugs, next);

        return res.render('public/article', {
          ...article,
          sidebar: true,
          google: true,
          scripts: {
            custom: [
              '/js/comments/runtime~main.be600aad.js',
              '/js/comments/2.dd8d1b3e.chunk.js',
              '/js/comments/main.64809c63.chunk.js',
            ],
          },
        });
      default: // if it is not a category or article
        return next();
    }
    /* eslint-enable no-case-declarations */
  });

module.exports = unstableRouter;
