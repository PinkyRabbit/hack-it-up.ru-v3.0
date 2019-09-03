const { Tag } = require('.');

const TagQuery = {
  getAll: () => Tag.find({}),

  findById: _id => Tag.findOne({ _id }),

  findBySlug: slug => Tag.findOne({ slug }),

  create: newTag => Tag.insert(newTag),

  getAllTags: () => Tag.find({}),

  findExising: (_id, slug) => Tag.findOne({
    _id: { $ne: _id },
    slug,
  }),

  update: (_id, update) => Tag.update({ _id }, { $set: update }),

  delete: _id => Tag.remove({ _id }),
};

module.exports = TagQuery;
