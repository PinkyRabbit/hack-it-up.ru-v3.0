const fs = require('fs');
const path = require('path');
const { markdown } = require('markdown');

const getAboutMePage = async () => {
  const file = path.join(__dirname, '../README.md');
  const data = await fs.readFileSync(file, 'utf-8');
  const html = markdown.toHTML(data);
  return html;
};

module.exports = {
  getAboutMePage,
};
