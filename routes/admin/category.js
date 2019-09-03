const express = require('express');

const categoryController = require('../../controllers/categories');
const {
  validateId,
  validateCategory,
} = require('../validator');

const adminCategoryRouter = express.Router();

adminCategoryRouter
  .get('/json', categoriesJSON)
  .post('/:categoryId/update', validateId('categoryId'), validateCategory, updateCategory)
  .get('/:categoryId/delete', validateId('categoryId'), deleteCategory);
  // .post('/', createCategory)
  // .get('/:categoryId', editCategory)
  // .put('/:categoryId', updateCategory)
  // .delete('/:categoryId', deleteCategory)
  // .post('/order', changeCategoriesOrder);

async function categoriesJSON(req, res) {
  const categories = await categoryController.getAllCategories();
  return res.json(categories);
}

async function updateCategory(req, res) {
  const { categoryId } = req.params;
  const { body } = req;

  const { error, category } = await categoryController.updateCategory(categoryId, body);
  if (error) {
    req.flash('danger', error);
  } else {
    req.flash('success', `Статья "${category.name}" успешно обновлена!`);
  }

  return res.redirect('back');
}

async function deleteCategory(req, res) {
  const { categoryId } = req.params;
  const category = await categoryController.deleteCategory(categoryId);

  if (category) {
    req.flash('success', `Категория "${category.name}" успешно удалена!`);
  }
  res.redirect('back');
}

// async function editCategory(req, res, next) {
//   return next();
// }

// async function updateCategory(req, res, next) {
//   return next();
// }

// async function deleteCategory(req, res, next) {
//   return next();
// }

// async function changeCategoriesOrder(req, res, next) {
//   return next();
// }

module.exports = adminCategoryRouter;
