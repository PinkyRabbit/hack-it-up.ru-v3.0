const { Category } = require('.');

const CategoryQuery = {
  getAll: () => Category.find({}),

  createOrUpdate: category => Category
    .findOneAndUpdate(
      { name: category.name },
      { $set: category },
      { upsert: true, returnNewDocument: true },
    ),

  findBySlug: slug => Category.findOne({ slug }),

  findById: _id => Category.findOne({ _id }),

  getAllCategories: () => Category.find({}),

  pickOtherCategoryWithSameSlug: (_id, slug) => Category.findOne({
    _id: { $ne: _id },
    slug,
  }),

  update: (_id, update) => Category
    .findOneAndUpdate(
      { _id },
      { $set: update },
      { returnNewDocument: true },
    ),

  delete: _id => Category.remove({ _id }),
};

module.exports = CategoryQuery;
