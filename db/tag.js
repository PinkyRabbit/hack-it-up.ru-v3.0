const { Tag } = require('.');

const TagQuery = {
  getAll: (options = {}) => Tag.find({}, options),

  findById: _id => Tag.findOne({ _id }),

  findBySlug: slug => Tag.findOne({ slug }),

  create: newTag => Tag.insert(newTag),

  getAllTags: () => Tag.find({}),

  findExisting: (_id, slug) => Tag.findOne({
    _id: { $ne: _id },
    slug,
  }),

  update: (_id, update) => Tag.update({ _id }, { $set: update }),

  delete: _id => Tag.remove({ _id }),

  getFive: () => Tag.aggregate([{ $sample: { size: 5 } }]),
};

module.exports = TagQuery;
