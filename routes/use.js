const createError  = require('http-errors');

const Posts = require('../db/post');

const article = async (req, res, next) => {
  const { articleId } = req.params;

  const requestedArticle = await Posts.getById(articleId);
  if (!requestedArticle) {
    return next(createError(404, 'Not found'));
  }

  req.article = requestedArticle;
  return next();
};

const fullArticle = async (slugs, next) => {
  const {
    articleSlug,
    categorySlug,
  } = slugs;

  const requestedArticle = await Posts.getOneBySlugWithRelations(articleSlug);
  if (
    !requestedArticle
    || !requestedArticle.category
    || !requestedArticle.category.slug
    || requestedArticle.category.slug !== categorySlug
  ) {
    return next(createError(404, 'Not found'));
  }

  return requestedArticle;
};

module.exports = {
  article,
  fullArticle,
};
