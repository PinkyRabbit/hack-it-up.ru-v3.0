const Tag = require('../db/tag');
const {
  updateTagName,
  removeTagFromPosts,
} = require('../db/post');
const { createSlug } = require('../utils/helpers');

const getAllTags = async () => {
  const tags = await Tag.getAll();
  return tags;
};

const createTag = async (tag) => {
  const slug = createSlug(tag);
  const existsTagWithSlug = await Tag.findBySlug(slug);
  if (existsTagWithSlug) {
    return { error: `Возможно нам нужен тег "${existsTagWithSlug.name}"?` };
  }
  const newTag = await Tag.create({
    name: tag,
    slug,
  });
  return { tag: newTag };
};

const updateTag = async (_id, name) => {
  const slug = createSlug(name);
  const existsTagWithSlug = await Tag.findExisting(_id, slug);
  if (existsTagWithSlug) {
    return { error: `Возможно нам нужен тег "${existsTagWithSlug.name}"?` };
  }
  const tag = await Tag.findById(_id);
  await Tag.update(_id, { name, slug });
  await updateTagName(tag.name, name);
  return tag;
};

const deleteTag = async (_id) => {
  const tag = await Tag.findById(_id);
  await Tag.delete(_id);
  await removeTagFromPosts(tag.name);
  return tag;
};

const getFiveRandom = async () => {
  const tags = await Tag.getFive();
  return tags;
};

module.exports = {
  getAllTags,
  createTag,
  updateTag,
  deleteTag,
  getFiveRandom,
};
