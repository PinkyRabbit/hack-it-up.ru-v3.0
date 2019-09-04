const reservedRoutes = [
  'login',
  'admin',
  'tag',
  'about-me',
  'logout',
];

const articleFields = [
  'body',
  'category',
  'description',
  'h1',
  'keywords',
  'postimage',
  'slug',
  'tags',
  'title',
];

const categoryFields = [
  'name',
  'description',
  'keywords',
  'comments',
];

module.exports = {
  reservedRoutes,
  articleFields,
  categoryFields,
};
