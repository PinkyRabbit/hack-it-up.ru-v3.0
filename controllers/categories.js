const Categories = require('../db/category');
const { removeCategoryAndMakeUnpublished } = require('../db/post');
const { createSlug } = require('../utils/helpers');

const getAllCategories = async () => {
  const categories = Categories.getAll();
  return categories;
};

const createOrUpdateNameAndSlugOfCategory = async (name) => {
  const slug = createSlug(name);
  const category = await Categories.createOrUpdate({ name, slug });
  return category;
};

const updateCategory = async (categoryId, update) => {
  const slug = createSlug(update.name);
  const otherCategory = await Categories.pickOtherCategoryWithSameSlug(categoryId, slug);
  if (otherCategory) {
    return { error: 'Категория с таким слагом уже существует' };
  }

  const category = await Categories.update(categoryId, update);
  return { category };
};

const deleteCategory = async (categoryId) => {
  const category = await Categories.findById(categoryId);
  if (!category) {
    return null;
  }
  await removeCategoryAndMakeUnpublished(category.name);
  await Categories.delete(categoryId);
  return category;
};

const getCategoriesList = async () => {
  const categories = await Categories.getAll();
  const sanitized = categories.map(category => ({
    name: category.name,
    slug: category.slug,
  }));

  return sanitized;
};

module.exports = {
  getAllCategories,
  createOrUpdateNameAndSlugOfCategory,
  updateCategory,
  deleteCategory,
  getCategoriesList,
};
