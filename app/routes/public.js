const express = require('express');
const { isEmpty } = require('lodash');

const { csrfProtection } = require('../middleware/globalVariables');
const articleController = require('../controllers/article');
const subscriptionController = require('../controllers/subscriptions');
const emailService = require('../services/email');
const authorization = require('./auth');
const fakeNews = require('../utils/fakeNews');
const recaptcha = require('../utils/recaptcha');

const {
  validateSlugs,
  validateComment,
  validateLogin,
  validateEmail,
  validateUnsubscribe,
  validateErrorBody,
} = require('./validator');
const { getAboutMePage } = require('../services/markdown');

const publicRouter = express.Router();

publicRouter
  .get('/', getNews)
  .get('/csrf', csrf)
  .get(
    '/tag/:tagSlug',
    validateSlugs(['tagSlug']),
    newsByTag,
  )
  .get('/about-me', aboutMePage)
  .post(
    '/comment/:articleSlug',
    validateSlugs(['articleSlug']),
    validateComment,
    newComment
  )
  .get(
    '/comments/:articleSlug',
    validateSlugs(['articleSlug']),
    getAppliesComments
  )
  .get('/login', loginPage)
  .post('/login', csrfProtection, validateLogin, authorization)
  .get('/logout', logout)
  .post('/subscribe', csrfProtection, validateEmail, subscribe)
  .get('/unsubscribe', validateUnsubscribe, unsubscribe)
  .post('/send-err', recaptcha, validateErrorBody, sendError)
  .get('/callme', async (req, res) => {
    const result = await fakeNews.pull();
    if (result.status === 'error') {
      req.flash('danger', result.message);
      return res.redirect('/');
    }

    return res.json({ status: result.status });
  });

async function csrf(req, res) {
  const token = req.csrfToken();
  res.send(token);
}

async function getNews(req, res, next) {
  const { query } = req;
  const { news, pagination, seo } = await articleController.getNews(query);

  if (!news.length && !isEmpty(query)) {
    return next();
  }

  return res.render('public/posts', {
    google: true,
    sidebar: true,
    news,
    pagination,
    ...seo,
  });
}

async function newsByTag(req, res, next) {
  const { query } = req;
  const { tagSlug } = req.params;
  const { news, pagination, seo } = await articleController
    .getTagNews(tagSlug, query);

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
}

async function aboutMePage(req, res) {
  const html = await getAboutMePage();
  return res.render('public/me', {
    html,
    google: true,
    sidebar: true,
    title: 'О себе',
    h1: 'Вижу Вас как на яву!',
    keywords: 'Про меня',
    postimage: '/images/base/aboutme.jpg',
    description: 'Тебя тоже нелегко узнать, — согласился Нумминорих. — Но пахнешь-то ты всё так же. — Как свеженькая кошачья какашка, — добавил я.',
  });
}

async function newComment(req, res) {
  const { validatedBody } = req;
  const { articleSlug } = req.params;

  await articleController.addComment(articleSlug, validatedBody);

  req.flash('success', 'Вы успешно прокомментировали статью!');
  return res.redirect('back');
}

async function getAppliesComments(req, res) {
  const { articleSlug } = req.params;
  let { comments } = await articleController.getCommentsByArticleSlug(articleSlug);
  if (!req.user) {
    comments = comments.map((comment) => {
      const { _id, ...lean } = comment;
      return lean;
    });
  }

  return res.json({ comments });
}

async function loginPage(req, res) {
  return res.render('public/login', {
    google: false,
    sidebar: false,
    title: 'Вход...',
    h1: 'Дорога в эхо',
    keywords: 'login',
    postimage: '/images/base/login.jpg',
    description: 'Страничка входа =) Только нафиг она вам сдалась-то?',
    scripts: {
      costume: [
        'https://www.google.com/recaptcha/api.js',
      ],
    },
  });
}

async function logout(req, res) {
  req.logout();
  req.flash('info', 'Вы вышли. Заходите ещё!');
  res.redirect('/');
}

async function subscribe(req, res) {
  const { validatedBody } = req;
  const { error, subscription } = await subscriptionController.subscribe(validatedBody);
  if (error) {
    req.flash('info', error);
  } else {
    req.flash('success', 'Спасибо за подписку! Надеюсь, она будет для вас реально полезной!');
    emailService.sendGreetings(subscription);
  }

  res.redirect('back');
}

async function unsubscribe(req, res) {
  const { validatedBody } = req;
  await subscriptionController.unsubscribe(validatedBody);

  req.flash('success', 'Вы успешно отписались от подписки :)');
  res.redirect('back');
}

async function sendError(req, res) {
  const { validatedBody } = req;
  emailService.sendError(validatedBody);

  req.flash('success', 'Ваше сообщение об ошибке успешно отправлено! Спасибо!');
  res.redirect('/');
}

module.exports = publicRouter;
