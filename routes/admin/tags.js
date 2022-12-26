const express = require('express');

const tagsController = require('../../controllers/tags');
const {
  validateId,
  validateTag,
} = require('../validator');

const adminTagsRouter = express.Router();

adminTagsRouter
  .post('/', createTag)
  .get('/json', tagsJSON)
  .post('/:tagId', validateId('tagId'), validateTag, updateTag)
  .get('/:tagId/delete', validateId('tagId'), deleteTag);

async function tagsJSON(req, res) {
  const tags = await tagsController.getAllTags();
  return res.json(tags);
}

async function createTag(req, res) {
  const { tag } = req.body;
  const result = tagsController.createTag(tag);
  return res.send(result);
}

async function updateTag(req, res) {
  const { tagId } = req.params;
  const { name } = req.body;

  const { error } = await tagsController.updateTag(tagId, name);
  if (error) {
    req.flash('danger', error);
  } else {
    req.flash('success', `Тег "${name}" успешно обновлён!`);
  }

  return res.redirect('back');
}


async function deleteTag(req, res) {
  const { tagId } = req.params;
  const tag = await tagsController.deleteTag(tagId);

  req.flash('success', `Тег "${tag.name}" был успешно удалён!`);
  return res.redirect('back');
}

module.exports = adminTagsRouter;
