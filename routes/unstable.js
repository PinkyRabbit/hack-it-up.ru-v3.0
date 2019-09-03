const express = require('express');
const { isEmpty } = require('lodash');
const createError = require('http-errors');

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
          _csrf: req.csrfToken(),
        });
      default:
        return next();
    }
    /* eslint-enable no-case-declarations */
  });

module.exports = unstableRouter;
