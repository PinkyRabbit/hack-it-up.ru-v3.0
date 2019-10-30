const request = require('request');
const { promisify } = require('util');
const { uniq } = require('lodash');

const db = require('../db');
const { createSlug } = require('./helpers');

const getNews = promisify(request.get);

const baseUrl = 'https://newsapi.org/v2/everything?';

const queryUrl = [
  'qInTitle=space',
  'page=1',
  'sortBy=publishedAt',
  'pageSize=99',
  `apiKey=${process.env.NEWSAPI_KEY}`,
];

const requestOptions = {
  url: baseUrl + queryUrl.join('&'),
  json: true,
};

const getFakeNews = async () => {
  const { body } = await getNews(requestOptions);

  if (body.status === 'ok') {
    await destroyOldData();

    const baseArticles = body.articles
      .filter(item => item.content && item.description && item.title && item.urlToImage);

    const articles = reworkArticles(baseArticles);
    const insertArticlesQueryArray = articles
      .map(article => db.Post.insert(article));

    const tags = getTagsArray(articles);
    const insertTagsQueryArray = tags
      .map(tag => db.Tag.insert(tag));

    const categories = getCategoriesArray(articles);
    const insertCategoriesArray = categories
      .map(category => db.Category.insert(category));

    await Promise.all([
      ...insertArticlesQueryArray,
      ...insertTagsQueryArray,
      ...insertCategoriesArray,
    ]);
  }

  return body;
};

function reworkArticles(baseArticles) {
  const articles = [];
  for (let i = 0; i < baseArticles.length; i += 1) {
    const item = baseArticles[i];
    const categoryNumber = i % 6;
    articles.push({
      isPublished: true,
      createdAt: getTime(i),
      updatedAt: getTime(i),
      body: fixContent(item.content),
      description: item.description,
      h1: item.title,
      keywords: getTags(item.title, 5),
      postimage: item.urlToImage,
      slug: createSlug(item.title),
      title: item.title,
      tags: getTags(item.title),
      category: `Category-${categoryNumber}`,
    });
  }

  return articles;
}

function fixContent(content) {
  const htmlContent = content
    .replace('\r\n', '\n')
    .replace(/<a href.*?>(.*)?<\/a>/img, '$1')
    .split('\n')
    .join('</p><p>');

  return `<p>${htmlContent}</p>`;
}

function getTags(title, to = 3) {
  const tagsArray = title
    .split(' ')
    .filter(tag => /[a-zа-я0-9]{2}([a-zа-я0-9-]{2,})?/i.test(tag))
    .map(tag => /[a-zа-я0-9]{2}([a-zа-я0-9-]{2,})?/i.exec(tag)[0]);

  if (!tagsArray.length) {
    tagsArray.push('default');
  }

  return tagsArray.length > to ? tagsArray.slice(1, to) : tagsArray;
}

function getTime(it) {
  const timestamp = Date.now();
  const articleDate = timestamp - (1000 * 60 * 24 * it);
  return new Date(articleDate);
}

function getTagsArray(articles) {
  const allTags = articles.reduce((tags, article) => [...tags, ...article.tags], []);

  return uniq(allTags).map(tag => ({
    name: tag,
    slug: createSlug(tag),
  }));
}

function getCategoriesArray(articles) {
  const allCategories = articles
    .reduce((categories, article) => [...categories, article.category], []);
  return uniq(allCategories).map(category => ({
    name: category,
    slug: createSlug(category),
  }));
}

function destroyOldData() {
  return Promise.all([
    db.Post.drop(),
    db.Category.drop(),
    db.Tag.drop(),
    db.Comment.drop(),
    db.Subscription.drop(),
    db.Error.drop(),
  ]);
}

module.exports = {
  pull: getFakeNews,
  drop: destroyOldData,
};
