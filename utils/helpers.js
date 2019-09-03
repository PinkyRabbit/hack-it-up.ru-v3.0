const transliteration = require('transliteration.cyr');

const Post = require('../db/post');

const createSlug = (str) => {
  let slug = transliteration.transliterate(str)
    .replace(/[\W_]+/g, '-')
    .replace(/-{,2}/g, '-')
    .toLowerCase()
    .trim();

  if (slug.charAt(0) === '-') {
    slug = slug.substr(1);
  }
  if (slug.charAt(slug.length - 1) === '-') {
    slug = slug.slice(0, -1);
  }
  return slug;
};

const generator = async (query) => {
  if (query.slug) {
    const slug = createSlug(query.slug);
    const isPost = await Post.findBySlug(slug);

    if (isPost) {
      return { error: true, slug: '' };
    }
    return { slug };
  }

  return { error: true };
};

const lean = object => Object.assign({}, object);

module.exports = {
  createSlug,
  generator,
  lean,
};
