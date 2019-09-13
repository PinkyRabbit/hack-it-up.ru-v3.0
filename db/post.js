const moment = require('moment');

const {
  mongodbId,
  Post,
} = require('.');

const limit = parseInt(process.env.PAGE_LIMIT, 10);

const join = {
  tags: {
    from: 'tag',
    localField: 'tags',
    foreignField: 'name',
    as: 'tags',
  },
  categories: {
    from: 'category',
    localField: 'category',
    foreignField: 'name',
    as: 'categories',
  },
  comments: {
    from: 'comment',
    localField: 'comments',
    foreignField: '_id',
    as: 'comments',
  },
};

const sanitilize = article => ({
  dateurl: article.dateurl || null,
  isPublished: article.isPublished || false,
  updatedAt: article.updatedAt || null,
  body: article.body || '',
  category: article.category || null,
  description: article.description || '',
  h1: article.h1 || '',
  keywords: article.keywords || '',
  postimage: article.postimage || '',
  slug: article.slug || '',
  title: article.title || '',
  tags: Array.isArray(article.tags)
    ? article.tags
    : [article.tags].filter(Boolean),
  comments: article.comments || [],
});

const projectForFullArticle = {
  $project:
    {
      _id: 1,
      isPublished: 1,
      updatedAt: 1,
      body: 1,
      description: 1,
      h1: 1,
      keywords: 1,
      postimage: 1,
      slug: 1,
      title: 1,
      tags: 1,
      category: {
        $cond: {
          if: '$categories',
          then: '$categories',
          else: {
            name: '$category',
          },
        },
      },
    },
};

const getFullAggrigationWithoutQuery = [
  { $lookup: join.tags },
  { $lookup: join.categories },
  {
    $unwind: {
      path: '$categories',
      preserveNullAndEmptyArrays: true,
    },
  },
];

const PostsQuery = {
  getById: _id => Post.findOne({ _id }),

  findBySlug: slug => Post.findOne({ slug }),

  new: () => {
    const date = new Date();
    return Post.insert({
      dateurl: moment(date).format('MM-YYYY'),
      isPublished: false,
      createdAt: date,
      updatedAt: date,
    });
  },

  update: (_id, update) => Post.update(
    { _id },
    { $set: sanitilize({ ...update, updatedAt: new Date() }) },
  ),

  published: (_id, isPublished) => Post.findOneAndUpdate({ _id }, {
    $set: {
      isPublished,
      updatedAt: new Date(),
    },
  },
  {
    returnNewDocument: true,
  }),

  updateImage: (_id, postimage) => Post.update({ _id }, {
    $set: {
      postimage,
      updatedAt: new Date(),
    },
  }),

  getOneByIdWithRelations: _id => new Promise((resolve, reject) => {
    const aggregation = [...getFullAggrigationWithoutQuery];
    aggregation.unshift({ $match: { _id: mongodbId(_id) } });
    aggregation.push(projectForFullArticle);
    Post
      .aggregate(aggregation)
      .then(posts => resolve(posts[0]))
      .catch(err => reject(err));
  }),

  getOneBySlugWithRelations: slug => new Promise((resolve, reject) => {
    const project = { ...projectForFullArticle };
    const aggregation = [...getFullAggrigationWithoutQuery];
    aggregation.unshift({ $match: { slug } });
    aggregation.push({ $lookup: join.comments });
    project.$project.comments = 1;
    aggregation.push(project);
    Post
      .aggregate(aggregation)
      .then(posts => resolve(posts[0]))
      .catch(err => reject(err));
  }),

  getNews: (page, filter = null) => {
    const offset = limit * (page - 1);
    const aggregation = [...getFullAggrigationWithoutQuery];
    aggregation.unshift({ $match: { isPublished: true } });
    aggregation.push(projectForFullArticle);
    if (filter) {
      aggregation.push({ $match: filter });
    }
    aggregation.push({ $limit: (limit * page) });
    aggregation.push({ $skip: offset });
    aggregation.push({ $sort: { updatedAt: -1 } });
    return Post.aggregate(aggregation);
  },

  getCount: (filter = null) => new Promise((resolve, reject) => {
    const aggregation = [...getFullAggrigationWithoutQuery];
    aggregation.unshift({ $match: { isPublished: true } });
    if (filter) {
      aggregation.push({ $match: filter });
    }
    aggregation.push({ $count: 'postsCount' });
    return Post.aggregate(aggregation)
      .then(posts => resolve(posts[0] ? posts[0].postsCount : []))
      .catch(err => reject(err));
  }),

  getUnpublished: () => Post.find({ isPublished: false }),

  delete: _id => Post.remove({ _id }),

  removeCategoryAndMakeUnpublished: category => Post.update({ category }, {
    $set: {
      category: '',
      isPublished: false,
    },
  },
  { multiple: true }),

  updateTagName: (oldName, newName) => Post.update(
    { tags: oldName },
    {
      $push: { tags: newName },
    },
    { multiple: true },
  )
    .then(() => Post.update(
      { tags: oldName },
      {
        $pull: { tags: oldName },
      },
      { multiple: true },
    )),

  removeTagFromPosts: tagName => Post.update(
    { tags: tagName },
    {
      $pull: { tags: tagName },
    },
    { multiple: true },
  ).then(() => Post.update(
    { tags: { $eq: [] } },
    { $set: { isPublished: false } },
    { multiple: true },
  )),

  addComment: (slug, commentId) => Post.findOneAndUpdate(
    { slug },
    {
      $push: { comments: commentId },
    },
  ),

  getAppliedComments: slug => Post.aggregate([
    { $match: { slug } },
    { $lookup: join.comments },
    { $project: { comments: 1 } },
  ]),

  findByCommentsIdArray: commentsIdArray => Post.aggregate([
    { $lookup: join.comments },
    {
      $match: {
        'comments._id': { $in: commentsIdArray },
      },
    },
    { $lookup: join.categories },
    {
      $unwind: {
        path: '$categories',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        slug: 1,
        h1: 1,
        comments:
        {
          $map:
          {
            input: '$comments',
            as: 'comments1',
            in: { $toString: '$$comments1._id' },
          },
        },
        categorySlug: '$categories.slug',
      },
    },
  ]),
};

module.exports = PostsQuery;
