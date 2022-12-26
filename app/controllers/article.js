const fs = require('fs');
const path = require('path');
const moment = require('moment');

const Posts = require('../db/post');
const Category = require('../db/category');
const Comment = require('../db/comment');
const Tag = require('../db/tag');
const logger = require('../utils/logger');
const createPagination = require('../utils/pagination');

const createNewArticle = async () => {
  const post = await Posts.new({ comments: [] });
  return post;
};

const updateImage = async (article, file) => {
  const { postimage } = article;
  if (postimage) {
    try {
      fs.unlinkSync(path.join(__dirname, `../public/images/${postimage}`));
    } catch (err) {
      logger.warn(err.message);
    }
  }
  const newImage = `/images/uploads/${file.filename}`;
  await Posts.updateImage(article._id, newImage);
  return newImage;
};

const updateArticle = async (_id, update) => {
  await Posts.update(_id, update);
  return 'Article successfully updated';
};

const getById = async (_id) => {
  const post  = await Posts.getById(_id);
  return post;
};

const getArticleWithRelations = async (_id) => {
  const post = await Posts.getOneByIdWithRelations(_id);
  return post;
};

const publish = async (_id) => {
  const post = await Posts.published(_id, true);
  return post;
};

const makeUnpublished = async (_id) => {
  await Posts.published(_id, false);
  return 'Post was unpublished';
};

const getBaseForNews = async (page = 1, filters = null) => {
  let news = await Posts.getNews(page, filters);
  news = news.map(item => ({
    ...item,
    updatedAt: moment(item.updateAt).locale('ru').format('LLL'),
  }));
  const count = await Posts.getCount(filters);

  const pagination = createPagination(count || 0, page, '/');

  return { news, pagination };
};

const getNews = async ({ page = 1 }) => {
  const { news, pagination } = await getBaseForNews(page);

  const seo = {
    title: 'Главная',
    h1: 'Hello world!',
    keywords: 'developer, примеры, nodejs, учить',
    postimage: '/images/base/main.jpg',
    description: 'Этот блог родился, когда я делал первые шаги в NodeJS. В нём я публикую свои мысли и заметки про программирование и лучше писать код.',
  };
  if (page !== 1) {
    seo.title = `Блог, страница ${page}`;
    seo.h1 = `Лента. Страница ${page}`;
    seo.description = `Страница ${page}. ${seo.description}`;
  }

  return { news, pagination, seo };
};

const getCategoryNews = async (slug, { page = 1 }) => {
  const { news, pagination } = await getBaseForNews(page, { 'category.slug': slug });
  const category = await Category.findBySlug(slug);
  let seo;
  if (category) {
    seo = {
      title: `Раздел ${category.name}`,
      h1: category.name,
      keywords: category.keywords || '',
      postimage: '/images/base/main.jpg',
      description: category.description || '',
    };
    if (page !== 1) {
      seo.title = `${seo.title}, страница ${page}`;
      seo.h1 = `${seo.h1}. Страница ${page}`;
      seo.description = `Страница ${page}. ${seo.description}`;
    }
  }

  return { news, pagination, seo };
};

const getTagNews = async (slug, { page = 1 }) => {
  const { news, pagination } = await getBaseForNews(page, { 'tags.slug': slug });
  const tag = await Tag.findBySlug(slug);

  let seo;
  if (tag) {
    seo = {
      title: tag.name,
      h1: `Про ${tag.name}.`,
      keywords: tag.name,
      postimage: '/images/base/main.jpg',
      description: `Это раздел про ${tag.name}.` || '',
    };
    if (page !== 1) {
      seo.title = `${seo.title}, страница ${page}`;
      seo.h1 = `${seo.h1}. Страница ${page}`;
      seo.description = `${seo.description} Страница ${page}.`;
    }
  }

  return { news, pagination, seo };
};

const deleteArticle = async (articleId) => {
  await Posts.delete(articleId);
  return 'Article was deleted';
};

const addComment = async (slug, comment) => {
  const newComment = await Comment.create(comment);
  const article = await Posts.addComment(slug, newComment._id);
  return article;
};

const getCommentsByArticleSlug = async (slug) => {
  const [comments] = await Posts.getAppliedComments(slug);
  return comments;
};

module.exports = {
  createNewArticle,
  getById,
  updateImage,
  updateArticle,
  getArticleWithRelations,
  publish,
  makeUnpublished,
  getNews,
  getCategoryNews,
  getTagNews,
  deleteArticle,
  addComment,
  getCommentsByArticleSlug,
};
