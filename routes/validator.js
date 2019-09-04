const Joi = require('joi');
const createError = require('http-errors');
const { uniq } = require('lodash');

const config = require('./validator.config');

Joi.objectId = require('joi-objectid')(Joi);

const articleSchema = Object
  .assign(...config.articleFields.map((prop) => {
    if (prop === 'tags') {
      return { [prop]: Joi.array().items(Joi.string().min(2)).required() };
    }

    return { [prop]: Joi.string().min(2).required() };
  }));

const categorySchema = Object
  .assign(...config.categoryFields.map(prop => ({ [prop]: Joi.string().min(2).required() })));

const getSlugsSchema = slugsArray => Object
  .assign(...slugsArray.map(slug => ({ [slug]: Joi.string().regex(/^[a-z0-9-]+$/) })));

const articleSlugsSchema = {
  categorySlug: Joi.string().regex(/^[a-z0-9-]+$/).required(),
  articleSlug: Joi.string().regex(/^[a-z0-9-]+$/).required(),
};

const categorySlugSchema = {
  categorySlug: Joi.string().regex(/^[a-z0-9-]+$/).required(),
};

const validateCommentSchema = {
  author: Joi.string().email().required(),
  body: Joi.string().min(2).max(250).required(),
};

const validateLoginSchema = {
  email: Joi.string().email().required(),
  password: Joi.string().regex(/^[a-z0-9-]+$/).required(),
};

const validateSlugs = (slugsArray) => {
  const slugsSchema = getSlugsSchema(slugsArray);
  return (req, res, next) => {
    const { error } = Joi.validate(req.params, slugsSchema);

    if (error) {
      return next(createError(400, 'Bad request'));
    }
    return next();
  };
};

const validateArticle = (isErrorThrowing = true) => (req, res, next) => {
  const { error: err } = Joi.validate(req.params, {
    articleId: Joi.objectId().required(),
  });

  if (err) {
    return next(createError(400, 'Bad request'));
  }

  const { body } = req;
  if (body.tags && !Array.isArray(body.tags)) {
    body.tags = [body.tags];
  }
  const { error, value } = Joi.validate(body, articleSchema);
  if (error) {
    const erroredFields = uniq(error.details.map(element => element.path[0]));
    erroredFields
      .forEach(field => req.flash('success', `Пустое значение в поле ${field.toUpperCase()}`));

    if (isErrorThrowing) {
      res.status(400);
      return res.redirect('back');
    }
  }
  req.validatedBody = value;

  return next();
};

const validateId = (idParamName) => {
  const idSchema = { [idParamName]: Joi.objectId().required() };
  return (req, res, next) => {
    const { error } = Joi.validate(req.params, idSchema);
    if (error) {
      return next(createError(400, 'Bad request'));
    }
    return next();
  };
};


const validateArticleSlugs = (slugs) => {
  const { error } = Joi.validate(slugs, articleSlugsSchema);
  return { error };
};

const validateCategorySlug = (slug) => {
  const { error } = Joi.validate(slug, categorySlugSchema);
  return { error };
};

const validateCategory = (req, res, next) => {
  const { _csrf, ...body } = req.body;
  const { error, value } = Joi.validate(body, categorySchema);
  if (error) {
    const erroredFields = uniq(error.details.map(element => element.path[0]));
    erroredFields
      .forEach(field => req.flash('success', `Пустое значение в поле ${field.toUpperCase()}`));

    res.status(400);
    return res.redirect('back');
  }
  req.validatedBody = value;

  return next();
};

const validateTag = (req, res, next) => {
  const { _csrf, ...body } = req.body;
  const { error, value } = Joi.validate(body, {
    name: Joi.string().min(2).required(),
  });
  if (error) {
    req.flash('success', 'Пустое значение в поле name');

    res.status(400);
    return res.redirect('back');
  }
  req.validatedBody = value;

  return next();
};

const validateCommentByAdmin = (req, res, next) => {
  const { body } = req.body;
  const { error, value } = Joi.validate({ body }, {
    body: Joi.string().min(2).required(),
  });
  if (error) {
    req.flash('success', 'Пустое значение в поле body');

    res.status(400);
    return res.redirect('back');
  }
  req.validatedBody = value;

  return next();
};

const validateComment = (req, res, next) => {
  const { _csrf, ...body } = req.body;
  const { error, value } = Joi.validate(body, validateCommentSchema);
  if (error) {
    req.flash('danger', 'Комментарий необходимо заполнять полностью. Не опубликовано.');
    res.status(400);
    return res.redirect('back');
  }
  req.validatedBody = value;

  return next();
};

const validateLogin = (req, res, next) => {
  const { _csrf, ...body } = req.body;
  const { error, value } = Joi.validate(body, validateLoginSchema);
  if (error) {
    res.status(400);
    return res.redirect('back');
  }
  req.validatedBody = value;

  return next();
};

const validateEmail = (req, res, next) => {
  const { email } = req.body;
  const { error, value } = Joi.validate({ email }, {
    email: Joi.string().email().required(),
  });
  if (error) {
    req.flash('success', 'Ошибка в указаной почте... *_*');

    res.status(400);
    return res.redirect('back');
  }
  req.validatedBody = value;

  return next();
};

module.exports = {
  validateId,
  validateArticle,
  validateSlugs,
  validateArticleSlugs,
  validateCategorySlug,
  validateCategory,
  validateTag,
  validateComment,
  validateCommentByAdmin,
  validateLogin,
  validateEmail,
};
